import { App, Modal } from "obsidian";
import { render } from "solid-js/web";
import AddIssue from "./AddIssue";

export class AddIssueModal extends Modal {
	app: App;
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let { contentEl } = this;

		render(() => AddIssue(), contentEl);
	}

	onClose() {
		let { contentEl } = this;
		console.log("nope");
		contentEl.empty();
	}
}
