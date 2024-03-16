import { createSignal } from "solid-js";
import { css } from "@tokenami/css";

const lmao = css.compose({
	"--background-color": "var(--color_slate-100)",
	"--color": "var(--color_slate-700)",
});

export default function Zigzag() {
	let checkbox: HTMLInputElement | undefined = undefined;
	const [count, setCount] = createSignal(0);

	const toggleCheck = () => {
		if (!checkbox) return;
		const checked = checkbox.dataset.checked;
		if (checked === "false") checkbox.dataset.checked = "true";
		else checkbox.dataset.checked = "false";
	};

	return (
		<div>
			<button onclick={() => setCount(count() + 1)}>plus</button>
			<div style={lmao()}>
				<p style={css({ "--padding": 10 })}>{count()}</p>
			</div>
			<input
				type="checkbox"
				data-checked="false"
				onclick={toggleCheck}
				ref={checkbox}
			/>
			<div>hii</div>
		</div>
	);
}
