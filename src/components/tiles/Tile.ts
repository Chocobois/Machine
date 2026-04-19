import { GameScene } from "@/scenes/GameScene";
import { BaseTile } from "./BaseTile";

export enum Tile {
	None,
	Wall,
	Platform,
	Rope,
	Climb,
	Gold,
	Home,
	Death,
}

export type TileCoord = { tileX: number; tileY: number };

export type NeighborTiles = {
	center: BaseTile | undefined;
	up: BaseTile | undefined;
	down: BaseTile | undefined;
	left: BaseTile | undefined;
	right: BaseTile | undefined;
};

export type NeighborTypes = {
	center: Tile;
	up: Tile;
	down: Tile;
	left: Tile;
	right: Tile;
};

export const SIZE = 256;

export function coordToTile(coord: Phaser.Types.Math.Vector2Like): TileCoord {
	return {
		tileX: Math.floor(coord.x / SIZE),
		tileY: Math.floor(coord.y / SIZE),
	};
}

export function tileToCoord({ tileX, tileY }: TileCoord): Phaser.Math.Vector2 {
	return new Phaser.Math.Vector2(
		tileX * SIZE + SIZE / 2,
		tileY * SIZE + SIZE / 2,
	);
}
