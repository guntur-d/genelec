// esbuild.config.mjs
import { context } from "esbuild"

async function run() {
  const ctx = await context({
    entryPoints: ["src/index.js"],
    bundle: true,
    outfile: "public/bundle.js",
    minify: true,
    sourcemap: true,
    target: ["es2020"],
    format: "iife",
  })

  console.log("✅ Initial JS build complete")
  await ctx.watch()
  console.log("🛠️ Watching JS for changes…")
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})