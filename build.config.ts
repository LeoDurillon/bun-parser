import dts from "bun-plugin-dts";

Bun.build({
  entrypoints: ["./src/index.ts"],
  minify: true,
  outdir: "./dist",
  target: "node",
  plugins: [dts()],
});
