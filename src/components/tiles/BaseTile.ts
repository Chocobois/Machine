import { BaseScene } from "@/scenes/BaseScene";
import { NeighborTypes, Tile, TileCoord, tileToCoord } from "./Tile";

export abstract class BaseTile extends Phaser.GameObjects.Container {
	public scene: BaseScene;
	public tile: Tile = Tile.None;
	public tileX: number = 0;
	public tileY: number = 0;

	protected sprite: Phaser.GameObjects.Sprite;

	constructor(scene: BaseScene, tileX: number, tileY: number) {
		const { x, y } = tileToCoord({ tileX, tileY });
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.tileX = tileX;
		this.tileY = tileY;

		this.sprite = this.scene.add.sprite(0, 0, "blank", 0);
		this.add(this.sprite);
	}

	update(time: number, delta: number) {}

	abstract updateSprite(neighbors: NeighborTypes): void;

	get tileCoord(): TileCoord {
		return { tileX: this.tileX, tileY: this.tileY };
	}
}
