import { GameScene } from "@/scenes/GameScene";
import { NeighborTypes, SIZE, TileCoord, Type } from "@/components/tiles/Tile";

export class Rope {
	public sprite: Phaser.GameObjects.Sprite;
	public tileX: number;
	public tileY: number;
	public tile: Type = Type.Rope;
	private scene: GameScene;

	constructor(scene: GameScene, tileX: number, tileY: number) {
		this.scene = scene;
		this.tileX = tileX;
		this.tileY = tileY;

		const x = tileX * SIZE + SIZE / 2;
		const y = tileY * SIZE + SIZE / 2;

		this.sprite = scene.add.sprite(x, y, "rope", 0);
	}

	get tileCoord(): TileCoord {
		return { tileX: this.tileX, tileY: this.tileY };
	}

	updateSprite({ center, up, down }: NeighborTypes): void {
		const index =
			3 *
				(up == Type.Wall || center == Type.Platform
					? 0
					: up == Type.Rope
						? 1
						: 2) +
			(down == Type.Wall || down == Type.Platform ? 0 : down == Type.Rope ? 1 : 2);
		this.sprite.setFrame(index);
	}

	destroy(): void {
		this.sprite.destroy();
	}
}
