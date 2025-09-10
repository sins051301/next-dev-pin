import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    tsconfig: "tsconfig.build.json",
    external: ["react", "react-dom", "next", "react/jsx-runtime"],
    banner: {
      js: '"use client";',
    },
  },
  {
    entry: {
      "cli/cli": "src/cli.ts", // dist/cli/cli.js
      "cli/dev-pin": "templates/scripts/dev-pin.ts", // dist/cli/dev-pin.js
      "cli/remove-dev-pin": "templates/scripts/remove-dev-pin.ts", // dist/cli/remove-dev-pin.js
    },
    format: ["cjs"],
    clean: false,
    tsconfig: "tsconfig.build.json",
    outDir: "dist",
    external: ["fs", "path", "os", "child_process"],
  },
]);
