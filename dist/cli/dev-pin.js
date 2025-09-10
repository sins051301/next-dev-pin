#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// templates/scripts/dev-pin.ts
var import_fs2 = __toESM(require("fs"));

// templates/scripts/format.ts
var import_prettier = __toESM(require("prettier"));
var import_eslint = require("eslint");
function ensureBlankLineAfterImports(code) {
  return code.replace(
    /((?:^|\n)(?:import[\s\S]*?from\s+['"][^'"]+['"];?\s*\n)+)(?!\n)/,
    "$1\n"
  );
}
async function formatWithPrettierAndEslint(filePath, code) {
  var _a, _b, _c;
  let out = code;
  try {
    const config = (_a = await import_prettier.default.resolveConfig(filePath)) != null ? _a : {};
    out = await import_prettier.default.format(out, __spreadProps(__spreadValues({}, config), { filepath: filePath }));
  } catch (e) {
    console.warn("\u26A0\uFE0F Prettier \uD3EC\uB9F7 \uC2E4\uD328, \uADF8\uB300\uB85C \uC9C4\uD589\uD569\uB2C8\uB2E4:", e);
  }
  try {
    const eslint = new import_eslint.ESLint({ fix: true });
    const results = await eslint.lintText(out, { filePath });
    out = (_c = (_b = results[0]) == null ? void 0 : _b.output) != null ? _c : out;
  } catch (e) {
    console.warn("\u26A0\uFE0F ESLint --fix \uC2E4\uD328, fallback \uC801\uC6A9\uD569\uB2C8\uB2E4:", e);
    out = ensureBlankLineAfterImports(out);
  }
  return out;
}
var format_default = formatWithPrettierAndEslint;

// templates/scripts/util/to-target-path.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var APP_DIR = import_path.default.join(process.cwd(), "src", "app");
function toTargetPath(relativePath) {
  if (relativePath === "page") {
    const rootPage = import_path.default.join(APP_DIR, "page.tsx");
    if (import_fs.default.existsSync(rootPage)) {
      return rootPage;
    }
    const groupDirs = import_fs.default.readdirSync(APP_DIR, { withFileTypes: true }).filter((d) => d.isDirectory() && /^\(.+\)$/.test(d.name));
    for (const gd of groupDirs) {
      const candidate = import_path.default.join(APP_DIR, gd.name, "page.tsx");
      if (import_fs.default.existsSync(candidate)) {
        return candidate;
      }
    }
    return rootPage;
  }
  const parts = relativePath.split("/").filter(Boolean);
  let currentDir = APP_DIR;
  const resolvedParts = [];
  for (const p of parts) {
    const targetPath = import_path.default.join(currentDir, p);
    if (import_fs.default.existsSync(targetPath) && import_fs.default.statSync(targetPath).isDirectory()) {
      resolvedParts.push(p);
      currentDir = targetPath;
      continue;
    }
    const groupDirs = import_fs.default.readdirSync(currentDir, { withFileTypes: true }).filter((d) => d.isDirectory() && /^\(.+\)$/.test(d.name));
    const foundInGroup = groupDirs.find(
      (gd) => import_fs.default.existsSync(import_path.default.join(currentDir, gd.name, p))
    );
    if (foundInGroup) {
      resolvedParts.push(foundInGroup.name, p);
      currentDir = import_path.default.join(currentDir, foundInGroup.name, p);
      continue;
    }
    if (/^\d+$/.test(p)) {
      const dirs = import_fs.default.readdirSync(currentDir, { withFileTypes: true });
      const dynamic = dirs.find(
        (d) => d.isDirectory() && /^\[.+\]$/.test(d.name)
      );
      if (dynamic) {
        resolvedParts.push(dynamic.name);
        currentDir = import_path.default.join(currentDir, dynamic.name);
        continue;
      }
    }
    resolvedParts.push(p);
    currentDir = targetPath;
  }
  return import_path.default.join(APP_DIR, ...resolvedParts, "page.tsx");
}

