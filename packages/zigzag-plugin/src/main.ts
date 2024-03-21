import { nanoid } from "nanoid";
import {
	App,
	Editor,
	ItemView,
	MarkdownView,
	MetadataCache,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	Vault,
	WorkspaceLeaf,
	request,
	requestUrl,
} from "obsidian";
import { render } from "solid-js/web";
import Zigzag from "./components/Zigzag";
import { ZigzagView } from "./components/IssuesList/ZigzagView";
import { AddIssueModal } from "./components/AddIssueModal/AddIssueModal";
// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	workerurl: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	workerurl: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	private zigzagView: ZigzagView;

	private readonly toggleZigZag = async (): Promise<void> => {
		const { workspace } = this.app;
		const existing = workspace.getLeavesOfType("zigzag-view");

		if (existing.length > 0) {
			workspace.detachLeavesOfType("zigzag-view");
		} else {
			await workspace.getLeaf(false).setViewState({
				type: "zigzag-view",
				active: true,
			});

			workspace.revealLeaf(workspace.getLeavesOfType("zigzag-view")[0]);
		}
	};

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon("bracket-glyph", "Zigzag", () =>
			this.toggleZigZag()
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");

		this.addCommand({
			id: "zigzag-add-issue",
			name: "Add Issue",
			callback: () => {
				console.log("open add issue modal");
				new AddIssueModal(this.app).open();
			},
		});

		this.registerView(
			"zigzag-view",
			(leaf) =>
				(this.zigzagView = new ZigzagView(
					leaf,
					"bracket-glyph",
					this.app
				))
		);

		const testPatch = {
			// We will discuss these two fields in later steps.
			lastMutationIDChanges: {},
			cookie: 42,
			patch: [
				{ op: "clear" },
				{
					op: "put",
					key: "message/qpdgkvpb9ao",
					value: {
						from: "Jane",
						content: "Hey, what's for lunch?",
						order: 1,
					},
				},
				{
					op: "put",
					key: "message/5ahljadc408",
					value: {
						from: "Fred",
						content: "tacos?",
						order: 2,
					},
				},
			],
		};

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "open-sample-modal-complex",
			name: "Open sample modal (complex)",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("worker url")
			.setDesc("provide your own worker (follow this guide)")
			.addText((text) =>
				text
					.setPlaceholder("Enter your url")
					.setValue(this.plugin.settings.workerurl)
					.onChange(async (value) => {
						this.plugin.settings.workerurl = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
