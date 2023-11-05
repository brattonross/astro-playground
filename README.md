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

Complete control over the layout is exposed, so you can customize as much or as little as you'd like. To use a layout, add the `layout` option to the integration:

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

The various components that make up the default layout are available from the `@brattonross/astro-playground/components` import, so you can compose them as you need. A typical use case might be to inject some global styles or scripts on the page, in which case the default layout can be imported:

```astro
---
import { Layout } from "@brattonross/astro-playground/components";
import "~/styles.css";
---

<Layout>
	<slot />
</Layout>
```

The default layout exposes a `head` slot, which can be used to inject content into the `<head>` of the page. For example, to add a custom title:

```astro
---
import { Layout } from "@brattonross/astro-playground/components";
---

<Layout>
	<Fragment slot="head">
		<title>My Custom Playground</title>
	</Fragment>
	<slot />
</Layout>
```

You can take more control over the layout by importing the individual components:

```astro
---
import {
	Actions,
	Main,
	Meta,
	Root,
	Scripts,
	Sidebar,
	Styles,
} from "@brattonross/astro-playground/components";
---

<!doctype html>
<html lang="en">
	<head>
		<Meta />
		<Scripts />
		<Styles />
		<title>My Custom Playground</title>
	</head>
	<body>
		<Root>
			<Main>
				<h1>My Custom Playground</h1>
				<slot />
			</Main>
			<Sidebar />
			<Actions />
		</Root>
	</body>
</html>
```

## TODO

Things I'd like this integration to do:

-   [ ] Search stories
-   [ ] [Visual Snapshots](https://ladle.dev/docs/visual-snapshots)
-   [ ] Axe integration

## Prior Art

-   [Ladle](https://github.com/tajo/ladle)
-   [Storybook](https://github.com/storybookjs/storybook)
