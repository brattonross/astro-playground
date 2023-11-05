import tailwind from "@astrojs/tailwind";
import playground from "@brattonross/astro-playground";
import { defineConfig } from "astro/config";

export default defineConfig({
	integrations: [
		tailwind({
			applyBaseStyles: false,
		}),
		playground({
			layout: "~/components/Layout.astro",
		}),
	],
});
