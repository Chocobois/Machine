import { Inventory, items } from "./Inventory";

export interface Level {
	tilemapKey: string;
	title: string;
	inventory: Inventory;
}

export const levels = {
	level1: {
		tilemapKey: "level1",
		title: "Level 1",
		inventory: [
			{ item: items.Cannon, amount: 1 },
			{ item: items.Ladder, amount: 2 },
			{ item: items.Rope, amount: 3 },
		],
	},
} as const satisfies { [key: string]: Level };
