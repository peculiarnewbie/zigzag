import { App, Menu, Vault, moment, setIcon, setTooltip } from "obsidian";
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
import { DeleteModal, parseIssue } from "./Zigzag";

const ItemStyle = css.compose({
	"--display": "flex",
	"--set-x": "space-between",
	"--border-bottom": "var(--border_standard)",
	"--py": 1,
	"--pl": 1,
	"--pr": 5.25,
	"--hover_bg": "var(--color_bg-hover)",

	variants: {
		selected: {
			false: { "--hover_bg": "var(--color_bg-hover)" },
			true: {
				"--bg": "var(--color_interactive-normal)",
				"--hover_bg": "var(--color_interactive-hover)",
			},
		},
	},
});

export default function IssueListItem(props: {
	issue: Issue & { selected: boolean };
	editIssue: (issue: Issue) => void;
	toggleSelect: (checkbox: HTMLInputElement, path: string) => void;
	deleteAction: (issue: Issue & { selected: boolean }) => void;
	app: App;
}) {
	const [hovered, setHovered] = createSignal(false);

	let checkbox!: HTMLInputElement;

	const handleChangeStatus = (e: MouseEvent) => {
		e.stopPropagation();
		changeStatus(e, (status) => changeIssue({ status: status }));
	};

	const handleChangePriority = (e: MouseEvent) => {
		e.stopPropagation();
		changePriority(e, (priority) => changeIssue({ priority: priority }));
	};

	const changeIssue = async (change: {
		status?: StatusType;
		priority?: PriorityType;
	}) => {
		console.log(change);
		const newStatus = change.status?.value;
		const newPriority = change.priority?.value;
		console.log(props.issue.file, props.issue.status.value, newStatus);
		if (newStatus)
			await props.app.vault.process(props.issue.file, (data) =>
				data.replace(
					`status: ${props.issue.status.value}`,
					`status: ${newStatus}`
				)
			);
		if (newPriority)
			await props.app.vault.process(props.issue.file, (data) =>
				data.replace(
					`priority: ${props.issue.priority.value}`,
					`priority: ${newPriority}`
				)
			);

		return parseIssue(
			props.issue.file,
			props.app.vault,
			props.app.metadataCache
		);
	};

	const openFile = () => {
		props.app.workspace.getLeaf().openFile(props.issue.file);
	};

	const openContext = (e: MouseEvent) => {
		const menu = new Menu();

		menu.addItem((item) => {
			item.setTitle("Delete")
				.setSection("danger")
				.setIcon("trash-2")
				.onClick(() => props.deleteAction(props.issue));
		});

		menu.showAtMouseEvent(e);
	};

	const handleToggleSelect = (e: MouseEvent) => {
		e.stopPropagation();
		props.toggleSelect(checkbox, props.issue.file.path);
	};

	return (
		<div
			style={
				props.issue.selected
					? ItemStyle({ selected: true })
					: ItemStyle({ selected: false })
			}
			onpointerenter={() => setHovered(true)}
			onpointerleave={() => setHovered(false)}
			onclick={openFile}
			oncontextmenu={openContext}
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
					<Show when={hovered() || props.issue.selected}>
						<input
							ref={checkbox}
							type="checkbox"
							onclick={handleToggleSelect}
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
