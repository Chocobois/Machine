import { tilemap } from "@/assets/util";
import { Inventory } from "./Inventory";

type LevelDef = {
	title: string;
	playerCount: number;
	inventory: Inventory;
};

export const levels = {
	level1: {
		title: "Level 1",
		playerCount: 15,
		inventory: [
			{ itemKey: "Rope", amount: 20 },
		],
	},
	level2: {
		title: "Level 2",
		playerCount: 8,
		inventory: [
			{ itemKey: "Ladder", amount: 2 },
			{ itemKey: "Rope", amount: 3 },
		],
	},
} as const satisfies { [key: string]: LevelDef };

export type LevelKey = keyof typeof levels;

export const tilemaps: { [key in LevelKey]: string } = {
	level1: tilemap(`maps/level1.json`),
	level2: tilemap(`maps/level2.json`),
};
