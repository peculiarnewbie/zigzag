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
import { StatusIcon } from "./Icons/StatusIcon";
import { PriorityIcon } from "./Icons/PriorityIcon";

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
