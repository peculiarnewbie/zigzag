import { createEffect } from "solid-js";
import { PriorityKeys, PriorityType, PriorityValuesType } from "src/types";
import { IconStyle, setupIcon } from "./style";

export function PriorityIcon(props: {
	priority: PriorityType;
	changePriority?: (e: MouseEvent) => void;
}) {
	let el!: HTMLDivElement;

	createEffect(() => {
		setupIcon(
			el,
			props.priority.icon,
			props.priority.color,
			"Change priority"
		);
	});

	return (
		<div
			class={`${props.changePriority ? "metadata-property-icon" : ""} `}
			style={IconStyle()}
			ref={el}
			onclick={props.changePriority}
		></div>
	);
}

export const getPriority = (key: PriorityValuesType) => {
	return (
		Array.from(Object.values(PriorityKeys)).find(
			(status) => status.value === key
		) ?? PriorityKeys.NoPriority
	);
};
