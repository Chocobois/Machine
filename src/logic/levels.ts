import { tilemap } from "@/assets/util";
import { Inventory } from "./Inventory";

type LevelDef = {
	title: string;
	playerCount: number;
	treasureCount: number;
	inventory: Inventory;
};

export const levels = {
	level1: {
		title: "Learning the ropes",
		playerCount: 8,
		treasureCount: 2,
		inventory: [
			{ itemKey: "Rope", amount: 4 }, //
		],
	},
	level4: {
		title: "Zipping across",
		playerCount: 10,
		treasureCount: 3,
		inventory: [
			{ itemKey: "Zipline", amount: 3 }, //
		],
	},
	level2: {
		title: "Beware of direction",
		playerCount: 9,
		treasureCount: 4,
		inventory: [
			{ itemKey: "Rope", amount: 6 }, //
		],
	},
	level5: {
		title: "Crazy corridors",
		playerCount: 20,
		treasureCount: 6,
		inventory: [
			{ itemKey: "Fan", amount: 3 },
			{ itemKey: "Rope", amount: 1 },
			{ itemKey: "Zipline", amount: 1 },
		],
	},
	level3: {
		title: "Spiky waters",
		playerCount: 12,
		treasureCount: 3,
		inventory: [
			{ itemKey: "Fan", amount: 4 },
			{ itemKey: "Rope", amount: 3 },
		],
	},
	// level6: {
	// 	title: "Level 6",
	// 	playerCount: 12,
	// 	treasureCount: 3,
	// 	inventory: [
	// 		{ itemKey: "Rope", amount: 2 },
	// 		{ itemKey: "Zipline", amount: 2 },
	// 	],
	// },
	level_vertical: {
		title: "The ultimate climb",
		playerCount: 64,
		treasureCount: 21,
		inventory: [
			{ itemKey: "Rope", amount: 20 },
			{ itemKey: "Fan", amount: 20 },
			{ itemKey: "Zipline", amount: 20 },
		],
	},
	// leveldev1: {
	// 	title: "Beware of heights",
	// 	playerCount: 15,
	// 	treasureCount: 9,
	// 	inventory: [
	// 		{ itemKey: "Rope", amount: 6 },
	// 		{ itemKey: "Fan", amount: 6 },
	// 		{ itemKey: "Zipline", amount: 4 },
	// 	],
	// },
} as const satisfies { [key: string]: LevelDef };

export type LevelKey = keyof typeof levels;

export const tilemaps: { [key in LevelKey]: string } = {
	level1: tilemap(`maps/level1.json`),
	level2: tilemap(`maps/level2.json`),
	level3: tilemap(`maps/level3.json`),
	level4: tilemap(`maps/level4.json`),
	level5: tilemap(`maps/level5.json`),
	// level6: tilemap(`maps/level6.json`),
	// leveldev1: tilemap(`maps/leveldev1.json`),
	level_vertical: tilemap(`maps/level_vertical.json`),
};

export const levelKeys = Object.keys(levels) as LevelKey[];

export function getNextLevel(current?: LevelKey): LevelKey {
	if (!current) return levelKeys[0];

	const index = levelKeys.indexOf(current);
	return levelKeys[(index + 1) % levelKeys.length];
}
