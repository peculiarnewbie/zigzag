import { createContext, createSignal } from "solid-js";
import { css, type TokenamiStyle } from "@tokenami/css";
import {
	FrontMatterCache,
	MetadataCache,
	Vault,
	getFrontMatterInfo,
	parseYaml,
} from "obsidian";
import {
	Issue,
	PriorityKeys,
	PriorityType,
	StatusKeys,
	StatusType,
} from "src/types";

export default function Zigzag(props: { vault: Vault; cache: MetadataCache }) {
	const VaultContext = createContext();
	let checkbox: HTMLInputElement | undefined;
	const [count, setCount] = createSignal(0);
	const [stuff, setStuff] = createSignal("");

	const toggleCheck = () => {
		if (checkbox === undefined) return;
		const checked = checkbox.dataset.checked;
		if (checked === "false") checkbox.dataset.checked = "true";
		else checkbox.dataset.checked = "false";
	};

	const changeStuff = async () => {
		const [file, ...rest] = await Promise.all(
			props.vault
				.getMarkdownFiles()
				.filter((md) => md.basename == "Issue Sample"),
		);

		const cache = props.cache.getFileCache(file);
		const content = await props.vault.read(file);

		let status = StatusKeys.Backlog;
		let priority = PriorityKeys.NoPriority;
		let description = "description";

		if (cache?.frontmatter) {
			status = cache.frontmatter.status ?? status;
			priority = cache.frontmatter.priority ?? priority;
		}

		if (cache?.sections && cache.headings) {
			const descriptionHeadingIndex = cache.headings.findIndex(
				(heading) => heading.heading == "Description",
			);
			console.log(descriptionHeadingIndex);
			if (descriptionHeadingIndex !== undefined) {
				let headingIter = -1;
				let descriptionIndex = 0;

				for (let i = 0; i < cache.sections.length; i++) {
					if (cache.sections[i].type === "heading") {
						headingIter++;
						if (headingIter === descriptionHeadingIndex) {
							descriptionIndex = i + 1;
						}
					}
				}

				const descriptionSection =
					cache.sections[descriptionIndex].position;

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

		console.log(issue, cache);
		setStuff(JSON.stringify(issue));
	};

	return (
		<VaultContext.Provider value={props.vault}>
			<div>
				<button onclick={changeStuff}>show stuff</button>
				<p>{stuff()}</p>
			</div>
		</VaultContext.Provider>
	);
}
