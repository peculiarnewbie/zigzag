import { For, createContext, createEffect, createSignal } from "solid-js";
import { css } from "@tokenami/css";
import { App, MetadataCache, TFile, Vault, getAllTags } from "obsidian";
import { Issue, PriorityType, StatusType } from "src/types";
import IssueListItem from "./IssueListItem";
import IssueListCategory from "./IssueListCategory";
import { openAddIssueModal } from "src/main";
import { getStatus } from "./Icons/StatusIcon";
import { getPriority } from "./Icons/PriorityIcon";
import { createStore, produce } from "solid-js/store";

export default function Zigzag(props: { app: App }) {
	const VaultContext = createContext();
	const [store, setStore] = createStore({ issues: [] as Issue[] });

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

	const addIssue = (issue: Issue) => {
		setStore("issues", store.issues.length, issue);
	};

	const openAddIssue = () => {
		openAddIssueModal(props.app);
	};

	createEffect(() => {
		props.app.vault.on("rename", pullIssues);
		props.app.metadataCache.on("changed", pullIssues);

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

	if (!fileCache?.frontmatter) return {} as Issue;

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
				fileCache.sections[descriptionIndex].position;

			description = content.slice(
				descriptionSection.start.offset,
				descriptionSection.end.offset
			);
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

	return issue;
};
