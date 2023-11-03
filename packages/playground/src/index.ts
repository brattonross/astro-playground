/// <reference types="astro/client" />
import { promises as fs } from "node:fs";
import path from "node:path";
import type { AstroIntegration } from "astro";

const outDir = path.dirname(new URL(import.meta.url).pathname);

export type UserPlaygroundOptions = {
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
				logger.debug(`Writing playground routes to: ${outDir}`);
				await Promise.all([
					fs.writeFile(
						path.join(outDir, "index.astro"),
						generateIndexPage(options),
						"utf-8",
					),
					fs.writeFile(
						path.join(outDir, "playground.astro"),
						generateStoryPage(options),
						"utf-8",
					),
				]);
				logger.debug(
					`Successfully wrote playground routes to: ${outDir}`,
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
		path: options.path ?? "/playground",
		stories: options.stories ?? "/src/**/*.stories.astro",
	};
}

function generateIndexPage(options: PlaygroundOptions) {
	return `---
import path from "node:path";

function kebabCase(str) {
	return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function titleCase(str) {
	return str
		.split("-")
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join(" ");
}
const files = await Astro.glob("${options.stories}");
const stories = files.map((story) => {
	const slug = kebabCase(path.basename(story.file, ".stories.astro"));
	return {
		label: titleCase(slug),
		href: "${options.path}" + "/" + slug,
	};
});
---

${baseHTML(
	`<p style="margin: 0; color: var(--gray-11);">Select a story from the sidebar to get started.</p>`,
)}
`;
}

function generateStoryPage(options: PlaygroundOptions) {
	return `---
import path from "node:path";

export async function getStaticPaths() {
	function kebabCase(str) {
		return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
	}
	function titleCase(str) {
		return str
			.split("-")
			.map((word) => word[0].toUpperCase() + word.slice(1))
			.join(" ");
	}
	const stories = await Astro.glob("${options.stories}");
	return stories.map((story) => {
		const slug = kebabCase(path.basename(story.file, ".stories.astro"));
		return {
			params: { slug },
			props: {
				stories: stories.map((s) => {
					return {
						label: titleCase(slug),
						href: "${options.path}" + "/" + slug,
					};
				}),
				story
			},
		};
	});
}

const { stories, story } = Astro.props;
---

${baseHTML(`<story.default />`)}`;
}

function baseHTML(children: string) {
	return `<!doctype html>
<html lang="en">
<head>
</head>
<body>
	<div id="__playground">
		<main>
			${children}
		</main>
		<aside>
			<nav>
				<ul role="tree">
					{stories.map((story) => (
						<li role="treeitem" title={story.label}>
							<a href={story.href}>{story.label}</a>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	</div>
</body>
</html>

<style>
/* Variables from https://www.radix-ui.com/colors */
:root {
	--gray-2: #f9f9f9;
	--gray-11: #646464;
	--gray-12: #202020;
	--gray-a6: #00000026;
}

* {
	box-sizing: border-box;
}

html, body {
	margin: 0;
	padding: 0;
	height: 100%;
}

body {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	background-color: white;
	color: var(--gray-12);
}

#__playground {
	display: flex;
	height: 100svh;
	overflow: hidden;
}
#__playground > main {
	flex: 1 1 auto;
	overflow-y: auto;
	padding: 1.5rem;
}
#__playground > aside {
	flex: 0 0 300px;
	min-height: max-content;
	box-shadow: -1px 0 var(--gray-a6);
	background-color: var(--gray-2);
}
#__playground > aside nav {
	padding: 1rem;
	overflow-y: auto;
}
#__playground > aside ul {
	list-style: none;
	margin: 0;
	padding: 0;
}
</style>`;
}

export default playground;
