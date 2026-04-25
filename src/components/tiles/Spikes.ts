import { GameScene } from "@/scenes/GameScene";
import { NeighborTiles, SIZE, TileCoord } from "@/logic/Tile";
import { Entity } from "./Entity";

export class Spikes extends Entity {
	constructor(scene: GameScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Death";
		this.sprite.setTexture("environment", 7);
		this.sprite.setScale(SIZE / this.sprite.width);
	}

	updateSprite({}: NeighborTiles) {}
}
