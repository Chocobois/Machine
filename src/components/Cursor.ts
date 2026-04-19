import { BaseScene } from "@/scenes/BaseScene";

export class Cursor extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	private square: Phaser.GameObjects.Image;
	private icon: Phaser.GameObjects.Image;

	constructor(scene: BaseScene) {
		super(scene, 0, 0);
		this.scene = scene;
		scene.add.existing(this);

		this.square = scene.add
			.image(0, 0, "square", 0)
			.setTint(0xffff00)
			.setAlpha(0.25);
		this.add(this.square);

		this.icon = scene.add
			.image(0, 0, "item_rope", 0)
			.setTint(0x000000)
			.setAlpha(0.25);
		this.add(this.icon);
	}

	setIcon(key: string) {
		this.icon.setTexture(key);
	}
}
