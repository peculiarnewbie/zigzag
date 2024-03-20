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
	switch (key) {
		case StatusKeys.Backlog.value:
			return StatusKeys.Backlog;
		case StatusKeys.Cancelled.value:
			return StatusKeys.Cancelled;
		case StatusKeys.Done.value:
			return StatusKeys.Done;
		case StatusKeys.Duplicate.value:
			return StatusKeys.Duplicate;
		case StatusKeys.InProgress.value:
			return StatusKeys.InProgress;
		case StatusKeys.InReview.value:
			return StatusKeys.InReview;
		default:
			return StatusKeys.Backlog;
	}
};
