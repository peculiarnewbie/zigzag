import { moment, setIcon, setTooltip } from "obsidian";
import { Setter, Show, createEffect, createSignal } from "solid-js";
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
	//@ts-expect-error
	"--color": "var(--icon-color)",
	"--icon-size": "var(--icon-s)",
});

export default function IssueListItem(props: { issue: Issue }) {
	const [hovered, setHovered] = createSignal(false);
	const [selected, setSelected] = createSignal(false);

	let checkbox!: HTMLInputElement;

	const toggleCheck = () => {
		if (checkbox === undefined) return;
		const checked = checkbox.dataset.checked;
		console.log(checkbox.dataset.checked);
		if (checked === "false" || checked == undefined) {
			setSelected(true);
			checkbox.dataset.checked = "true";
		} else {
			setSelected(false);
			checkbox.dataset.checked = "false";
		}
	};

	return (
		<div
			style={css({
				"--display": "flex",
				"--set-x": "space-between",
				"--border-bottom": "var(--border_standard)",
				"--py": 1,
				"--pl": 1,
				"--pr": 5.25,
			})}
			onpointerenter={() => setHovered(true)}
			onpointerleave={() => setHovered(false)}
		>
			<div
				style={css({
					"--display": "flex",
					"--h": 9,
					"--set-y": "center",
				})}
			>
				<div
					style={css({
						"--width": 4,
						"--display": "flex",
						"--set-y": "center",
					})}
				>
					<Show when={hovered() || selected()}>
						<input
							ref={checkbox}
							type="checkbox"
							onclick={toggleCheck}
						/>
					</Show>
				</div>
				<PriorityIcon priority={props.issue.priority} />
				<div style={{ width: "8px" }} />
				<div style={css({ "--color": "var(--color_text-muted)" })}>
					code
				</div>
				<div style={{ width: "8px" }} />
				<StatusIcon status={props.issue.status} interactive />
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

export function StatusIcon(props: {
	status: StatusType;
	interactive?: boolean;
}) {
	let el!: HTMLDivElement;

	createEffect(() => {
		switch (props.status) {
			case StatusKeys.Backlog:
				setIcon(el, "circle-dashed");
				break;
			case StatusKeys.Todo:
				setIcon(el, "circle");
				break;

			case StatusKeys.InReview:
				setIcon(el, "circle-ellipsis");
				el.style.setProperty("--icon-color", "var(--text-success)");
				break;
			case StatusKeys.InProgress:
				setIcon(el, "circle-dot");
				el.style.setProperty("--icon-color", "var(--text-warning)");
				break;
			case StatusKeys.Cancelled:
				setIcon(el, "x-circle");
				break;
			case StatusKeys.Done:
				setIcon(el, "check-circle");
				el.style.setProperty(
					"--icon-color",
					"var(--interactive-accent)"
				);
				break;
		}
		if (props.interactive) setTooltip(el, "Change status");
	});

	return (
		<div
			class={`${props.interactive ? "metadata-property-icon" : ""} `}
			style={Icon()}
			ref={el}
		></div>
	);
}

function PriorityIcon(props: { priority: PriorityType }) {
	let el!: HTMLDivElement;

	createEffect(() => {
		switch (props.priority) {
			case PriorityKeys.NoPriority:
				setIcon(el, "minus");
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
				setIcon(el, "alert-octagon");
				el.style.setProperty("--icon-color", "var(--text-error)");
				break;
		}
		setTooltip(el, "Change priority");
	});

	return <div class="metadata-property-icon" style={Icon()} ref={el}></div>;
}
