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
				"gray-surface": colors.alias({
					light: "#ffffffcc",
					dark: "#1f212380",
				}),
				"gray-contrast": "#fff",
				primary: colors.alias("iris"),
				primaryA: colors.alias("irisA"),
				"primary-surface": colors.alias({
					light: "#f6f6ffcc",
					dark: "#1d1b3980",
				}),
				"primary-contrast": "#fff",
				success: colors.alias("grass"),
				successA: colors.alias("grassA"),
				"success-surface": colors.alias({
					light: "#f3faf3cc",
					dark: "#19231b80",
				}),
				"success-contrast": "#fff",
				warning: colors.alias("amber"),
				warningA: colors.alias("amberA"),
				"warning-surface": colors.alias({
					light: "#fefae4cc",
					dark: "#271f1380",
				}),
				"warning-contrast": "#21201c",
				danger: colors.alias("tomato"),
				dangerA: colors.alias("tomatoA"),
				"danger-surface": colors.alias({
					light: "#fff6f5cc",
					dark: "#2d191580",
				}),
				"danger-contrast": "#fff",
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
