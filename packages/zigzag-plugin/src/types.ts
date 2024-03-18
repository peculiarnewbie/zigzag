export type Message = {
	from: string;
	content: string;
	order: number;
};

export type MessageWithID = Message & { id: string };

export const StatusKeys = {
	Backlog: "Backglog",
	Todo: "Todo",
	InProgress: "In Progress",
	InReview: "In Review",
	Done: "Done",
	Cancelled: "Cancelled",
	Duplicate: "Duplicate",
} as const;

export type StatusType = (typeof StatusKeys)[keyof typeof StatusKeys];

export const PriorityKeys = {
	NoPriority: "No priority",
	Urgent: "Urgent",
	Hight: "High",
	Medium: "Medium",
	Low: "Low",
} as const;

export type PriorityType = (typeof PriorityKeys)[keyof typeof PriorityKeys];

export type Issue = {
	title: string;
	description: string;
	status: StatusType;
	priority: PriorityType;
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
