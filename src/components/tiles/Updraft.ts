import { GameScene } from "@/scenes/GameScene";
import { NeighborTiles, SIZE, TileCoord } from "@/logic/Tile";
import { Entity } from "./Entity";

export class Updraft extends Entity {
	constructor(scene: GameScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Updraft";
		this.sprite.setTexture("entities", 1);
		this.sprite.setScale(SIZE / this.sprite.width);
		// this.sprite.setAlpha(0.5);
	}

	update(time: number, delta: number) {
		this.sprite.setAlpha(this.isEnabled() ? 1 : 0.3);

		if (this.isEnabled()) {
			const frames = [1, 6, 11, 16];
			const index = Math.floor(time / 100) % frames.length;
			this.sprite.setFrame(frames[index]);
		} else {
			this.sprite.setFrame(11);
		}
	}

	updateSprite({}: NeighborTiles) {}
}
