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
    entry: ["src/cli.ts"],
    format: ["cjs"],
    clean: false,
    tsconfig: "tsconfig.build.json",
    outDir: "dist",
    external: ["fs", "path"],
    noExternal: [],
  },
]);
