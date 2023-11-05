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
						path.join(outDir, "story-tree.astro"),
						await generateStoryTree(options),
						"utf-8",
					),
					fs.writeFile(
						path.join(outDir, "index.astro"),
						await generateIndexPage(options),
						"utf-8",
					),
					fs.writeFile(
						path.join(outDir, "story.astro"),
						await generateStoryPage(options),
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

async function generateStoryTree(options: PlaygroundOptions): Promise<string> {
	let src = await fs.readFile(path.join(outDir, "story-tree.astro"), "utf-8");
	return src
		.replace("{{stories}}", options.stories)
		.replace("{{path}}", options.path);
}

async function generateIndexPage(options: PlaygroundOptions): Promise<string> {
	let src = await fs.readFile(path.join(outDir, "index.astro"), "utf-8");
	return src
		.replace("{{layout}}", options.layout)
		.replace("{{stories}}", options.stories)
		.replace("{{path}}", options.path);
}

async function generateStoryPage(options: PlaygroundOptions) {
	let src = await fs.readFile(path.join(outDir, "story.astro"), "utf-8");
	return src
		.replace("{{layout}}", options.layout)
		.replace("{{stories}}", options.stories)
		.replace("{{path}}", options.path);
}

export default playground;
