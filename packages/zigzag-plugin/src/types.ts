import { TFile } from "obsidian";

export type Message = {
	from: string;
	content: string;
	order: number;
};

export type MessageWithID = Message & { id: string };

export const StatusKeys = {
	Backlog: { value: "Backlog", icon: "circle-dashed", color: "" },
	Todo: { value: "Todo", icon: "circle", color: "" },
	InProgress: {
		value: "In Progress",
		icon: "circle-dot",
		color: "text-warning",
	},
	InReview: {
		value: "In Review",
		icon: "circle-ellipsis",
		color: "text-success",
	},
	Done: { value: "Done", icon: "check-circle", color: "interactive-accent" },
	Cancelled: { value: "Cancelled", icon: "x-circle", color: "" },
	Duplicate: { value: "Duplicate", icon: "x-circle", color: "" },
} as const;

export type StatusType = (typeof StatusKeys)[keyof typeof StatusKeys];
export type StatusValuesType =
	(typeof StatusKeys)[keyof typeof StatusKeys]["value"];
export type StatusIconsType =
	(typeof StatusKeys)[keyof typeof StatusKeys]["icon"];

export const PriorityKeys = {
	NoPriority: { value: "No Priority", icon: "minus", color: "" },
	Urgent: { value: "Urgent", icon: "alert-octagon", color: "text-error" },
	High: { value: "High", icon: "signal", color: "" },
	Medium: { value: "Medium", icon: "signal-high", color: "" },
	Low: { value: "Low", icon: "signal-low", color: "" },
} as const;

export type PriorityType = (typeof PriorityKeys)[keyof typeof PriorityKeys];
export type PriorityValuesType =
	(typeof PriorityKeys)[keyof typeof PriorityKeys]["value"];
export type PriorityIconsType =
	(typeof PriorityKeys)[keyof typeof PriorityKeys]["icon"];

export type Issue = {
	file: TFile;
	title: string;
	description?: string;
	status: StatusType;
	priority: PriorityType;
	created: string;
};

/*
$title
---
status: $status
priority: $priority
---

# Description
$description

# Activity

*/
