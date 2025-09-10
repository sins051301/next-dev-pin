#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/cli.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
function init() {
  const root = process.cwd();
  const routeTemplate = import_path.default.join(
    __dirname,
    "../../templates/app/api/dev-pin/route.ts"
  );
  const appRoot = import_fs.default.existsSync(import_path.default.join(root, "src/app")) ? import_path.default.join(root, "src/app") : import_path.default.join(root, "app");
  const routeDest = import_path.default.join(appRoot, "api/dev-pin/route.ts");
  import_fs.default.mkdirSync(import_path.default.dirname(routeDest), { recursive: true });
  if (!import_fs.default.existsSync(routeDest)) {
    import_fs.default.copyFileSync(routeTemplate, routeDest);
    console.log(`\u2705 ${import_path.default.relative(root, routeDest)} \uC0DD\uC131\uB428`);
  } else {
    console.log(`\u26A0\uFE0F ${import_path.default.relative(root, routeDest)} \uC774\uBBF8 \uC874\uC7AC, \uAC74\uB108\uB700`);
  }
}
var command = process.argv[2];
if (command === "init") {
  init();
} else {
  console.log("\uC0AC\uC6A9\uBC95: npx dev-pin init");
}
