import { promises as fs } from "node:fs";
import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./src/index.ts"],
	dts: true,
	format: "esm",
	sourcemap: true,
	onSuccess: async () => {
		await fs.cp("./src/tree-item.astro", "./dist/tree-item.astro");
	},
});
