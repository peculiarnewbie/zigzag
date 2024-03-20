import { Menu } from "obsidian";
import { StatusKeys, StatusType } from "src/types";

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
