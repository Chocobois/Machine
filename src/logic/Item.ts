import { Fan } from "@/components/tiles/Fan";
import { NeighborTiles, Tile, TileDef } from "./Tile";

export type PropertyTest = (def: TileDef) => boolean;

export type PlacementCondition = {
	[key in keyof NeighborTiles]?: PropertyTest | PropertyTest[];
};

type ItemDef = {
	name: string;
	image: string;
	frame: number;
	tile: Tile;
	rules: {
		start: PlacementCondition[];
		middle: PlacementCondition[];
		end: PlacementCondition[];
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
			start: [
				{ center: (d) => !d.isSolid, north: (d) => d.isSolid },
				{ center: (d) => !d.isSolid && d.isFloor },
			],
			middle: [{ center: (d) => !d.isFloor }],
			end: [{ center: (d) => !d.isFloor }],
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
			start: [{ center: (d) => !d.isSolid, south: (d) => d.isFloor }],
			middle: [{ center: (d) => !d.isSolid }],
			end: [{ center: (d) => !d.isSolid }],
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
				{ center: (d) => !d.isFloor, south: (d) => d.isFloor },
				{ center: (d) => !d.isFloor, west: (d) => d.isSolid },
				{ center: (d) => !d.isFloor, east: (d) => d.isSolid },
			],
			middle: [{ center: (d) => !d.isSolid }],
			end: [
				{ center: (d) => !d.isFloor, south: (d) => d.isFloor },
				{ center: (d) => !d.isFloor, west: (d) => d.isSolid },
				{ center: (d) => !d.isFloor, east: (d) => d.isSolid },
			],
			axis: "x",
			min: 3,
			max: 8,
		},
	},
} satisfies { [key: string]: ItemDef };

export type Item = (typeof Item)[keyof typeof Item];
export type ItemKey = keyof typeof Item;
