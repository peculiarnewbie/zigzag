import { App, ItemView, MetadataCache, Vault, WorkspaceLeaf } from "obsidian";
import { render } from "solid-js/web";
import Zigzag from "../Zigzag";

export class ZigzagView extends ItemView {
	iconName: string;
	listeners: any[];
	dispose: any;
	app: App;

	constructor(leaf: WorkspaceLeaf, iconName: string, app: App) {
		super(leaf);
		this.iconName = iconName;
		this.app = app;
	}

	getViewType(): string {
		return "zigzag-view";
	}

	getDisplayText(): string {
		return "Zigzag view";
	}

	getIcon(): string {
		return this.iconName;
	}

	async onOpen() {
		const root = this.containerEl.children[1];
		const wrapper = root.createEl("div");
		let dock: HTMLElement | ShadowRoot;

		wrapper.classList.add("obsidian-zigzag");

		dock = wrapper;

		this.dispose = render(() => Zigzag({ app: this.app }), dock);
	}

	async onClose() {
		this.dispose();
	}
}