// templates/scripts/dev-pin.ts
async function main() {
  const inputPath = process.argv[2];
  if (!import_fs2.default.existsSync(inputPath)) {
    console.error("\u274C dev-pin-input.json \uC5C6\uC74C:", inputPath);
    process.exit(1);
  }
  const { id, name, description, todos, x, y, relativePath } = JSON.parse(
    import_fs2.default.readFileSync(inputPath, "utf-8")
  );
  const targetFile = toTargetPath(relativePath);
  console.log("targetFile:", targetFile);
  if (!import_fs2.default.existsSync(targetFile)) {
    console.error("\u274C \uB300\uC0C1 page.tsx \uC5C6\uC74C:", targetFile);
    process.exit(1);
  }
  let content = import_fs2.default.readFileSync(targetFile, "utf-8");
  const hasImport = /import\s*\{\s*DevPin\s*\}\s*from\s+['"]next-dev-pin['"]/.test(content);
  if (!hasImport) {
    const importBlockRegex = /(^\s*import[\s\S]*?;\s*\n)/m;
    if (importBlockRegex.test(content)) {
      content = content.replace(
        importBlockRegex,
        "$1import { DevPin } from 'next-dev-pin';\n"
      );
    } else {
      content = `import { DevPin } from 'next-dev-pin';

${content}`;
    }
    console.log("\u2705 import \uCD94\uAC00\uB428");
  }
  const componentJSX = `
      {process.env.NEXT_PUBLIC_DEV_PIN_ENV === 'development' && (
        <DevPin
          id="${id}"
          name="${name}"
          ${description ? `description="${description}"` : ""}
          todos={[${todos.map((t) => `'${t}'`).join(", ")}]}
          x={${x || 30}}
          y={${y || 60}}
        />
      )}
  `;
  const returnWithParens = /return\s*\(([\s\S]*?)\);/m;
  const returnWithoutParens = /return\s*(<[\s\S]*?>);/m;
  let returnMatch = content.match(returnWithParens);
  let jsxContent = "";
  if (returnMatch) {
    jsxContent = returnMatch[1].trim();
    console.log("\u{1F3AF} return (...) \uD328\uD134 \uAC10\uC9C0");
  } else {
    returnMatch = content.match(returnWithoutParens);
    if (returnMatch) {
      jsxContent = returnMatch[1].trim();
      console.log("\u{1F3AF} return <...> \uD328\uD134 \uAC10\uC9C0");
    }
  }
  if (!jsxContent) {
    console.error("\u274C return \uBB38\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC74C");
    process.exit(1);
  }
  let newJSX = "";
  if (jsxContent.startsWith("<>") && jsxContent.endsWith("</>")) {
    console.log("\u{1F527} \uC774\uBBF8 Fragment \uAC10\uC2F8\uC9D0 \u2192 \uB0B4\uBD80 \uC0BD\uC785");
    newJSX = jsxContent.replace("</>", `${componentJSX}
</>`);
  } else {
    console.log("\u{1F527} Fragment\uB85C \uAC10\uC2F8\uAE30 \u2192 \uC0BD\uC785");
    newJSX = `<>
      ${jsxContent}
      ${componentJSX}
    </>`;
  }
  let newContent = content;
  if (content.match(returnWithParens)) {
    newContent = content.replace(
      returnWithParens,
      `return (
    ${newJSX}
  );`
    );
  } else if (content.match(returnWithoutParens)) {
    newContent = content.replace(
      returnWithoutParens,
      `return (
    ${newJSX}
  );`
    );
  }
  try {
    const final = await format_default(targetFile, newContent);
    import_fs2.default.writeFileSync(targetFile, final, "utf-8");
    console.log("\u2705 DevPin \uC0BD\uC785 \uBC0F \uD3EC\uB9F7\uD305 \uC644\uB8CC:", targetFile);
  } catch (e) {
    console.warn("\u26A0\uFE0F \uD3EC\uB9F7\uD305 \uC2E4\uD328, \uC6D0\uBCF8 \uC800\uC7A5:", e);
    import_fs2.default.writeFileSync(targetFile, newContent, "utf-8");
    console.log("\u2705 DevPin \uC0BD\uC785 \uC644\uB8CC (\uD3EC\uB9F7\uD305 \uC5C6\uC74C):", targetFile);
  }
}
main().catch((e) => {
  console.error("\u274C \uC5D0\uB7EC:", e);
  process.exit(1);
});
