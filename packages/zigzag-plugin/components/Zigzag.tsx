import { createSignal } from "solid-js";

export default function Zigzag() {
	const [count, setCount] = createSignal(0);
	return (
		<div>
			<button onclick={() => setCount(count() + 1)}>plus</button>
			<p>{count()}</p>
			<div>hii</div>
		</div>
	);
}
