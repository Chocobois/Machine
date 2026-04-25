import { Entity } from "@/components/tiles/Entity";

export const SIZE = 16;

/* Tile types */

export const Tile = {
	None: "None",
	Wall: "Wall",
	Platform: "Platform",
	Home: "Home",
	Gold: "Gold",
	Climb: "Climb",
	Stairs: "Stairs",
	Fan: "Fan",
	Updraft: "Updraft",
	Zipline: "Zipline",
	Death: "Death",
} as const;
export type Tile = (typeof Tile)[keyof typeof Tile];

export type NeighborTiles = {
	center: Tile[];
	north: Tile[];
	ne: Tile[];
	east: Tile[];
	se: Tile[];
	south: Tile[];
	sw: Tile[];
	west: Tile[];
	nw: Tile[];
};

export type NeighborEntities = {
	center?: Entity[];
	north?: Entity[];
	ne?: Entity[];
	east?: Entity[];
	se?: Entity[];
	south?: Entity[];
	sw?: Entity[];
	west?: Entity[];
	nw?: Entity[];
};

/* TileCoord */

export type TileCoord = { x: number; y: number };

export namespace TileCoord {
	export const compare = (a: TileCoord, b: TileCoord): boolean => {
		return a.x === b.x && a.y === b.y;
	};
	export const add = (coord: TileCoord, dx: number, dy: number): TileCoord => {
		return { x: coord.x + dx, y: coord.y + dy };
	};
	export const tileToCoord = ({ x, y }: TileCoord): Phaser.Math.Vector2 => {
		return new Phaser.Math.Vector2(x * SIZE + SIZE / 2, y * SIZE + SIZE / 2);
	};
}
