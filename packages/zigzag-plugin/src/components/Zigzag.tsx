import { createContext, createSignal } from "solid-js";
import { css, type TokenamiStyle } from "@tokenami/css";
import { Vault } from "obsidian";

export default function Zigzag(props: { vault: Vault }) {
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
		const fileContents: string[] = await Promise.all(
			props.vault
				.getMarkdownFiles()
				.map((file) => props.vault.cachedRead(file)),
		);

		let totalLength = 0;
		fileContents.forEach((content) => {
			totalLength += content.length;
		});

		setStuff((totalLength / fileContents.length).toString());
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
