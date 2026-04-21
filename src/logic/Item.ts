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
	allowedPlacements: PlacementRule[];
};

export const Item = {
	Gold: {
		name: "Gold",
		image: "gold",
		allowedPlacements: [
			{ center: "None", down: "Wall" },
			{ center: "None", down: "Platform" },
		],
	},
	Rope: {
		name: "Rope",
		image: "item_rope",
		allowedPlacements: [
			{ center: "None", up: "Wall" },
			{ center: "None", up: "Climb" },
			{ center: "Platform" },
		],
	},
	Ladder: {
		name: "Ladder",
		image: "item_ladder",
		allowedPlacements: [
			{ center: "None", down: "Wall" },
			{ center: "None", down: "Platform" },
		],
	},
	Cannon: {
		name: "Cannon",
		image: "item_cannon",
		allowedPlacements: [
			{ center: "None", down: "Wall" },
			{ center: "None", down: "Platform" },
		],
	},
	Stairs: {
		name: "Stairs",
		image: "item_stairs",
		allowedPlacements: [
			{ center: "None", down: "Wall" },
			{ center: "None", down: "Platform" },
		],
	},
} satisfies { [key: string]: ItemDef };

export type Item = (typeof Item)[keyof typeof Item];
export type ItemKey = keyof typeof Item;
