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

// templates/scripts/remove-dev-pin.ts
var import_fs2 = __toESM(require("fs"));
var import_get_stdin = __toESM(require("get-stdin"));

// templates/scripts/format.ts
var import_prettier = __toESM(require("prettier"));
var import_eslint = require("eslint");
var prettierConfigCache = /* @__PURE__ */ new Map();
var eslintInstance = null;
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
    let config = prettierConfigCache.get(filePath);
    if (!config) {
      config = (_a = await import_prettier.default.resolveConfig(filePath)) != null ? _a : {};
      prettierConfigCache.set(filePath, config);
    }
    out = await import_prettier.default.format(out, __spreadProps(__spreadValues({}, config), { filepath: filePath }));
  } catch (e) {
    console.warn("\u26A0\uFE0F Prettier \uD3EC\uB9F7 \uC2E4\uD328, \uADF8\uB300\uB85C \uC9C4\uD589\uD569\uB2C8\uB2E4:", e);
  }
  try {
    if (!eslintInstance) {
      eslintInstance = new import_eslint.ESLint({ fix: true });
    }
    const results = await eslintInstance.lintText(out, { filePath });
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

// templates/scripts/remove-dev-pin.ts
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function removeDevPinBlocksById(content, todoId) {
  const idEsc = escapeRegExp(todoId);
  const reConditionalSelfClosing = new RegExp(
    String.raw`{process\.env\.NEXT_PUBLIC_DEV_PIN_ENV\s*===\s*['"]development['"]\s*&&\s*\(\s*<DevPin\b[^>]*\bid\s*=\s*["'\`]${idEsc}["'\`][^>]*?\/>\s*\)}\s*`,
    "gm"
  );
  const reConditionalPaired = new RegExp(
    String.raw`{process\.env\.NEXT_PUBLIC_DEV_PIN_ENV\s*===\s*['"]development['"]\s*&&\s*\(\s*<DevPin\b[^>]*\bid\s*=\s*["'\`]${idEsc}["'\`][\s\S]*?<\/DevPin>\s*\)}\s*`,
    "gm"
  );
  const reSelfClosing = new RegExp(
    String.raw`<DevPin\b[^>]*\bid\s*=\s*["'\`]${idEsc}["'\`][^>]*?\/>\s*`,
    "gm"
  );
  const rePaired = new RegExp(
    String.raw`<DevPin\b[^>]*\bid\s*=\s*["'\`]${idEsc}["'\`][\s\S]*?<\/DevPin>\s*`,
    "gm"
  );
  const next = content.replace(reConditionalSelfClosing, "").replace(reConditionalPaired, "").replace(reSelfClosing, "").replace(rePaired, "");
  return next.replace(/\r?\n{3,}/g, "\n\n").replace(/[ \t]+\r?\n/g, "\n");
}
function removeImportIfUnused(content) {
  if (/<DevPin\b/.test(content)) return content;
  const reImportNamed = /import\s*\{\s*DevPin\s*\}\s*from\s+['"]dev-pin['"];?\s*\r?\n?/g;
  const reImportAnyNamed = /import\s*\{\s*DevPin\s*(?:,\s*[^}]*)?\}\s*from\s+['"][^'"]+['"];?\s*\r?\n?/g;
  const next = content.replace(reImportNamed, "").replace(reImportAnyNamed, "");
  return next.replace(/\r?\n{3,}/g, "\n\n");
}
async function main() {
  const input = await (0, import_get_stdin.default)();
  if (!input) {
    console.error("\u274C \uC785\uB825(JSON)\uC774 \uBE44\uC5B4 \uC788\uC74C");
    process.exit(1);
  }
  let payload;
  try {
    payload = JSON.parse(input);
  } catch (e) {
    console.error("\u274C JSON \uD30C\uC2F1 \uC2E4\uD328:", e);
    process.exit(1);
  }
  const { id, relativePath } = payload;
  if (!id || !relativePath) {
    console.error("\u274C \uC785\uB825\uAC12 \uBD80\uC871: id, relativePath\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.");
    process.exit(1);
  }
  const targetFile = toTargetPath(relativePath);
  if (!import_fs2.default.existsSync(targetFile)) {
    console.error("\u274C \uB300\uC0C1 \uD30C\uC77C \uC5C6\uC74C:", targetFile);
    process.exit(1);
  }
  let content = import_fs2.default.readFileSync(targetFile, "utf-8");
  const afterRemoval = removeDevPinBlocksById(content, id);
  if (afterRemoval === content) {
    console.warn('\u26A0\uFE0F \uC0AD\uC81C \uB300\uC0C1 <DevPin id="%s" /> \uB97C \uCC3E\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.', id);
  }
  content = afterRemoval;
  content = removeImportIfUnused(content);
  try {
    const final = await format_default(targetFile, content);
    import_fs2.default.writeFileSync(targetFile, final, "utf-8");
    console.log("\u2705 DevPin \uC81C\uAC70 + Prettier \uC644\uB8CC:", targetFile);
  } catch (e) {
    console.warn("\u26A0\uFE0F \uD3EC\uB9F7\uD305 \uC2E4\uD328, \uC6D0\uBCF8 \uC800\uC7A5:", e);
    import_fs2.default.writeFileSync(targetFile, content, "utf-8");
    console.log("\u2705 DevPin \uC81C\uAC70 \uC644\uB8CC (\uD3EC\uB9F7\uD305 \uC5C6\uC74C):", targetFile);
  }
}
main().catch((e) => {
  console.error("\u274C \uC5D0\uB7EC:", e);
  process.exit(1);
});
