import { GameScene } from "@/scenes/GameScene";
import { NeighborTiles, TileCoord } from "@/logic/Tile";
import { Entity } from "./Entity";

export class Stairs extends Entity {
	constructor(scene: GameScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Stairs";
		this.sprite.setTexture("stairs");
	}

	updateSprite({}: NeighborTiles) {}
}
