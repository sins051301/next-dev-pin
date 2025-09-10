#!/usr/bin/env node

import fs from "fs";
import getStdin from "get-stdin"; // npm i get-stdin
import formatWithPrettierAndEslint from "./format";
import toTargetPath from "./util/to-target-path";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function removeDevPinBlocksById(content: string, todoId: string) {
  const idEsc = escapeRegExp(todoId);

  // ✅ 조건부 + self-closing
  const reConditionalSelfClosing = new RegExp(
    String.raw`{process\.env\.NEXT_PUBLIC_DEV_PIN_ENV\s*===\s*['"]development['"]\s*&&\s*\(\s*<DevPin\b[^>]*\bid\s*=\s*["'\`]${idEsc}["'\`][^>]*?\/>\s*\)}\s*`,
    "gm"
  );

  // ✅ 조건부 + paired
  const reConditionalPaired = new RegExp(
    String.raw`{process\.env\.NEXT_PUBLIC_DEV_PIN_ENV\s*===\s*['"]development['"]\s*&&\s*\(\s*<DevPin\b[^>]*\bid\s*=\s*["'\`]${idEsc}["'\`][\s\S]*?<\/DevPin>\s*\)}\s*`,
    "gm"
  );

  // ✅ 혹시 조건부 wrapper 없이 바로 <DevPin .../> 가 삽입된 경우 방어
  const reSelfClosing = new RegExp(
    String.raw`<DevPin\b[^>]*\bid\s*=\s*["'\`]${idEsc}["'\`][^>]*?\/>\s*`,
    "gm"
  );
  const rePaired = new RegExp(
    String.raw`<DevPin\b[^>]*\bid\s*=\s*["'\`]${idEsc}["'\`][\s\S]*?<\/DevPin>\s*`,
    "gm"
  );

  const next = content
    .replace(reConditionalSelfClosing, "")
    .replace(reConditionalPaired, "")
    .replace(reSelfClosing, "")
    .replace(rePaired, "");

  // 여분 공백 정리
  return next.replace(/\r?\n{3,}/g, "\n\n").replace(/[ \t]+\r?\n/g, "\n");
}

function removeImportIfUnused(content: string) {
  // 남아 있는 <DevPin> 사용이 있으면 import 유지
  if (/<DevPin\b/.test(content)) return content;

  // ✅ named import 형태 감지 → import { DevPin } from 'dev-pin'
  const reImportNamed =
    /import\s*\{\s*DevPin\s*\}\s*from\s+['"]dev-pin['"];?\s*\r?\n?/g;

  // 혹시 다른 경로에서 불러온 경우도 제거
  const reImportAnyNamed =
    /import\s*\{\s*DevPin\s*(?:,\s*[^}]*)?\}\s*from\s+['"][^'"]+['"];?\s*\r?\n?/g;

  const next = content.replace(reImportNamed, "").replace(reImportAnyNamed, "");

  return next.replace(/\r?\n{3,}/g, "\n\n");
}

async function main() {
  // ✅ stdin에서 JSON 받기
  const input = await getStdin();
  if (!input) {
    console.error("❌ 입력(JSON)이 비어 있음");
    process.exit(1);
  }

  let payload: { id: string; relativePath: string };
  try {
    payload = JSON.parse(input);
  } catch (e) {
    console.error("❌ JSON 파싱 실패:", e);
    process.exit(1);
  }

  const { id, relativePath } = payload;

  if (!id || !relativePath) {
    console.error("❌ 입력값 부족: id, relativePath가 필요합니다.");
    process.exit(1);
  }

  const targetFile = toTargetPath(relativePath);

  if (!fs.existsSync(targetFile)) {
    console.error("❌ 대상 파일 없음:", targetFile);
    process.exit(1);
  }

  let content = fs.readFileSync(targetFile, "utf-8");

  // 1) 해당 id의 DevPin 블록 제거
  const afterRemoval = removeDevPinBlocksById(content, id);
  if (afterRemoval === content) {
    console.warn('⚠️ 삭제 대상 <DevPin id="%s" /> 를 찾지 못했습니다.', id);
  }
  content = afterRemoval;

  // 2) import 정리
  content = removeImportIfUnused(content);

  // 3) Prettier → ESLint --fix
  try {
    const final = await formatWithPrettierAndEslint(targetFile, content);
    fs.writeFileSync(targetFile, final, "utf-8");
    console.log("✅ DevPin 제거 + Prettier 완료:", targetFile);
  } catch (e) {
    console.warn("⚠️ 포맷팅 실패, 원본 저장:", e);
    fs.writeFileSync(targetFile, content, "utf-8");
    console.log("✅ DevPin 제거 완료 (포맷팅 없음):", targetFile);
  }
}

main().catch((e) => {
  console.error("❌ 에러:", e);
  process.exit(1);
});
