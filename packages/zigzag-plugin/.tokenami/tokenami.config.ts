import { createConfig } from "@tokenami/css";

export default createConfig({
	include: ["./src/**/*.{ts,tsx}"],
	grid: "0.25rem",
	responsive: {},
	theme: {
		alpha: {},
		anim: {},
		border: { standard: "1px solid var(--background-modifier-border)" },
		color: {
			"blue-400": "#2323ff",
			"interactive-accent": "var(--interactive-accent)",
			bg: "--background-primary",
			"icon-color": "var(--icon-color)",
			"text-muted": "var(--text-muted)",
			"bg-primary-alt": "var(--background-primary-alt)",
		},
		ease: {},
		"font-size": {
			smaller: "var(--font-ui-smaller)",
			small: "var(--font-ui-small)",
			large: "var(--font-ui-large)",
		},
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
