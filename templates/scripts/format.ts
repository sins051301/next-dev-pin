import prettier from "prettier";
import { ESLint } from "eslint";

// 캐시 맵
const prettierConfigCache = new Map<string, prettier.Options>();

// ESLint 인스턴스 캐시 (한 번만 생성)
let eslintInstance: ESLint | null = null;

// import 블록 뒤에 빈 줄이 없으면 추가 (fallback)
function ensureBlankLineAfterImports(code: string) {
  return code.replace(
    /((?:^|\n)(?:import[\s\S]*?from\s+['"][^'"]+['"];?\s*\n)+)(?!\n)/,
    "$1\n"
  );
}

async function formatWithPrettierAndEslint(filePath: string, code: string) {
  let out = code;

  // 1) Prettier
  try {
    let config = prettierConfigCache.get(filePath);

    if (!config) {
      config = (await prettier.resolveConfig(filePath)) ?? {};
      prettierConfigCache.set(filePath, config);
    }

    out = await prettier.format(out, { ...config, filepath: filePath });
  } catch (e) {
    console.warn("⚠️ Prettier 포맷 실패, 그대로 진행합니다:", e);
  }

  // 2) ESLint --fix
  try {
    if (!eslintInstance) {
      eslintInstance = new ESLint({ fix: true });
    }

    const results = await eslintInstance.lintText(out, { filePath });
    out = results[0]?.output ?? out;
  } catch (e) {
    console.warn("⚠️ ESLint --fix 실패, fallback 적용합니다:", e);
    out = ensureBlankLineAfterImports(out);
  }

  return out;
}

export default formatWithPrettierAndEslint;
