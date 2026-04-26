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

/* Tile definitions */

// Define the physical and interaction properties of each tile type
export type TileDef = {
	// Physics
	isSolid: boolean; // blocks movement
	isFloor: boolean; // can stand on top

	// Building/placement
	isObstacle: boolean; // can't build through it
	allowedAbove?: Tile[]; // if specified, can only be placed on these tiles
	disallowedAbove?: Tile[]; // can't be placed on these tiles

	// Interaction
	isInteractable: boolean; // player can detect/interact with it
};

export const TileDef: { [key in Tile]: TileDef } = {
	None: {
		isSolid: false,
		isFloor: false,
		isObstacle: false,
		isInteractable: false,
	},
	Wall: {
		isSolid: true,
		isFloor: true,
		isObstacle: true,
		isInteractable: false,
	},
	Platform: {
		isSolid: false, // not solid on sides
		isFloor: true, // acts as floor from above
		isObstacle: false,
		isInteractable: false,
	},
	Home: {
		isSolid: false,
		isFloor: false,
		isObstacle: true,
		isInteractable: true,
	},
	Gold: {
		isSolid: false,
		isFloor: false,
		isObstacle: true,
		isInteractable: true,
	},
	Death: {
		isSolid: false,
		isFloor: false,
		isObstacle: true,
		isInteractable: true,
	},
	Fan: {
		isSolid: false,
		isFloor: false,
		isObstacle: false,
		isInteractable: true,
		disallowedAbove: ["Fan"],
	},
	Updraft: {
		isSolid: false,
		isFloor: false,
		isObstacle: false,
		isInteractable: true,
	},
	Zipline: {
		isSolid: false,
		isFloor: false,
		isObstacle: false,
		isInteractable: true,
		disallowedAbove: ["Zipline"],
	},
	Climb: {
		isSolid: false,
		isFloor: false,
		isObstacle: false,
		isInteractable: true,
		disallowedAbove: ["Climb"],
	},
};
