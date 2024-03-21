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
	setIcon(el, icon);
	if (color) el.style.setProperty("--icon-color", `var(--${color})`);
	else el.style.removeProperty("--icon-color");
	if (tooltip) setTooltip(el, "Change status");
};
