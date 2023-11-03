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
						path.join(outDir, "story.astro"),
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
	`<p style="margin: 0; color: var(--pg-gray-11);">Select a story from the sidebar to get started</p>`,
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
	<script is:inline>
		if (window.location.search.includes("dir=rtl")) {
			document.documentElement.dir = "rtl";
		}
	</script>
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
		<header role="banner">
			<ul>
				<li>
					<button is="pg-rtl-button" aria-label="Switch text direction to right to left." title="Switch text direction to right to left." role="button" type="button">
						RTL
					</button>
				</li>
			</ul>
		</header>
	</div>
	<script>
		class ToggleButton extends HTMLButtonElement {
			public connectedCallback() {
				this.setAttribute("aria-pressed", "false");
				this.addEventListener("click", this.#handleClick);
			}

			public disconnectedCallback() {
				this.removeEventListener("click", this.#handleClick);
			}

			#handleClick(event) {
				const pressed = this.getAttribute("aria-pressed") === "true";
				this.setAttribute("aria-pressed", String(!pressed));
			}
		}

		class LeftToRightButton extends ToggleButton {
			#observer = new MutationObserver(this.#handleMutation.bind(this));

			public connectedCallback() {
				super.connectedCallback();
				this.setAttribute("aria-pressed", window.location.search.includes("dir=rtl") ? "true" : "false");
				this.#observer.observe(this, { attributes: true });
			}

			public disconnectedCallback() {
				super.disconnectedCallback();
				this.#observer.disconnect();
			}

			#handleMutation(mutations) {
				for (const mutation of mutations) {
					if (mutation.attributeName === "aria-pressed") {
						const pressed = this.getAttribute("aria-pressed") === "true";
						const url = new URL(window.location.href);
						if (pressed) {
							document.documentElement.dir = "rtl";
							url.searchParams.set("dir", "rtl");
						} else {
							document.documentElement.removeAttribute("dir");
							url.searchParams.delete("dir");
						}
						window.history.pushState({}, "", url.toString());
					}
				}
			}
		}

		window.customElements.define("pg-toggle-button", ToggleButton, { extends: "button" });
		window.customElements.define("pg-rtl-button", LeftToRightButton, { extends: "button" });
	</script>
</body>
</html>

<style>
/* Variables from https://www.radix-ui.com/colors */
:root {
	--pg-gray-2: #f9f9f9;
	--pg-gray-11: #646464;
	--pg-gray-12: #202020;
	--pg-gray-a6: #00000026;

	--pg-indigo-a3: #0047F112;
	--pg-indigo-a5: #0044FF2D;
	--pg-indigo-a7: #0037ED54;
	--pg-indigo-11: #3A5BC7;

	--pg-primary-a3: var(--pg-indigo-a3);
	--pg-primary-a5: var(--pg-indigo-a5);
	--pg-primary-a7: var(--pg-indigo-a7);
	--pg-primary-11: var(--pg-indigo-11);

	--pg-sidebar-width: 300px;
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
	color: var(--pg-gray-12);
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
	flex: 0 0 var(--pg-sidebar-width);
	min-height: max-content;
	box-shadow: -1px 0 var(--pg-gray-a6);
	background-color: var(--pg-gray-2);
}
[dir="rtl"] #__playground > aside {
	box-shadow: 1px 0 var(--pg-gray-a6);
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
#__playground > header {
	position: fixed;
	padding: 0.5rem;
	margin: 0 auto;
	width: min(100%, 400px);
	max-width: 100%;
	left: 0;
	right: var(--pg-sidebar-width);
	bottom: 0;
}
[dir="rtl"] #__playground > header {
	left: var(--pg-sidebar-width);
	right: 0;
}
#__playground > header ul {
	display: flex;
	align-items: center;
	column-gap: 0.5rem;
	flex-direction: row;
	list-style: none;
	margin: 0;
	padding: 0.25rem;
	border-radius: 0.5rem;
	border: 1px solid var(--pg-gray-a6);
	box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}
#__playground > header button {
	appearance: none;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 2rem;
	padding: 0 0.5rem;
	font-weight: 500;
	font-size: 0.75rem;
	line-height: 1rem;
	margin: 0;
	border: none;
	border-radius: 0.375rem;
	color: var(--pg-gray-12);
	background-color: transparent;
	flex: 0 0 auto;
}
#__playground > header button:hover {
	background-color: var(--pg-primary-a3);
	color: var(--pg-primary-11);
}
#__playground > header button:focus {
	outline: none;
	box-shadow: 0 0 0 2px var(--pg-primary-a7);
}
#__playground > header button[aria-pressed="true"] {
	background-color: var(--pg-primary-a5);
	color: var(--pg-primary-11);
}
</style>`;
}

export default playground;
