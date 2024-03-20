import { createEffect } from "solid-js";
import { StatusKeys, StatusType, StatusValuesType } from "src/types";
import { IconStyle, setupIcon } from "./style";

export function StatusIcon(props: {
	status: StatusType;
	interactive?: boolean;
}) {
	let el!: HTMLDivElement;

	createEffect(() => {
		console.log("hey", props);
		setupIcon(
			el,
			props.status.icon,
			props.status.color,
			props.interactive ? "Change status" : undefined
		);
	});

	return (
		<div
			class={`${props.interactive ? "metadata-property-icon" : ""} `}
			style={IconStyle()}
			ref={el}
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
