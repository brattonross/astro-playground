import type { AstroGlobal } from "astro";
import path from "node:path";

export type Story = {
	label: string;
	href?: string;
	stories?: Story[];
};

export function kebabCase(str: string) {
	return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export function titleCase(str: string) {
	return str
		.split("-")
		.map((word) => word[0]?.toUpperCase() + word.slice(1))
		.join(" ");
}

export function parseStories(basePath: string, files: Array<any>) {
	const stories: Array<Story> = [];
	function parse(list: Array<Story>, filename: string, currentPath = "/") {
		const nextSplitIndex = filename.indexOf("--");
		if (nextSplitIndex === -1) {
			const slug = kebabCase(path.basename(filename, ".stories.astro"));
			list.push({
				label: titleCase(slug),
				href: basePath + currentPath + slug,
			});
		} else {
			const groupName = kebabCase(filename.slice(0, nextSplitIndex));
			const remainder = filename.slice(nextSplitIndex + 2);
			let group = list.find(
				(item) =>
					item.label === titleCase(groupName) && "stories" in item,
			);
			if (!group) {
				group = { label: titleCase(groupName), stories: [] };
				list.push(group);
			}
			parse(group.stories!, remainder, currentPath + groupName + "/");
		}
	}
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		if (!file) {
			continue;
		}
		parse(stories, path.basename(file.file));
	}
	return stories;
}
