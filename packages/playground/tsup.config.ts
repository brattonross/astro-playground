import { promises as fs } from "node:fs";
import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./src/index.ts"],
	dts: true,
	format: "esm",
	sourcemap: true,
	onSuccess: async () => {
		const files = await fs.readdir("src");
		await Promise.all(
			files
				.filter((file) => file !== "index.ts")
				.map((file) => fs.copyFile(`src/${file}`, `dist/${file}`)),
		);
	},
});
