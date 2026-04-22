import { Tile } from "./Tile";

type PlacementRule = {
	center?: Tile;
	up?: Tile;
	down?: Tile;
	left?: Tile;
	right?: Tile;
};

type ItemDef = {
	name: string;
	image: string;
	tile: Tile;
	allowedPlacements: PlacementRule[];
};

export const Item = {
	Gold: {
		name: "Gold",
		image: "gold",
		tile: "Gold",
		allowedPlacements: [
			{ center: "None", down: "Wall" },
			{ center: "None", down: "Platform" },
		],
	},
	Rope: {
		name: "Rope",
		image: "item_rope",
		tile: "Climb",
		allowedPlacements: [
			{ center: "None", up: "Wall" },
			{ center: "None", up: "Climb" },
			{ center: "Platform" },
		],
	},
	Ladder: {
		name: "Ladder",
		image: "item_ladder",
		tile: "Climb",
		allowedPlacements: [
			{ center: "None", down: "Wall" },
			{ center: "None", down: "Platform" },
		],
	},
	Stairs: {
		name: "Stairs",
		image: "item_stairs",
		tile: "Stairs",
		allowedPlacements: [
			{ center: "None", down: "Wall" },
			{ center: "None", down: "Platform" },
		],
	},
} satisfies { [key: string]: ItemDef };

export type Item = (typeof Item)[keyof typeof Item];
export type ItemKey = keyof typeof Item;
