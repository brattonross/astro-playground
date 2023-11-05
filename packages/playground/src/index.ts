/// <reference types="astro/client" />
import { promises as fs } from "node:fs";
import path from "node:path";
import type { AstroIntegration } from "astro";

const outDir = path.dirname(new URL(import.meta.url).pathname);

export type UserPlaygroundOptions = {
	/**
	 * The path to the layout component to use.
	 * Useful if you want to inject custom styles or scripts.
	 */
	layout?: string;
	/**
	 * The base path of the playground.
	 * @default "/playground"
	 */
	path?: string;
	/**
	 * Glob of story files.
	 */
	stories?: string;
};
type PlaygroundOptions = Required<UserPlaygroundOptions>;

export function playground(
	userOptions: UserPlaygroundOptions = {},
): AstroIntegration {
	const options = resolveOptions(userOptions);

	return {
		name: "@brattonross/astro-playground",
		hooks: {
			"astro:config:setup": async ({ injectRoute, logger }) => {
				logger.debug(`Writing playground files to: ${outDir}`);
				await Promise.all([
					fs.writeFile(
						path.join(outDir, "actions.generated.astro"),
						await generateFile("actions.astro", options),
						"utf-8",
					),
					fs.writeFile(
						path.join(outDir, "story-tree.generated.astro"),
						await generateFile("story-tree.astro", options),
						"utf-8",
					),
					fs.writeFile(
						path.join(outDir, "index.generated.astro"),
						await generateFile("index.astro", options),
						"utf-8",
					),
					fs.writeFile(
						path.join(outDir, "story.generated.astro"),
						await generateFile("story.astro", options),
						"utf-8",
					),
				]);
				logger.debug(
					`Successfully wrote playground files to: ${outDir}`,
				);

				logger.debug(`Injecting routes under route: ${options.path}`);
				injectRoute({
					pattern: options.path,
					entryPoint: "@brattonross/astro-playground/index.astro",
				});
				injectRoute({
					pattern: path.join(options.path, "[...slug]"),
					entryPoint: "@brattonross/astro-playground/story.astro",
				});
				logger.debug(
					`Successfully injected routes under route: ${options.path}`,
				);
			},
		},
	};
}

function resolveOptions(options: UserPlaygroundOptions): PlaygroundOptions {
	let basePath = options.path ?? "/playground";
	basePath = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;

	return {
		layout: options.layout ?? path.join(outDir, "layout.astro"),
		path: options.path ?? "/playground",
		stories: options.stories ?? "/src/**/*.stories.astro",
	};
}

async function generateFile(
	input: string,
	options: PlaygroundOptions,
): Promise<string> {
	let src = await fs.readFile(path.join(outDir, input), "utf-8");
	return src
		.replaceAll("{{layout}}", options.layout)
		.replaceAll("{{stories}}", options.stories)
		.replaceAll("{{path}}", options.path);
}

export default playground;
