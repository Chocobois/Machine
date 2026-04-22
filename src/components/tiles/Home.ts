import { GameScene } from "@/scenes/GameScene";
import { TileCoord } from "@/logic/Tile";
import { Entity } from "./Entity";

export class Home extends Entity {
	constructor(scene: GameScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Home";
		this.sprite.setTexture("square").setTint(0);
	}
}
