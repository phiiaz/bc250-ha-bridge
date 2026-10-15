// Bundles the card into ../dist/bc250-card.js (the file HACS serves).
// `--tests` instead compiles the pure logic modules in src/lib to .test-build/ for node --test.
import { build, context } from "esbuild";

const args = process.argv.slice(2);

if (args.includes("--tests")) {
  await build({
    entryPoints: ["src/lib/*.ts"],
    outdir: ".test-build",
    format: "esm",
    target: "es2022",
    logLevel: "warning",
  });
} else {
  const options = {
    entryPoints: ["src/bc250-card.ts"],
    outfile: "../dist/bc250-card.js",
    bundle: true,
    minify: !args.includes("--watch"),
    format: "esm",
    target: "es2022",
    legalComments: "none",
    tsconfig: "tsconfig.json",
    logLevel: "info",
  };
  if (args.includes("--watch")) {
    const ctx = await context(options);
    await ctx.watch();
  } else {
    await build(options);
  }
}
