import { GameScene } from "@/scenes/GameScene";
import { NeighborTiles, TileCoord } from "@/logic/Tile";
import { Entity } from "./Entity";

export class Spikes extends Entity {
	constructor(scene: GameScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Death";
		this.sprite.setTexture("spikes");
	}

	updateSprite({}: NeighborTiles) {}
}
