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
			"interactive-accent": "var(--interactive-accent)",
			bg: "--background-primary",
			"icon-color": "var(--icon-color)",
			"text-muted": "var(--text-muted)",
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
		weight: {
			bold: "var(--bold-weight)",
		},
		z: {},
	},
	aliases: {
		bg: ["background-color"],
		p: ["padding"],
		py: ["padding-top", "padding-bottom"],
		px: ["padding-left", "padding-right"],
		h: ["height"],
		w: ["width"],
		"set-y": ["align-items"],
		"set-x": ["justify-content"],
	},
});
