import { For, createContext, createSignal } from "solid-js";
import { css, type TokenamiStyle } from "@tokenami/css";
import { MetadataCache, TFile, Vault, getAllTags } from "obsidian";
import {
	Issue,
	PriorityKeys,
	PriorityType,
	StatusKeys,
	StatusType,
} from "src/types";
import IssueListItem from "./IssueListItem";

export default function Zigzag(props: { vault: Vault; cache: MetadataCache }) {
	const VaultContext = createContext();
	let checkbox: HTMLInputElement | undefined;
	const [count, setCount] = createSignal(0);
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

	return (
		<VaultContext.Provider value={props.vault}>
			<div>
				<button onclick={pullIssues}>show stuff</button>
				<For each={issues()}>
					{(issue) => <IssueListItem issue={issue} />}
				</For>
			</div>
		</VaultContext.Provider>
	);
}

const parseIssue = async (file: TFile, vault: Vault, cache: MetadataCache) => {
	const fileCache = cache.getFileCache(file);
	const content = await vault.read(file);

	let status = StatusKeys.Backlog;
	let priority = PriorityKeys.NoPriority;
	let description = "description";

	if (fileCache?.frontmatter) {
		status = fileCache.frontmatter.status ?? status;
		priority = fileCache.frontmatter.priority ?? priority;
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
	};

	return issue;
};
