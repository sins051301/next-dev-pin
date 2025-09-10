import fs from "fs";
import formatWithPrettierAndEslint from "./format";
import toTargetPath from "./util/to-target-path";

async function main() {
  const inputPath = "src/scripts/dev-to-do-input.json";
  if (!fs.existsSync(inputPath)) {
    console.error("❌ dev-to-do-input.json 없음");
    process.exit(1);
  }

  const { id, name, description, todos, x, y, relativePath } = JSON.parse(
    fs.readFileSync(inputPath, "utf-8")
  );

  const targetFile = toTargetPath(relativePath);
  console.log("targetFile:", targetFile);

  if (!fs.existsSync(targetFile)) {
    console.error("❌ 대상 page.tsx 없음:", targetFile);
    process.exit(1);
  }

  let content = fs.readFileSync(targetFile, "utf-8");

  const hasImport = /import\s+DevTodo\s+from\s+['"]@\/ui\/dev-to-do['"]/.test(
    content
  );
  if (!hasImport) {
    const importBlockRegex = /(^\s*import[\s\S]*?;\s*\n)/m;
    if (importBlockRegex.test(content)) {
      content = content.replace(
        importBlockRegex,
        "$1import DevTodo from '@/ui/dev-to-do';\n"
      );
    } else {
      content = `import DevTodo from '@/ui/dev-to-do';\n\n${content}`;
    }
    console.log("✅ import 추가됨");
  }

  const componentJSX = `
      {process.env.NEXT_PUBLIC_DEV_TO_DO_ENV === 'development' && (
        <DevTodo
          id="${id}"
          name="${name}"
          ${description ? `description="${description}"` : ""}
          todos={[${(todos as string[]).map((t) => `'${t}'`).join(", ")}]}
          x={${x || 30}}
          y={${y || 60}}
        />
      )}
  `;

  // === return 문 잡기 ===
  // 1) return ( ... );
  const returnWithParens = /return\s*\(([\s\S]*?)\);/m;
  // 2) return <JSX />;
  const returnWithoutParens = /return\s*(<[\s\S]*?>);/m;

  let returnMatch = content.match(returnWithParens);
  let jsxContent = "";

  if (returnMatch) {
    jsxContent = returnMatch[1].trim();
    console.log("🎯 return (...) 패턴 감지");
  } else {
    returnMatch = content.match(returnWithoutParens);
    if (returnMatch) {
      jsxContent = returnMatch[1].trim();
      console.log("🎯 return <...> 패턴 감지");
    }
  }

  if (!jsxContent) {
    console.error("❌ return 문을 찾을 수 없음");
    process.exit(1);
  }

  let newJSX = "";

  if (jsxContent.startsWith("<>") && jsxContent.endsWith("</>")) {
    // 이미 Fragment → 내부에 추가
    console.log("🔧 이미 Fragment 감싸짐 → 내부 삽입");
    newJSX = jsxContent.replace("</>", `${componentJSX}\n</>`);
  } else {
    // Fragment로 감싸고 추가
    console.log("🔧 Fragment로 감싸기 → 삽입");
    newJSX = `<>
      ${jsxContent}
      ${componentJSX}
    </>`;
  }

  let newContent = content;

  if (content.match(returnWithParens)) {
    // return (...) 치환
    newContent = content.replace(
      returnWithParens,
      `return (
    ${newJSX}
  );`
    );
  } else if (content.match(returnWithoutParens)) {
    // return <...> 치환
    newContent = content.replace(
      returnWithoutParens,
      `return (
    ${newJSX}
  );`
    );
  }

  // ✅ Prettier + ESLint 적용
  try {
    const final = await formatWithPrettierAndEslint(targetFile, newContent);
    fs.writeFileSync(targetFile, final, "utf-8");
    console.log("✅ DevTodo 삽입 및 포맷팅 완료:", targetFile);
  } catch (e) {
    console.warn("⚠️ 포맷팅 실패, 원본 저장:", e);
    fs.writeFileSync(targetFile, newContent, "utf-8");
    console.log("✅ DevTodo 삽입 완료 (포맷팅 없음):", targetFile);
  }
}

main().catch((e) => {
  console.error("❌ 에러:", e);
  process.exit(1);
});
