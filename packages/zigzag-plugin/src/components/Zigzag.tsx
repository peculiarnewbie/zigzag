import { For, createContext, createEffect, createSignal } from "solid-js";
import { css, type TokenamiStyle } from "@tokenami/css";
import {
	MetadataCache,
	TFile,
	Vault,
	getAllTags,
	moment,
	setIcon,
} from "obsidian";
import {
	Issue,
	PriorityKeys,
	PriorityType,
	StatusKeys,
	StatusType,
} from "src/types";
import IssueListItem from "./IssueListItem";
import IssueListCategory from "./IssueListCategory";

export default function Zigzag(props: { vault: Vault; cache: MetadataCache }) {
	const VaultContext = createContext();
	let checkbox: HTMLInputElement | undefined;
	const [issues, setIssues] = createSignal<Issue[]>();

	const toggleCheck = () => {
		if (checkbox === undefined) return;
		const checked = checkbox.dataset.checked;
		if (checked === "false") checkbox.dataset.checked = "true";
		else checkbox.dataset.checked = "false";
	};

	const pullIssues = async () => {
		const issuesFiles = await Promise.all(
			props.vault.getMarkdownFiles().filter((md) => {
				const fileCache = props.cache.getFileCache(md);
				if (fileCache) {
					const tag = getAllTags(fileCache)?.filter(
						(tag) => tag === "#Zigzag/Issue",
					);
					if (tag && tag.length > 0) return true;
				}
				return false;
			}),
		);

		const issuesFromVault = await Promise.all(
			issuesFiles.map((file) =>
				parseIssue(file, props.vault, props.cache),
			),
		);

		setIssues(issuesFromVault);
	};

	createEffect(() => {
		props.vault.on("rename", pullIssues);
		props.cache.on("changed", pullIssues);

		pullIssues();
	});

	return (
		<VaultContext.Provider value={props.vault}>
			<div
				style={css({
					"--font-size": "var(--font-size_small)",
				})}
			>
				<IssueListCategory itemsCount={issues()?.length ?? 0} />
				<For each={issues()}>
					{(issue) => <IssueListItem issue={issue} />}
				</For>
				<button style={{ "margin-top": "8px" }} onclick={pullIssues}>
					refresh
				</button>
			</div>
		</VaultContext.Provider>
	);
}

const parseIssue = async (file: TFile, vault: Vault, cache: MetadataCache) => {
	const fileCache = cache.getFileCache(file);
	const content = await vault.read(file);

	let status = StatusKeys.Backlog;
	let priority = PriorityKeys.NoPriority;
	let created = "";
	let description = "description";

	if (fileCache?.frontmatter) {
		status = fileCache.frontmatter.status ?? status;
		priority = fileCache.frontmatter.priority ?? priority;
		created = fileCache.frontmatter.created ?? created;
	}

	if (fileCache?.sections && fileCache.headings) {
		const descriptionHeadingIndex = fileCache.headings.findIndex(
			(heading) => heading.heading == "Description",
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
				descriptionSection.end.offset,
			);
		}
	}

	const issue: Issue = {
		title: file.basename,
		status: status as StatusType,
		priority: priority as PriorityType,
		description: description,
		created: created,
	};

	return issue;
};
