import { GameScene } from "@/scenes/GameScene";
import { NeighborTiles, TileCoord } from "@/logic/Tile";
import { Entity } from "./Entity";

export class Gold extends Entity {
	constructor(scene: GameScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Gold";
		this.sprite.setTexture("gold");
	}

	updateSprite({}: NeighborTiles) {}
}
