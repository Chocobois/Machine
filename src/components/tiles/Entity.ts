import { BaseScene } from "@/scenes/BaseScene";
import { NeighborTiles, SIZE, Tile, TileCoord } from "@/logic/Tile";

export abstract class Entity extends Phaser.GameObjects.Container {
	public scene: BaseScene;
	public tile: Tile = "None";
	public tileCoord: TileCoord;

	protected sprite: Phaser.GameObjects.Sprite;

	constructor(scene: BaseScene, tileCoord: TileCoord) {
		const { x, y } = TileCoord.tileToCoord(tileCoord);
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.tileCoord = tileCoord;

		this.sprite = this.scene.add.sprite(0, 0, "blank", 0);
		this.sprite.setScale(SIZE / this.sprite.width);
		this.add(this.sprite);
	}

	update(time: number, delta: number) {}

	updateSprite(neighbors: NeighborTiles) {}
}
