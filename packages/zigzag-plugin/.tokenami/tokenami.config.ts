import { createConfig } from "@tokenami/css";

export default createConfig({
	include: ["./src/**/*.{ts,tsx}"],
	grid: "0.25rem",
	responsive: {},
	theme: {
		alpha: {},
		anim: {},
		border: { red: "solid 1rem red" },
		color: {
			"blue-400": "#2323ff",
			"--interactive-accent": "var(--interactive-accent)",
			bg: "--background-primary",
		},
		ease: {},
		"font-size": {},
		leading: {},
		"line-style": {},
		radii: {},
		size: {},
		shadow: {},
		surface: {},
		tracking: {},
		transition: {},
		weight: {},
		z: {},
		"color-accent-1": {},
	},
});
