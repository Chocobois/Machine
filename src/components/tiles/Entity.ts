import { BaseScene } from "@/scenes/BaseScene";
import { NeighborTiles, SIZE, Tile, TileCoord } from "@/logic/Tile";
import { Button } from "../ui/Button";
import { GameScene } from "@/scenes/GameScene";

export abstract class Entity extends Button {
	public scene: BaseScene;
	public tile: Tile = "None";
	public tileCoord: TileCoord;

	public parent?: Entity;
	public children: Entity[] = [];
	public enabled = true;
	public preview = false;

	protected hitarea: Phaser.GameObjects.Image;
	protected sprite: Phaser.GameObjects.Sprite;

	constructor(scene: BaseScene, tileCoord: TileCoord) {
		const { x, y } = TileCoord.tileToCoord(tileCoord);
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.tileCoord = tileCoord;

		this.hitarea = this.scene.add.image(0, 0, "blank");
		this.hitarea.setScale(SIZE / this.hitarea.width);
		this.add(this.hitarea);

		this.sprite = this.scene.add.sprite(0, 0, "blank", 0);
		this.sprite.setScale(SIZE / this.sprite.width);
		this.add(this.sprite);

		this.bindInteractive(this.hitarea);
		this.on("click", this.onClick, this);
	}

	update(time: number, delta: number) {}

	updateSprite(neighbors: NeighborTiles) {}

	/* Toggle logic */

	setPreview(state: boolean) {
		this.preview = state;
	}

	isPreview() {
		return this.preview;
	}

	setEnabled(state: boolean) {
		if (this.parent) {
			this.parent.setEnabled(state);
			return;
		}

		this.enabled = state;

		// Include parent + children
		const all = [this, ...this.children];

		all.forEach((entity) => {
			entity.enabled = state;

			entity.updateSprite(
				(this.scene as GameScene).getNeighborTiles(entity.tileCoord, !state),
			);
		});
	}

	isEnabled(): boolean {
		return this.parent ? this.parent.isEnabled() : this.enabled;
	}

	onClick() {}
}
