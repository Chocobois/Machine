import { GameScene } from "@/scenes/GameScene";
import { BaseTile, NeighborTypes, Type } from "./Tile";

export class Gold extends BaseTile {
	constructor(scene: GameScene, tileX: number, tileY: number) {
		super(scene, tileX, tileY);
		this.tile = Type.Gold;
		this.sprite.setTexture("gold", 0);
	}

	updateSprite({ left }: NeighborTypes) {
		if (left == Type.Gold) {
			this.sprite.setFrame(1);
		} else {
			this.sprite.setFrame(0);
		}
	}
}
