import { Entity } from "@/components/tiles/Entity";

export const SIZE = 256;

/* Tile types */

export const Tile = {
	None: "None",
	Wall: "Wall",
	Platform: "Platform",
	Home: "Home",
	Gold: "Gold",
	Climb: "Climb",
	Stairs: "Stairs",
	Death: "Death",
} as const;
export type Tile = (typeof Tile)[keyof typeof Tile];

export type NeighborTiles = {
	center: Tile;
	up: Tile;
	down: Tile;
	left: Tile;
	right: Tile;
};

export type NeighborEntities = {
	center?: Entity;
	up?: Entity;
	down?: Entity;
	left?: Entity;
	right?: Entity;
};

/* TileCoord */

export type TileCoord = { tileX: number; tileY: number };

export namespace TileCoord {
	export const compare = (a: TileCoord, b: TileCoord): boolean => {
		return a.tileX === b.tileX && a.tileY === b.tileY;
	};
	export const add = (coord: TileCoord, dx: number, dy: number): TileCoord => {
		return {
			tileX: coord.tileX + dx,
			tileY: coord.tileY + dy,
		};
	};
	export const tileToCoord = ({
		tileX,
		tileY,
	}: TileCoord): Phaser.Math.Vector2 => {
		return new Phaser.Math.Vector2(
			tileX * SIZE + SIZE / 2,
			tileY * SIZE + SIZE / 2,
		);
	};
}
