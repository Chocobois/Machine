import { GameScene } from "@/scenes/GameScene";
import { TileCoord } from "@/logic/Tile";
import { Entity } from "./Entity";

export class Gold extends Entity {
	constructor(scene: GameScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Gold";
		this.sprite.setTexture("gold");
	}
}
