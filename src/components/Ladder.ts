import { BaseScene } from "@/scenes/BaseScene";
import { NeighborTiles, SIZE, Tile, TileCoord } from "@/logic/Tile";
import { Entity } from "./tiles/Entity";

export class Ladder extends Entity {
	constructor(scene: BaseScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Climb";
		this.sprite.setTexture("environment", 8);
		this.sprite.setScale(SIZE / this.sprite.width);
	}

	updateSprite({ north, south }: NeighborTiles): void {
		const has = (tiles: Tile[], ...wanted: Tile[]) =>
			wanted.some((tile) => tiles.includes(tile));

		const up = has(north, "Climb");
		const index = up ? 8 : 1;
		this.sprite.setFrame(index);
	}
}
