#!/usr/bin/env node

import fs from "fs";
import path from "path";

function copyDir(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(src)) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✅ ${path.relative(process.cwd(), destPath)} 생성됨`);
      } else {
        console.log(
          `⚠️ ${path.relative(process.cwd(), destPath)} 이미 존재, 건너뜀`
        );
      }
    }
  }
}

function init() {
  const root = process.cwd();

  // ✅ 1. scripts 복사
  const scriptsTemplate = path.join(__dirname, "../templates/scripts");
  if (fs.existsSync(scriptsTemplate)) {
    const dest = path.join(root, "scripts");
    copyDir(scriptsTemplate, dest);
  } else {
    console.error(
      "❌ templates/scripts 폴더를 찾을 수 없습니다:",
      scriptsTemplate
    );
  }

  // ✅ 2. app/api/dev-pin/route.ts 복사
  const routeTemplate = path.join(
    __dirname,
    "../templates/app/api/dev-pin/route.ts"
  );

  // 프로젝트에 src/app이 있으면 그쪽, 없으면 app/ 바로 밑에 생성
  const appRoot = fs.existsSync(path.join(root, "src/app"))
    ? path.join(root, "src/app")
    : path.join(root, "app");

  const routeDest = path.join(appRoot, "api/dev-pin/route.ts");

  fs.mkdirSync(path.dirname(routeDest), { recursive: true });
  if (!fs.existsSync(routeDest)) {
    fs.copyFileSync(routeTemplate, routeDest);
    console.log(`✅ ${path.relative(root, routeDest)} 생성됨`);
  } else {
    console.log(`⚠️ ${path.relative(root, routeDest)} 이미 존재, 건너뜀`);
  }
}

const command = process.argv[2];
if (command === "init") {
  init();
} else {
  console.log("사용법: npx dev-pin init");
}
