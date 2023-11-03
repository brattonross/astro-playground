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

## Prior Art

-   [Ladle](https://github.com/tajo/ladle)
-   [Storybook](https://github.com/storybookjs/storybook)
