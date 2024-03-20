import { css } from "src/css";
import { createEffect } from "solid-js";

export default function AddIssue() {
	let parent!: HTMLDivElement;
	let initialHeight = 0;

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
		initialHeight = parent.clientHeight;

		document.documentElement.style.setProperty("--top-offset", `0px`);

		//@ts-expect-error
		parent.parentElement.parentElement.style.top =
			"calc(-33vh + var(--top-offset))";
	});
	return (
		<div ref={parent}>
			<div
				style={css({
					"--display": "flex",
					"--gap": 2,
					"--set-y": "center",
					"--font-size": "var(--font-size_small)",
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
					"--pb": 3,
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
			<div
				style={css({
					"--pt": 1.5,
					"--pb": 3,
					"--display": "flex",
					"--gap": 2,
				})}
			>
				<select class="dropdown">
					<option>Backlog</option>
					<option>Todo</option>
				</select>
				<select class="dropdown">
					<option>No Priority</option>
					<option>Low</option>
					<option>Medium</option>
					<option>High</option>
					<option>Urgent</option>
				</select>
			</div>
			<div
				style={{
					...css({
						"--h": 0.25,
						"--bg": "var(--color_text-faint)",
					}),
					"margin-left": "-16px",
					"margin-right": "-16px",
				}}
			/>
			<div
				style={css({
					"--pt": 3,
					"--display": "flex",
					"--set-x": "end",
					"--gap": 2,
				})}
			>
				<div
					style={css({
						"--display": "flex",
						"--set-y": "center",
						"--gap": 0.5,
						"--font-size": "var(--font-size_small)",
					})}
				>
					<div class="checkbox-container">
						<input type="checkbox" />
					</div>
					<div>create more</div>
				</div>
				<button class="mod-cta">Create Issue</button>
			</div>
		</div>
	);
}
