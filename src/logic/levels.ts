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
			{ itemKey: "Rope", amount: 2 }
		],
	},
	level2: {
		title: "Level 2",
		playerCount: 8,
		inventory: [
			{ itemKey: "Rope", amount: 3 }
		],
	},
	level3: {
		title: "Level 3",
		playerCount: 8,
		inventory: [
			{ itemKey: "Fan", amount: 3 },
			{ itemKey: "Rope", amount: 1 },
		],
	},
	level4: {
		title: "Level 4",
		playerCount: 8,
		inventory: [
			{ itemKey: "Zipline", amount: 3 }
		],
	},
	level5: {
		title: "Level 5",
		playerCount: 8,
		inventory: [
			{ itemKey: "Fan", amount: 3 },
			{ itemKey: "Rope", amount: 1 },
			{ itemKey: "Zipline", amount: 1 }
		],
	},
	level6: {
		title: "Level 6",
		playerCount: 8,
		inventory: [
			{ itemKey: "Stairs", amount: 5 },
			{ itemKey: "Rope", amount: 2 },
			{ itemKey: "Zipline", amount: 2 },
		],
	},
	leveldev1: {
		title: "Level Dev 1",
		playerCount: 8,
		inventory: [
			{ itemKey: "Rope", amount: 20 },
			{ itemKey: "Fan", amount: 10 },
			{ itemKey: "Zipline", amount: 10 },
		],
	},
	leveldev2: {
		title: "Level Dev 2",
		playerCount: 8,
		inventory: [
			{ itemKey: "Rope", amount: 20 },
			{ itemKey: "Fan", amount: 10 },
		],
	},
} as const satisfies { [key: string]: LevelDef };

export type LevelKey = keyof typeof levels;

export const tilemaps: { [key in LevelKey]: string } = {
	level1: tilemap(`maps/level1.json`),
	level2: tilemap(`maps/level2.json`),
	level3: tilemap(`maps/level3.json`),
	level4: tilemap(`maps/level4.json`),
	level5: tilemap(`maps/level5.json`),
	level6: tilemap(`maps/level6.json`),
	leveldev1: tilemap(`maps/leveldev1.json`),
	leveldev2: tilemap(`maps/leveldev2.json`)
};
