# astro-playground

An Astro integration that adds a Ladle/Storybook-like playground to your Astro project.

## Installation

```sh
npm install @brattonross/astro-playground --save-dev
```

## Usage

Apply the integration to your `astro.config.*` file:

```diff lang="js" "playground()"
// astro.config.mjs
import { defineConfig } from "astro/config";
+ import playground from "@brattonross/astro-playground";

export default defineConfig({
    // ...
    integrations: [playground()],
    //             ^^^^^^^^^^^^
});
```

If you navigate to `/playground`, you should see the playground page. By default, the pages `/playground` and `/playground/[...slug]` are injected. You can customize the base path by passing an options object to the integration.

Any `.stories.astro` files in `src` will be picked up as "story" files. These will appear as nav items on the sidebar, and render the contents of the file in the main area when selected.

## Structured Stories

Components can be organized into a tree structure by using `--` in the filename to indicate a nested story. For example, the filename `Components--Buttons--Primary.stories.astro` would result in a tree like:

```txt
Components
└── Buttons
    └── Primary
```

## Layout

If you want to add some custom styles and scripts to the playground, the `layout` option can be provided with a path to the component you want to use as the layout. Remember to use a `<slot>` to render the story content!

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import playground from "@brattonross/astro-playground";

export default defineConfig({
	// ...
	integrations: [
		playground({
			layout: "~/components/PlaygroundLayout.astro",
		}),
	],
	// ...
});
```

A basic layout might look like:

```astro
---
import "~/styles.css";
---

<slot />
```

## TODO

Things I'd like this integration to do:

-   [ ] Search stories
-   [ ] [Visual Snapshots](https://ladle.dev/docs/visual-snapshots)
-   [ ] Axe integration

## Prior Art

-   [Ladle](https://github.com/tajo/ladle)
-   [Storybook](https://github.com/storybookjs/storybook)
