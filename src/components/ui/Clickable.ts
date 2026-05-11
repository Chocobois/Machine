import { BaseScene } from "@/scenes/BaseScene";
import { Button } from "@/components/ui/Button";

export class Clickable extends Button {
	public image: Phaser.GameObjects.Image;
	protected clickScaling: number;
	protected oppositeAxis: boolean;
	protected updateCallback?: (time: number, delta: number) => void;
	protected clickCallback?: () => void;

	constructor(
		scene: BaseScene,
		x: number,
		y: number,
		texture: string,
		scale: number,
		clickScaling: number = 0.1,
		oppositeAxis: boolean = false,
		clickOnHold: boolean = false,
	) {
		super(scene, x, y, clickOnHold);
		this.clickScaling = clickScaling;
		this.oppositeAxis = oppositeAxis;

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
			1.0 - this.clickScaling * this.holdSmooth * (this.oppositeAxis ? -1 : 1),
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
