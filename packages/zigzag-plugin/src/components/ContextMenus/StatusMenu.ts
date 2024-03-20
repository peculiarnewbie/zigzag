import { Menu } from "obsidian";
import { StatusKeys, StatusType } from "src/types";

export const changeStatus = (
	e: MouseEvent | { x: number; y: number },
	handler: (status: StatusType) => void
) => {
	const menu = new Menu();

	menu.addItem((item) => {
		item.setTitle("Backlog").onClick(() => handler(StatusKeys.Backlog));
	});

	menu.addItem((item) => {
		item.setTitle("Todo").onClick(() => handler(StatusKeys.Todo));
	});

	menu.addChild;

	if (e instanceof MouseEvent) menu.showAtMouseEvent(e);
	else menu.showAtPosition(e);
};
