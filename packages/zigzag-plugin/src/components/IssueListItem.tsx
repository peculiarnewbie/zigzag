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
import { changePriority, changeStatus } from "./ContextMenus/ContextMenu";

export default function IssueListItem(props: {
	issue: Issue;
	editIssue: (issue: Issue) => void;
}) {
	const [hovered, setHovered] = createSignal(false);
	const [selected, setSelected] = createSignal(false);

	let checkbox!: HTMLInputElement;

	const toggleCheck = () => {
		if (checkbox === undefined) return;
		const checked = checkbox.dataset.checked;
		if (checked === "false" || checked == undefined) {
			setSelected(true);
			checkbox.dataset.checked = "true";
		} else {
			setSelected(false);
			checkbox.dataset.checked = "false";
		}
	};

	const handleChangeStatus = (e: MouseEvent) => {
		changeStatus(e, (status) => changeIssue({ status: status }));
	};

	const handleChangePriority = (e: MouseEvent) => {
		changePriority(e, (priority) => changeIssue({ priority: priority }));
	};

	const changeIssue = (change: {
		status?: StatusType;
		priority?: PriorityType;
	}) => {
		console.log(change);
		const newIssue = { ...props.issue };
		if (change.status) newIssue.status = change.status;
		if (change.priority) newIssue.priority = change.priority;
		props.editIssue(newIssue);
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
				<PriorityIcon
					priority={props.issue.priority}
					changePriority={handleChangePriority}
				/>
				<div style={{ width: "8px" }} />
				<div style={css({ "--color": "var(--color_text-muted)" })}>
					code
				</div>
				<div style={{ width: "8px" }} />
				<StatusIcon
					status={props.issue.status}
					changeStatus={handleChangeStatus}
				/>
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
