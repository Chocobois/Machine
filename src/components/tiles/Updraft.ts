import { GameScene } from "@/scenes/GameScene";
import { NeighborTiles, TileCoord } from "@/logic/Tile";
import { Entity } from "./Entity";

export class Updraft extends Entity {
	constructor(scene: GameScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Updraft";
		this.sprite.setTexture("updraft");
		this.sprite.setAlpha(0.5);
	}

	update(time: number, delta: number) {
		const frames = [0, 1, 2, 3];
		const index = Math.floor(time / 50) % frames.length;
		this.sprite.setFrame(frames[index]);
	}

	updateSprite({}: NeighborTiles) {}
}
