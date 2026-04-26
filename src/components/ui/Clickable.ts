import { BaseScene } from "@/scenes/BaseScene";
import { Button } from "@/components/ui/Button";

export class Clickable extends Button {
	public image: Phaser.GameObjects.Image;
	private clickScaling: number;
	private updateCallback?: (time: number, delta: number) => void;
	private clickCallback?: () => void;

	constructor(
		scene: BaseScene,
		x: number,
		y: number,
		texture: string,
		scale: number,
		clickScaling: number = 0.1,
	) {
		super(scene, x, y);
		this.clickScaling = clickScaling;

		this.image = scene.add.image(0, 0, texture).setScale(scale);
		this.add(this.image);

		this.bindInteractive(this.image);
		scene.input.enable(this.image);
		this.on("click", () => {
			if (this.clickCallback) this.clickCallback();
		});
	}

	update(time: number, delta: number) {
		this.setScale(
			1.0 + this.clickScaling * this.holdSmooth,
			1.0 - this.clickScaling * this.holdSmooth,
		);

		if (this.updateCallback) {
			this.updateCallback(time, delta);
		}
	}

	setUpdate(updateCallback: (time: number, delta: number) => void) {
		this.updateCallback = updateCallback;
	}

	setClick(clickCallback: () => void) {
		this.clickCallback = clickCallback;
	}
}
