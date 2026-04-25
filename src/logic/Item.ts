import { Tile } from "./Tile";

export type PlacementRule = {
	center?: Tile;
	north?: Tile;
	east?: Tile;
	south?: Tile;
	west?: Tile;
};

type ItemDef = {
	name: string;
	image: string;
	frame: number;
	tile: Tile;
	rules: {
		start: PlacementRule[];
		middle: PlacementRule[];
		end: PlacementRule[];
		axis: "x" | "y" | "";
		min: number;
		max: number;
	};
};

export const Item = {
	Rope: {
		name: "Rope",
		image: "entities",
		frame: 2,
		tile: "Climb",
		rules: {
			start: [{ center: "None", north: "Wall" }, { center: "Platform" }],
			middle: [{ center: "None" }],
			end: [{ center: "None" }],
			axis: "y",
			min: 2,
			max: 8,
		},
	},
	Fan: {
		name: "Fan",
		image: "entities",
		frame: 10,
		tile: "Fan",
		rules: {
			start: [
				{ center: "None", south: "Wall" },
				{ center: "None", south: "Platform" },
			],
			middle: [{ center: "None" }],
			end: [{ center: "None" }],
			axis: "",
			min: 1,
			max: 1,
		},
	},
	Zipline: {
		name: "Zipline",
		image: "entities",
		frame: 3,
		tile: "Zipline",
		rules: {
			start: [
				{ center: "None", south: "Wall" },
				{ center: "None", south: "Platform" },
				{ center: "None", west: "Wall" },
				{ center: "None", east: "Wall" },
			],
			middle: [{ center: "None" }],
			end: [
				{ center: "None", south: "Wall" },
				{ center: "None", south: "Platform" },
				{ center: "None", west: "Wall" },
				{ center: "None", east: "Wall" },
			],
			axis: "x",
			min: 3,
			max: 8,
		},
	},
} satisfies { [key: string]: ItemDef };

export type Item = (typeof Item)[keyof typeof Item];
export type ItemKey = keyof typeof Item;
