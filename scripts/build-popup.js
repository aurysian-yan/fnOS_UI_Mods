#!/usr/bin/env node
"use strict";

const path = require("node:path");
const esbuild = require("esbuild");

const ROOT_DIR = path.resolve(__dirname, "..");

async function main() {
  await esbuild.build({
    absWorkingDir: ROOT_DIR,
    entryPoints: {
      popup: "src/popup/main.tsx"
    },
    outdir: ROOT_DIR,
    bundle: true,
    format: "iife",
    jsx: "automatic",
    target: ["chrome109"],
    entryNames: "[name]",
    assetNames: "assets/[name]",
    minify: true,
    sourcemap: false,
    logLevel: "info",
    loader: {
      ".ttf": "file"
    }
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
