import { GameScene } from "@/scenes/GameScene";
import { NeighborTiles, SIZE, Tile, TileCoord } from "@/logic/Tile";
import { Entity } from "./tiles/Entity";

export class Rope extends Entity {
	constructor(scene: GameScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Climb";
		this.sprite.setTexture("entities", 2);
		this.sprite.setScale(SIZE / this.sprite.width);
	}

	updateSprite({ north, south }: NeighborTiles): void {
		const has = (tiles: Tile[], ...wanted: Tile[]) =>
			wanted.some((tile) => tiles.includes(tile));

		const up = has(north, "Climb");
		const down = has(south, "Climb");
		const index = up && down ? 12 : up ? 17 : down ? 7 : 2;
		this.sprite.setFrame(index);
	}

	destroy(): void {
		this.sprite.destroy();
	}
}
