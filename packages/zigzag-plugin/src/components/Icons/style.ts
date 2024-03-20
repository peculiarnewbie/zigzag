import { css } from "@tokenami/css";
import { setIcon, setTooltip } from "obsidian";

export const IconStyle = css.compose({
	"--display": "flex",
	"--set-y": "center",
	//@ts-expect-error
	"--color": "var(--icon-color)",
	"--icon-size": "var(--icon-s)",
});

export const setupIcon = (
	el: HTMLElement,
	icon: string,
	color?: string,
	tooltip?: string
) => {
	console.log(el, icon);
	setIcon(el, icon);
	if (color) el.style.setProperty("--icon-color", `var(--${color})`);
	if (tooltip) setTooltip(el, "Change status");
};
