import { GameScene } from "@/scenes/GameScene";
import { SIZE, TileCoord } from "@/logic/Tile";
import { Entity } from "./Entity";

const sprites = ["home_01", "home_02"]

export class Home extends Entity {
	constructor(scene: GameScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Home";
		this.sprite.setTexture("home_01");
		this.sprite.setScale(2*SIZE / this.sprite.width);
		this.sprite.setOrigin(0.5, 0.75);
	}

	update(time: number, delta: number): void {
		this.sprite.setTexture(sprites[Math.floor(time / 100) % 2]);
	}
}
