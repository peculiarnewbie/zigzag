import { css } from "src/css";
import { createEffect } from "solid-js";

export default function AddIssue() {
	let parent!: HTMLDivElement;
	let initialHeight: number;

	const checkEmpty = (e: InputEvent) => {
		const el = e.target as HTMLDivElement;
		const value = el.innerText;
		if (value === "" || value === "\n") {
			el.toggleClass("editor-placeholder", true);
			el.empty();
			document.documentElement.style.setProperty("--top-offset", "0px");
		} else {
			el.toggleClass("editor-placeholder", false);
			document.documentElement.style.setProperty(
				"--top-offset",
				`${parent.clientHeight / 2 - initialHeight / 2}px`
			);
		}
	};

	createEffect(() => {
		//@ts-expect-error
		parent.parentElement.parentElement.style.top =
			"calc(-33vh + var(--top-offset))";
		initialHeight = parent.clientHeight;
	});
	return (
		<div ref={parent}>
			<div
				style={css({
					"--display": "flex",
					"--gap": 2,
					"--set-y": "center",
				})}
			>
				<div
					style={css({
						"--border": "var(--border_standard)",
						"--p": 1,
					})}
				>
					code
				</div>
				<div>{">"}</div>
				<div>New Issue</div>
			</div>
			<div style={css({ "--h": 1.5 })} />
			<div
				style={css({
					"--font-weight": "var(--weight_bold)",
					"--font-size": "var(--font-size_large)",
					"--cursor": "text",
				})}
				class=" editor-placeholder"
				contentEditable={true}
				data-empty-text="Issue Title"
				oninput={checkEmpty}
			/>
			<div style={css({ "--h": 2.5 })} />
			<div
				style={css({
					"--height": "var(---, fit-content)",
					"--min-height": 13,
					"--max-height": 100,
					"--overflow-y": "auto",
				})}
			>
				<div
					style={css({ "--cursor": "text" })}
					class="editor-placeholder"
					contentEditable={true}
					data-empty-text="Add description..."
					oninput={checkEmpty}
				/>
			</div>
		</div>
	);
}
