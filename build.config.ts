import dts from "bun-plugin-dts";

Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "node",
  plugins: [dts()],
});
