import { GameScene } from "@/scenes/GameScene";
import { SIZE, TileCoord } from "@/logic/Tile";
import { Entity } from "./Entity";

export class Gold extends Entity {
	constructor(scene: GameScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Gold";
		this.sprite.setTexture("environment", 8);
		this.sprite.setScale(SIZE / this.sprite.width);
	}
}
