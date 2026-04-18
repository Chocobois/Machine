// Tiles

import { Type } from "./components/tiles/Tile";

const _ = Type.None;
const W = Type.Wall;
const P = Type.Platform;
const g = Type.Gold;

// Levels

export interface Level {
	tiles: Type[][];
}

export const levels: Level[] = [
	{
		tiles: [
			[W, _, W, W, W, W, W, W, W, W],
			[W, _, _, _, _, _, _, g, g, W],
			[W, _, _, _, _, _, P, P, P, W],
			[W, _, _, _, _, _, _, _, _, W],
			[W, _, _, _, _, _, _, _, _, W],
			[W, W, W, W, W, W, W, W, W, W],
		],
	},
];
