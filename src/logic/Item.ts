import { Tile } from "./Tile";

type PlacementRule = {
	center?: Tile;
	north?: Tile;
	east?: Tile;
	south?: Tile;
	west?: Tile;
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
			{ center: "None", south: "Wall" },
			{ center: "None", south: "Platform" },
		],
	},
	Rope: {
		name: "Rope",
		image: "item_rope",
		tile: "Climb",
		allowedPlacements: [
			{ center: "None", north: "Wall" },
			{ center: "None", north: "Climb" },
			{ center: "Platform" },
		],
	},
	Ladder: {
		name: "Ladder",
		image: "item_ladder",
		tile: "Climb",
		allowedPlacements: [
			{ center: "None", south: "Wall" },
			{ center: "None", south: "Platform" },
		],
	},
	Stairs: {
		name: "Stairs",
		image: "item_stairs",
		tile: "Stairs",
		allowedPlacements: [
			{ center: "None", south: "Wall" },
			{ center: "None", south: "Platform" },
			{ center: "None", south: "Stairs" },
		],
	},
	Fan: {
		name: "Fan",
		image: "item_fan",
		tile: "Fan",
		allowedPlacements: [
			{ center: "None", south: "Wall" },
			{ center: "None", south: "Platform" },
		],
	},
	Zipline: {
		name: "Zipline",
		image: "item_zipline",
		tile: "Zipline",
		allowedPlacements: [
			{ center: "None", west: "Zipline" },
			{ center: "None", east: "Zipline" },
			{ center: "None", south: "Wall" },
			{ center: "None", south: "Platform" },
			{ center: "None", west: "Wall" },
			{ center: "None", west: "Platform" },
			{ center: "None", east: "Wall" },
			{ center: "None", east: "Platform" },
		],
	},
} satisfies { [key: string]: ItemDef };

export type Item = (typeof Item)[keyof typeof Item];
export type ItemKey = keyof typeof Item;
