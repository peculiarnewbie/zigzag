import { createEffect } from "solid-js";
import { PriorityKeys, PriorityType, PriorityValuesType } from "src/types";
import { IconStyle, setupIcon } from "./style";

export function PriorityIcon(props: {
	priority: PriorityType;
	interactive?: boolean;
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
		<div class="metadata-property-icon" style={IconStyle()} ref={el}></div>
	);
}

export const getPriority = (key: PriorityValuesType) => {
	switch (key) {
		case PriorityKeys.High.value:
			return PriorityKeys.High;
		case PriorityKeys.Low.value:
			return PriorityKeys.Low;
		case PriorityKeys.Medium.value:
			return PriorityKeys.Medium;
		case PriorityKeys.NoPriority.value:
			return PriorityKeys.NoPriority;
		case PriorityKeys.Urgent.value:
			return PriorityKeys.Urgent;
		default:
			return PriorityKeys.NoPriority;
	}
};
