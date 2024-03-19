import { moment, setIcon } from "obsidian";
import { createEffect } from "solid-js";
import { css } from "src/css";
import {
	Issue,
	PriorityKeys,
	PriorityType,
	StatusKeys,
	StatusType,
} from "src/types";

const Icon = css.compose({
	"--display": "flex",
	"--set-y": "center",
	"--color": "var(--color_icon-color)",
	//@ts-expect-error
	"--icon-size": "var(--icon-s)",
});

export default function IssueListItem(props: { issue: Issue }) {
	return (
		<div
			style={css({
				"--display": "flex",
				"--set-x": "space-between",
				"--border-bottom": "var(--border_standard)",
				"--px": 4,
				"--py": 1,
			})}
		>
			<div
				style={css({
					"--display": "flex",
					"--h": 9,
					"--set-y": "center",
				})}
			>
				<input style={{ "margin-right": "9px" }} type="checkbox" />
				<PriorityIcon priority={props.issue.priority} />
				<div style={{ width: "8px" }} />
				<div>code</div>
				<div style={{ width: "8px" }} />
				<StatusIcon status={props.issue.status} />
				<div style={{ width: "8px" }} />
				<div
					style={css({
						"--font-weight": "var(--weight_bold)",
					})}
				>
					{props.issue.title}
				</div>
			</div>
			<div
				style={css({
					"--color": "var(--color_text-muted)",
					"--display": "flex",
					"--set-y": "center",
					"--font-size": "var(--font-size_smaller)",
				})}
			>
				{moment(props.issue.created, "YYYY-MM-DD").format("DD MMM")}
			</div>
		</div>
	);
}

export function StatusIcon(props: { status: StatusType }) {
	let el!: HTMLDivElement;

	createEffect(() => {
		if (el) {
			switch (props.status) {
				case StatusKeys.Backlog:
					setIcon(el, "sandwich");
					break;
				case StatusKeys.Cancelled:
					setIcon(el, "x-circle");
					break;
				case StatusKeys.Done:
					setIcon(el, "check-circle");
					break;
			}
		}
	});

	return <div style={Icon()} ref={el}></div>;
}

function PriorityIcon(props: { priority: PriorityType }) {
	let el!: HTMLDivElement;

	createEffect(() => {
		if (el) {
			switch (props.priority) {
				case PriorityKeys.NoPriority:
					setIcon(el, "ellipsis");
					break;
				case PriorityKeys.Low:
					setIcon(el, "signal-low");
					break;
				case PriorityKeys.Medium:
					setIcon(el, "signal-high");
					break;
				case PriorityKeys.High:
					setIcon(el, "signal");
					break;
				case PriorityKeys.Urgent:
					setIcon(el, "alert-circle");
					break;
				default:
					setIcon(el, "alert-circle");
					break;
			}
		}
	});

	return <div style={{ ...Icon() }} ref={el}></div>;
}
