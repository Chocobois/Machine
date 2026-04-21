import { GameScene } from "@/scenes/GameScene";
import { NeighborTiles, TileCoord } from "@/logic/Tile";
import { Entity } from "./tiles/Entity";

export class Rope extends Entity {
	constructor(scene: GameScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Climb";
		this.sprite.setTexture("rope");
	}

	updateSprite({ center, up, down }: NeighborTiles): void {
		const index =
			3 * (up == "Wall" || center == "Platform" ? 0 : up == "Climb" ? 1 : 2) +
			(down == "Wall" || down == "Platform" ? 0 : down == "Climb" ? 1 : 2);
		this.sprite.setFrame(index);
	}

	destroy(): void {
		this.sprite.destroy();
	}
}
