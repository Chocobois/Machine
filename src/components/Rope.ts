import { GameScene } from "@/scenes/GameScene";
import { NeighborTiles, Tile, TileCoord } from "@/logic/Tile";
import { Entity } from "./tiles/Entity";

export class Rope extends Entity {
	constructor(scene: GameScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Climb";
		this.sprite.setTexture("rope");
	}

	updateSprite({ center, north, south }: NeighborTiles): void {
		const has = (tiles: Tile[], ...wanted: Tile[]) =>
			wanted.some((tile) => tiles.includes(tile));

		const y =
			has(north, "Wall") || has(center, "Platform") ? 0 : has(north, "Climb") ? 1 : 2;
		const x = has(south, "Wall", "Platform") ? 0 : has(south, "Climb") ? 1 : 2;
		const index = 3 * y + x;
		this.sprite.setFrame(index);
	}

	destroy(): void {
		this.sprite.destroy();
	}
}
