import { BaseScene } from "@/scenes/BaseScene";
import { Clickable } from "./Clickable";

const PANEL_WIDTH = 256;
const PANEL_HEIGHT = 64;

export class UILevelStatePanel extends Phaser.GameObjects.Container {
	public scene: BaseScene;
	private buttons: Clickable[] = [];

	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);

		this.setSize(PANEL_WIDTH, PANEL_HEIGHT);

		this.createWrapUp();
	}

	update(time: number, delta: number) {
		this.buttons.forEach((button) => button.update(time, delta));
	}

	private createWrapUp() {
		const wrapupPanel = new Clickable(
			this.scene,
			0,
			5,
			"ui_wrapup",
			(PANEL_HEIGHT / 16),
			0.1,
		);
		this.add(wrapupPanel);
		this.buttons.push(wrapupPanel)

		let wrapupText = this.scene
			.addText({
				x: wrapupPanel.width,
				y: wrapupPanel.height,
				text: "WRAP UP",
				size: 32,
				color: "#eee",
			})
			.setStroke("black", 6)
			.setOrigin(0.5);

		wrapupPanel.add(wrapupText);

		const retryButton = new Clickable(
			this.scene,
			PANEL_WIDTH / 2 + 10,
			5,
			"ui_retry",
			(PANEL_HEIGHT / 16),
			0.1,
		);
		this.add(retryButton);
		this.buttons.push(retryButton);

		wrapupPanel.on("click", () => {
			this.emit("wrapup");
		})

		retryButton.on("click", () => {
			this.emit("retry");
		})
	}
}

import { Button } from "./Button";