import { css } from "@tokenami/css";
import { Issue, StatusKeys, StatusType } from "src/types";

export default function IssueListItem(props: { issue: Issue }) {
	return (
		<div style={css({ "--display": "flex" })}>
			<div>{props.issue.priority}.</div>
			<StatusIcon status={props.issue.status} />
			<div>{props.issue.title}</div>
		</div>
	);
}

function StatusIcon(props: { status: StatusType }) {
	switch (props.status) {
		case StatusKeys.Backlog:
			return (
				<div
					style={css({
						"--background-color": "var(--color_blue-400)",
					})}
				>
					B
				</div>
			);
			break;
		case StatusKeys.Cancelled:
			return <div>C</div>;
			break;
		case StatusKeys.Done:
			return (
				<div
					style={css({
						"--background-color":
							"var(--color_--interactive-accent)",
					})}
				>
					D
				</div>
			);
			break;
	}
}
