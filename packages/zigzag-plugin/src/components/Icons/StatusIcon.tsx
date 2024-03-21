import { createEffect } from "solid-js";
import { StatusKeys, StatusType, StatusValuesType } from "src/types";
import { IconStyle, setupIcon } from "./style";

export function StatusIcon(props: {
	status: StatusType;
	changeStatus?: (e: MouseEvent) => void;
}) {
	let el!: HTMLDivElement;

	createEffect(() => {
		setupIcon(
			el,
			props.status.icon,
			props.status.color,
			props.changeStatus ? "Change status" : undefined
		);
	});

	return (
		<div
			class={`${props.changeStatus ? "metadata-property-icon" : ""} `}
			style={IconStyle()}
			ref={el}
			onclick={props.changeStatus}
		></div>
	);
}

export const getStatus = (key: StatusValuesType) => {
	return (
		Array.from(Object.values(StatusKeys)).find(
			(status) => status.value === key
		) ?? StatusKeys.Backlog
	);
};
