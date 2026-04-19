import { GameScene } from "@/scenes/GameScene";
import { NeighborTypes, Tile } from "./Tile";
import { BaseTile } from "./BaseTile";

export class Gold extends BaseTile {
	constructor(scene: GameScene, tileX: number, tileY: number) {
		super(scene, tileX, tileY);
		this.tile = Tile.Gold;
		this.sprite.setTexture("gold", 0);
	}

	updateSprite({ left }: NeighborTypes) {
		if (left == Tile.Gold) {
			this.sprite.setFrame(1);
		} else {
			this.sprite.setFrame(0);
		}
	}
}
