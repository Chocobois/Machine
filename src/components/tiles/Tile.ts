export const SIZE = 256;

export const Tile = {
	None: "None",
	Wall: "Wall",
	Platform: "Platform",
	Rope: "Rope",
	Climb: "Climb",
	Gold: "Gold",
	Home: "Home",
	Death: "Death",
	Stairs: "Stairs",
} as const;
export type Tile = (typeof Tile)[keyof typeof Tile];

export type TileCoord = { tileX: number; tileY: number };

export type NeighborTiles = {
	center: Tile;
	up: Tile;
	down: Tile;
	left: Tile;
	right: Tile;
};

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
