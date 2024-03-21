import { Menu } from "obsidian";
import { PriorityKeys, PriorityType, StatusKeys, StatusType } from "src/types";

export const changeStatus = (
	e: MouseEvent | { x: number; y: number },
	handler: (status: StatusType) => void
) => {
	const menu = new Menu();

	Object.values(StatusKeys).forEach((status) => {
		menu.addItem((item) => {
			item.setTitle(status.value)
				.setIcon(status.icon)
				.onClick(() => handler(status));
		});
	});

	if (e instanceof MouseEvent) menu.showAtMouseEvent(e);
	else menu.showAtPosition(e);
};

export const changePriority = (
	e: MouseEvent | { x: number; y: number },
	handler: (priority: PriorityType) => void
) => {
	const menu = new Menu();

	Object.values(PriorityKeys).forEach((priority) => {
		menu.addItem((item) => {
			item.setTitle(priority.value)
				.setIcon(priority.icon)
				.onClick(() => handler(priority));
		});
	});

	if (e instanceof MouseEvent) menu.showAtMouseEvent(e);
	else menu.showAtPosition(e);
};
