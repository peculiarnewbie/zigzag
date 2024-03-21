import { For, createContext, createEffect, createSignal } from "solid-js";
import { css } from "@tokenami/css";
import { App, MetadataCache, Modal, TFile, Vault, getAllTags } from "obsidian";
import { Issue, PriorityType, StatusType } from "src/types";
import IssueListItem from "./IssueListItem";
import IssueListCategory from "./IssueListCategory";
import { getStatus } from "./Icons/StatusIcon";
import { getPriority } from "./Icons/PriorityIcon";
import { createStore, produce } from "solid-js/store";
import { AddIssueModal } from "./AddIssueModal/AddIssueModal";
import { render } from "solid-js/web";

type IssueUIType = Issue & { selected: boolean };

export default function Zigzag(props: { app: App }) {
	const VaultContext = createContext();
	const [store, setStore] = createStore({ issues: [] as IssueUIType[] });

	const pullIssues = async () => {
		const issuesFiles = await Promise.all(
			props.app.vault.getMarkdownFiles().filter((md) => {
				const fileCache = props.app.metadataCache.getFileCache(md);
				if (fileCache) {
					const tag = getAllTags(fileCache)?.filter(
						(tag) => tag === "#Zigzag/Issue"
					);
					if (tag && tag.length > 0) return true;
				}
				return false;
			})
		);

		const issuesFromVault = await Promise.all(
			issuesFiles.map((file) =>
				parseIssue(file, props.app.vault, props.app.metadataCache)
			)
		);

		setStore({ issues: issuesFromVault });
	};

	const editIssue = (issue: Issue) => {
		setStore(
			"issues",
			(issues) => issues.file.path === issue.file.path,
			produce((prev) => {
				prev.priority = issue.priority;
				prev.status = issue.status;
			})
		);
	};

	const setSelected = (bool: boolean, path: string) => {
		setStore(
			"issues",
			(issues) => issues.file.path === path,
			produce((prev) => (prev.selected = bool))
		);
	};

	const toggleSelect = (checkbox: HTMLInputElement, path: string) => {
		const checked = checkbox.dataset.checked;
		if (checked === "false" || checked == undefined) {
			setSelected(true, path);
			checkbox.dataset.checked = "true";
		} else {
			setSelected(false, path);
			checkbox.dataset.checked = "false";
		}
	};

	const unselectAll = () => {
		setStore(
			"issues",
			(issues) => issues.selected,
			produce((prev) => (prev.selected = false))
		);
	};

	const openAddIssue = () => {
		new AddIssueModal(props.app).open();
	};

	const deleteIssue = (issues: TFile[]) => {
		issues.forEach((item) => {
			props.app.vault.delete(item);
		});
	};

	const deleteAction = (issue: IssueUIType) => {
		const filesToDelete: TFile[] = [];
		console.log(issue.selected);
		if (!issue.selected) {
			unselectAll();
			filesToDelete.push(issue.file);
			console.log("pushing", issue.file);
		} else {
			store.issues.forEach((item) => {
				console.log(item.selected);
				if (item.selected) filesToDelete.push(item.file);
			});
		}
		console.log("deleting", filesToDelete);
		new DeleteModal(props.app, () => deleteIssue(filesToDelete)).open();
	};

	createEffect(() => {
		props.app.vault.on("rename", pullIssues);
		props.app.metadataCache.on("changed", pullIssues);
		props.app.vault.on("delete", pullIssues);

		pullIssues();
	});

	return (
		<VaultContext.Provider value={props.app.vault}>
			<div
				style={{
					margin: "-16px",
					...css({
						"--font-size": "var(--font-size_small)",
					}),
				}}
			>
				<IssueListCategory
					itemsCount={store.issues.length ?? 0}
					openAddIssueModal={openAddIssue}
				/>
				<For each={store.issues}>
					{(issue) => (
						<IssueListItem
							issue={issue}
							editIssue={editIssue}
							app={props.app}
							toggleSelect={toggleSelect}
							deleteAction={deleteAction}
						/>
					)}
				</For>
			</div>
		</VaultContext.Provider>
	);
}

export const parseIssue = async (
	file: TFile,
	vault: Vault,
	cache: MetadataCache
) => {
	const fileCache = cache.getFileCache(file);
	const content = await vault.read(file);

	let status: StatusType;
	let priority: PriorityType;
	let created = "";
	let description = "description";

	if (!fileCache?.frontmatter) return {} as IssueUIType;

	status = getStatus(fileCache.frontmatter.status);
	priority = getPriority(fileCache.frontmatter.priority);
	created = fileCache.frontmatter.created ?? created;

	if (fileCache?.sections && fileCache.headings) {
		const descriptionHeadingIndex = fileCache.headings.findIndex(
			(heading) => heading.heading == "Description"
		);
		if (descriptionHeadingIndex !== undefined) {
			let headingIter = -1;
			let descriptionIndex = 0;

			for (let i = 0; i < fileCache.sections.length; i++) {
				if (fileCache.sections[i].type === "heading") {
					headingIter++;
					if (headingIter === descriptionHeadingIndex) {
						descriptionIndex = i + 1;
					}
				}
			}

			const descriptionSection =
				fileCache.sections[descriptionIndex]?.position;
			if (descriptionSection) {
				description = content.slice(
					descriptionSection.start.offset,
					descriptionSection.end.offset
				);
			} else description = "";
		}
	}

	const issue: Issue = {
		file: file,
		title: file.basename,
		status: status as StatusType,
		priority: priority as PriorityType,
		description: description,
		created: created,
	};

	return { ...issue, selected: false } as IssueUIType;
};

function DeleteView(props: { close: () => void; action: () => void }) {
	return (
		<div>
			<div style={{ "text-align": "center" }}>
				Are you sure you want to delete these items?
			</div>
			<div
				style={css({
					"--display": "flex",
					"--gap": 2,
					"--set-x": "center",
					"--pt": 5,
				})}
			>
				<button onclick={props.close}>Cancel</button>
				<button
					class="mod-cta"
					onclick={() => {
						props.action();
						props.close();
					}}
				>
					Delete
				</button>
			</div>
		</div>
	);
}

export class DeleteModal extends Modal {
	app: App;
	action: () => void;

	constructor(app: App, action: () => void) {
		super(app);
		this.action = action;
	}

	onOpen() {
		let { contentEl } = this;

		render(
			() =>
				DeleteView({ close: () => this.close(), action: this.action }),
			contentEl
		);
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}
