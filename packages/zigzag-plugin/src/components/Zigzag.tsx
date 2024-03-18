import { createSignal } from "solid-js";
import { css, type TokenamiStyle } from "@tokenami/css";

const lmao = css.compose({
	"--color": "var(--color_--interactive-accent)",
	"--font-size": "var(---, 50pt)",
	"--border": "var(---, solid red)",
});

const cssVariables = {
	interactive: "var(--interactive-accent)",
};

export default function Zigzag() {
	let checkbox: HTMLInputElement | undefined;
	const [count, setCount] = createSignal(0);

	const toggleCheck = () => {
		if (checkbox === undefined) return;
		const checked = checkbox.dataset.checked;
		if (checked === "false") checkbox.dataset.checked = "true";
		else checkbox.dataset.checked = "false";
	};

	return (
		<div>
			<button class="mod-cta" onclick={() => setCount(count() + 1)}>
				add
			</button>

			<div style={lmao()}>
				<div
					style={css({
						"--background-color":
							"var(--color_--interactive-accent)",
					})}
				>
					<p style={css({ "--padding": 10 })}>{count()}</p>
				</div>
			</div>
			<input
				type="checkbox"
				data-checked="false"
				onclick={toggleCheck}
				ref={checkbox}
			/>
			<div style={css({ "--color": "var(--color_blue-400)" })}>hii</div>
		</div>
	);
}
