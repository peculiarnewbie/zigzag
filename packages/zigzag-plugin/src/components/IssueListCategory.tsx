import { css } from "@tokenami/css";
import { StatusKeys } from "src/types";
import { createEffect } from "solid-js";
import { setIcon, setTooltip } from "obsidian";
import { StatusIcon } from "./Icons/StatusIcon";

export default function IssueListCategory(props: {
	itemsCount: number;
	openAddIssueModal: () => void;
}) {
	let plusButton!: HTMLDivElement;

	createEffect(() => {
		setIcon(plusButton, "plus");
		setTooltip(plusButton, "Add issue");
	});

	return (
		<div
			style={css({
				"--display": "flex",
				"--set-x": "space-between",
				"--bg": "var(--color_bg-primary-alt)",
				"--py": 1,
				"--pl": 6,
				"--pr": 4,
			})}
		>
			<div
				style={css({
					"--display": "flex",
					"--set-y": "center",
				})}
			>
				<StatusIcon status={StatusKeys.Done} />
				<div style={css({ "--p": 1 })} />
				<span
					style={css({
						"--font-weight": "var(--weight_bold)",
					})}
				>
					Done
				</span>
				<div style={css({ "--p": 1 })} />
				<span
					style={css({
						"--color": "var(--color_text-muted)",
					})}
				>
					{props.itemsCount}
				</span>
			</div>
			<div
				class="clickable-icon"
				ref={plusButton}
				style={{ width: "28px", height: "28px", padding: 0 }}
				onclick={props.openAddIssueModal}
			/>
		</div>
	);
}
