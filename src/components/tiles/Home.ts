import { GameScene } from "@/scenes/GameScene";
import { SIZE, TileCoord } from "@/logic/Tile";
import { Entity } from "./Entity";

export class Home extends Entity {
	constructor(scene: GameScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Home";
		this.sprite.setTexture("home");
		this.sprite.setScale((2 * SIZE) / this.sprite.width);
		this.sprite.setOrigin(0.5, 0.75);
	}

	update(time: number, delta: number): void {
		const frames = [0, 1];
		this.sprite.setFrame(frames[Math.floor(time / 100) % frames.length]);
	}
}
