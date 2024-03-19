import { css } from "src/css";
import { createEffect } from "solid-js";

export default function AddIssue() {
	let parent!: HTMLDivElement;
	let title!: HTMLDivElement;

	const checkEmpty = (e: InputEvent) => {
		const value = (e.target as HTMLDivElement).innerText;
		if (value === "") {
			console.log("empty");
			title.addClass("editor-placeholder");
		} else {
			title.removeClass("editor-placeholder");
		}
	};

	createEffect(() => {
		//@ts-expect-error
		parent.parentElement.parentElement.style.top = "-33vh";
	});
	return (
		<div ref={parent}>
			<div>New Issue</div>
			<div
				ref={title}
				class="cm-active HyperMD-header HyperMD-header-2 cm-line editor-placeholder"
				contentEditable={true}
				data-empty-text="Issue Title"
				oninput={checkEmpty}
			></div>
			<div
				class="cm-active HyperMD-header HyperMD-header-2 cm-line"
				contentEditable={true}
				aria-placeholder="Issue Title"
			></div>
			<input type="text" />
		</div>
	);
}
