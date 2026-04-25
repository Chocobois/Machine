import { BaseScene } from "@/scenes/BaseScene";
import { NeighborTiles, SIZE, Tile, TileCoord } from "@/logic/Tile";
import { Entity } from "./tiles/Entity";

export class Zipline extends Entity {
	constructor(scene: BaseScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Zipline";
		this.sprite.setTexture("entities", 8);
		this.sprite.setScale(SIZE / this.sprite.width);
	}

	updateSprite({ east, south, west }: NeighborTiles): void {
		const has = (tiles: Tile[], ...wanted: Tile[]) =>
			wanted.some((tile) => tiles.includes(tile));

		// Floor on: left 3, right4
		// Floor off: left 8, right 9
		// Side on: left 13, right 14
		// Side off: left 18, right 19
		// Rope: 15

		const left = has(west, "Zipline");
		const right = has(east, "Zipline");
		const floor = has(south, "Wall", "Platform");
		const wall = has(west, "Wall", "Platform") || has(east, "Wall", "Platform");

		if (left && right) this.sprite.setFrame(15);
		else if (wall && right) this.sprite.setFrame(13);
		else if (wall && left) this.sprite.setFrame(14);
		else if (right) this.sprite.setFrame(3);
		else if (left) this.sprite.setFrame(4);

		this.sprite.setAlpha(this.isEnabled() ? 1 : 0.3);
	}

	destroy(): void {
		this.sprite.destroy();
	}
}
