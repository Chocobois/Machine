import { BaseScene } from "@/scenes/BaseScene";

const PANEL_WIDTH = 256;
const PANEL_HEIGHT = 64;
const BUTTON_SIZE = 64;

export const PLAY_SPEEDS = [0.2, 1, 3, 12];

export class UISpeedPanel extends Phaser.GameObjects.Container {
	public scene: BaseScene;
	private buttons: SpeedButton[] = [];
	private currentSpeed: number = 1;

	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);

		this.setSize(PANEL_WIDTH, PANEL_HEIGHT);

		this.createButtons();
		this.refreshFrames();
	}

	update(time: number, delta: number) {
		this.buttons.forEach((button) => button.update(time, delta));
	}

	createButtons() {
		const spacing = BUTTON_SIZE;

		for (let index = 0; index < 4; index++) {
			const x = -this.width / 2 + BUTTON_SIZE / 2 + index * spacing;

			const btn = new SpeedButton(this.scene, x, 0, index, PLAY_SPEEDS[index]);
			btn.on("setPlaySpeed", (playSpeed: number) => {
				this.setPlaySpeed(playSpeed);
			});

			this.buttons.push(btn);
			this.add(btn);
		}
	}

	setPlaySpeed(playSpeed: number) {
		this.currentSpeed = playSpeed;
		this.refreshFrames();

		this.emit("setPlaySpeed", this.currentSpeed);
	}

	getSpeed() {
		return this.currentSpeed;
	}

	refreshFrames() {
		this.buttons.forEach((btn, index) => {
			btn.setSelected(PLAY_SPEEDS[index] === this.currentSpeed);
		});
	}

	resetSpeed() {
		this.setPlaySpeed(1);
	}
}

import { Button } from "./Button";

class SpeedButton extends Button {
	public scene: BaseScene;
	public selected = false;

	private sprite: Phaser.GameObjects.Sprite;

	private index: number;

	constructor(
		scene: BaseScene,
		x: number,
		y: number,
		index: number,
		playSpeed: number,
	) {
		super(scene, x, y);
		this.scene = scene;
		this.index = index;
		scene.add.existing(this);

		this.sprite = this.scene.add
			.sprite(0, 0, "speedbuttons", 0)
			.setDisplaySize(BUTTON_SIZE, BUTTON_SIZE);
		this.add(this.sprite);

		this.refreshFrame();

		this.bindInteractive(this.sprite);
		this.on("click", () => {
			this.emit("setPlaySpeed", playSpeed);
		});
	}

	setSelected(state: boolean) {
		this.selected = state;
		this.refreshFrame();
	}

	refreshFrame() {
		const frame = this.index + (this.selected ? 4 : 0);
		this.sprite.setFrame(frame);
	}

	update(time: number, delta: number) {
		this.setScale(1.0 - 0.1 * this.holdSmooth);
	}
}
