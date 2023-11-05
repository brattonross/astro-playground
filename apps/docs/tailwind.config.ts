import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import { createPlugin } from "windy-radix-palette";

const colors = createPlugin();

export default {
	content: ["./src/**/*.astro"],
	theme: {
		extend: {
			colors: {
				gray: colors.alias("slate"),
				grayA: colors.alias("slateA"),
				primary: colors.alias("iris"),
				primaryA: colors.alias("irisA"),
				"app-background": colors.alias({
					light: "white",
					dark: "gray.1",
				}),
			},
			fontFamily: {
				sans: ["Geist", ...defaultTheme.fontFamily.sans],
			},
			fontSize: {
				// https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/styles/tokens/typography.css
				xs: [
					"12px",
					{
						lineHeight: "16px",
						fontWeight: "400",
						letterSpacing: "0.0025em",
					},
				],
				sm: [
					"14px",
					{
						lineHeight: "20px",
						fontWeight: "400",
						letterSpacing: "0em",
					},
				],
				base: [
					"16px",
					{
						lineHeight: "24px",
						fontWeight: "400",
						letterSpacing: "0em",
					},
				],
				lg: [
					"18px",
					{
						lineHeight: "26px",
						fontWeight: "400",
						letterSpacing: "-0.0025em",
					},
				],
				xl: [
					"20px",
					{
						lineHeight: "28px",
						fontWeight: "400",
						letterSpacing: "-0.005em",
					},
				],
				"2xl": [
					"24px",
					{
						lineHeight: "30px",
						fontWeight: "400",
						letterSpacing: "-0.00625em",
					},
				],
				"3xl": [
					"28px",
					{
						lineHeight: "36px",
						fontWeight: "400",
						letterSpacing: "-0.0075em",
					},
				],
				"4xl": [
					"35px",
					{
						lineHeight: "40px",
						fontWeight: "400",
						letterSpacing: "-0.01em",
					},
				],
				"5xl": [
					"60px",
					{
						lineHeight: "60px",
						fontWeight: "400",
						letterSpacing: "-0.025em",
					},
				],
			},
		},
	},
	plugins: [colors.plugin],
} satisfies Config;
