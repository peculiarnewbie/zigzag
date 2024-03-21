import { css } from "src/css";
import { createEffect, createSignal } from "solid-js";
import { Menu, Modal, Notice, Vault, moment } from "obsidian";
import {
	Issue,
	PriorityKeys,
	PriorityType,
	StatusKeys,
	StatusType,
} from "src/types";
import { changePriority, changeStatus } from "../ContextMenus/ContextMenu";
import { StatusIcon } from "../Icons/StatusIcon";
import { PriorityIcon } from "../Icons/PriorityIcon";

export default function AddIssue(props: { vault: Vault; modal: Modal }) {
	let parent!: HTMLDivElement;
	let initialHeight = 0;

	const [status, setStatus] = createSignal<StatusType>(StatusKeys.Backlog);
	const [priority, setPriority] = createSignal<PriorityType>(
		PriorityKeys.NoPriority
	);
	const [title, setTitle] = createSignal("");
	const [description, setDescription] = createSignal("");

	const checkEmpty = (e: InputEvent) => {
		const el = e.target as HTMLDivElement;
		const value = el.innerText;
		if (value === "" || value === "\n") {
			el.toggleClass("editor-placeholder", true);
			el.empty();
			document.documentElement.style.setProperty("--top-offset", "0px");
		} else {
			el.toggleClass("editor-placeholder", false);
			document.documentElement.style.setProperty(
				"--top-offset",
				`${parent.clientHeight / 2 - initialHeight / 2}px`
			);
		}
	};

	const createIssue = () => {
		const issue: Issue = {
			path: title(),
			title: title(),
			description: description(),
			status: status(),
			priority: priority(),
			created: "2024-02-01",
		};

		const data = `---
tags:
- Zigzag/Issue
status: ${status().value}
priority: ${priority().value}
created: ${moment().format("YYYY-MM-DD")}
---
# Description
${description()}
`;

		props.vault.create(`${title()}.md`, data);
		props.modal.close();
	};

	createEffect(() => {
		initialHeight = parent.clientHeight;

		document.documentElement.style.setProperty("--top-offset", `0px`);

		//@ts-expect-error
		parent.parentElement.parentElement.style.top =
			"calc(-33vh + var(--top-offset))";
	});
	return (
		<div ref={parent}>
			<div
				style={css({
					"--display": "flex",
					"--gap": 2,
					"--set-y": "center",
					"--font-size": "var(--font-size_small)",
				})}
			>
				<div
					style={css({
						"--border": "var(--border_standard)",
						"--border-radius": "var(--radii_sm)",
						"--p": 1,
					})}
				>
					code
				</div>
				<div>{">"}</div>
				<div>New Issue</div>
			</div>
			<div style={css({ "--h": 2 })} />
			<div
				style={css({
					"--font-weight": "var(--weight_bold)",
					"--font-size": "var(--font-size_large)",
					"--cursor": "text",
					"--pl": 2,
				})}
				class=" editor-placeholder"
				contentEditable={true}
				data-empty-text="Issue Title"
				oninput={(e) => {
					checkEmpty(e);
					setTitle((e.target as HTMLDivElement).innerText);
				}}
			/>
			<div style={css({ "--h": 2.5 })} />
			<div
				style={css({
					"--height": "var(---, fit-content)",
					"--min-height": 13,
					"--max-height": 100,
					"--overflow-y": "auto",
					"--pb": 3,
					"--px": 2,
				})}
			>
				<div
					style={css({ "--cursor": "text" })}
					class="editor-placeholder"
					contentEditable={true}
					data-empty-text="Add description..."
					oninput={(e) => {
						checkEmpty(e);
						setDescription((e.target as HTMLDivElement).innerText);
					}}
				/>
			</div>
			<div
				style={css({
					"--pt": 1.5,
					"--pb": 3,
					"--display": "flex",
					"--gap": 2,
				})}
			>
				<button
					onclick={(e) => changeStatus(e, setStatus)}
					style={{
						...css({ "--display": "flex", "--gap": 1 }),
						height: "26px",
						"padding-left": "8px",
						"padding-right": "8px",
					}}
				>
					<StatusIcon status={status()} />
					<div>{status().value}</div>
				</button>
				<button
					onclick={(e) => changePriority(e, setPriority)}
					style={{
						...css({ "--display": "flex", "--gap": 1 }),
						height: "26px",
						"padding-left": "8px",
						"padding-right": "8px",
					}}
				>
					<PriorityIcon priority={priority()} />
					<div>{priority().value}</div>
				</button>
			</div>
			<div
				style={{
					...css({
						"--h": 0.25,
						"--bg": "var(--color_text-faint)",
					}),
					"margin-left": "-16px",
					"margin-right": "-16px",
				}}
			/>
			<div
				style={css({
					"--pt": 3,
					"--display": "flex",
					"--set-x": "end",
					"--gap": 2,
				})}
			>
				<div
					style={css({
						"--display": "flex",
						"--set-y": "center",
						"--gap": 0.5,
						"--font-size": "var(--font-size_small)",
					})}
				>
					<div class="checkbox-container">
						<input type="checkbox" />
					</div>
					<div>create more</div>
				</div>
				<button class="mod-cta" onclick={createIssue}>
					Create Issue
				</button>
			</div>
		</div>
	);
}
