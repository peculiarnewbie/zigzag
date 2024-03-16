import { createConfig } from "@tokenami/css";

export default createConfig({
	include: ["./src/**/*.{ts,tsx}"],
	grid: "0.25rem",
	responsive: {},
	theme: {
		alpha: {},
		anim: {},
		border: {},
		color: {
			"slate-100": "#f1f5f9",
			"slate-700": "#334155",
			"sky-500": "#0ea5e9",
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
	},
});
