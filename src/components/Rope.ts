import { GameScene } from "@/scenes/GameScene";
import { NeighborTiles, Tile, TileCoord } from "@/logic/Tile";
import { Entity } from "./tiles/Entity";

export class Rope extends Entity {
	constructor(scene: GameScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Climb";
		this.sprite.setTexture("rope");
	}

	updateSprite({ center, up, down }: NeighborTiles): void {
		const has = (tiles: Tile[], ...wanted: Tile[]) =>
			wanted.some((tile) => tiles.includes(tile));

		const y =
			has(up, "Wall") || has(center, "Platform") ? 0 : has(up, "Climb") ? 1 : 2;
		const x = has(down, "Wall", "Platform") ? 0 : has(down, "Climb") ? 1 : 2;
		const index = 3 * y + x;
		this.sprite.setFrame(index);
	}

	destroy(): void {
		this.sprite.destroy();
	}
}
