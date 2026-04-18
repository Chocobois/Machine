import { GameScene } from "@/scenes/GameScene";
import { BaseTile, NeighborTypes, Type } from "./Tile";

export class Wall extends BaseTile {
	constructor(scene: GameScene, tx: number, ty: number) {
		super(scene, tx, ty);
		this.tile = Type.Wall;
		this.sprite.setTexture("wall", 0);
	}

	updateSprite({}: NeighborTypes): void {}
}
