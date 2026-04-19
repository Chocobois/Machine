import { BaseScene } from "@/scenes/BaseScene";

export class Button extends Phaser.GameObjects.Container {
	public scene: BaseScene;
	// private hover: boolean;
	private _hold: boolean;
	protected blocked: boolean;
	public liftSmooth: number;
	public holdSmooth: number;
	public category: number;
	public aliveValue: number;
	private tween: Phaser.Tweens.Tween;
	private clickOnHold: boolean;

	constructor(scene: BaseScene, x: number, y: number, clickOnHold = true) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);

		// this.hover = false;
		this._hold = false;
		this.blocked = false;
		this.clickOnHold = clickOnHold;

		this.liftSmooth = 0;
		this.holdSmooth = 0;
		this.aliveValue = 0;
	}

	bindInteractive(
		gameObject: Phaser.GameObjects.Image,
		draggable = false,
		useCircle = false,
		padding = 0
	) {
		const config: Phaser.Types.Input.InputConfiguration = {
			useHandCursor: true,
			draggable: draggable,
		};

		if (useCircle) {
			config.hitArea = new Phaser.Geom.Circle(
				gameObject.width / 2,
				gameObject.height / 2,
				gameObject.width / 2 + padding
			);
			config.hitAreaCallback = Phaser.Geom.Circle.Contains;
		} else {
			config.hitArea = new Phaser.Geom.Rectangle(
				0,
				0,
				gameObject.width + padding,
				gameObject.height + padding
			);
			config.hitAreaCallback = Phaser.Geom.Rectangle.Contains;
		}

		if (!this.getAll().includes(gameObject)) {
			this.add(gameObject);
		}
		gameObject.removeInteractive();
		gameObject
			.setInteractive(config)
			.on("pointerout", this.onOut, this)
			.on("pointerover", this.onOver, this)
			.on("pointerdown", this.onDown, this)
			.on("pointerup", this.onUp, this)
			.on("dragstart", this.onDragStart, this)
			.on("drag", this.onDrag, this)
			.on("dragend", this.onDragEnd, this)
			.on("dragleave", this.onOut, this);
		return this;
	}

	public get hold(): boolean {
		return this._hold;
	}

	set hold(value: boolean) {
		if (value != this._hold) {
			if (this.tween) {
				this.tween.stop();
			}
			if (value) {
				this.tween = this.scene.tweens.add({
					targets: this,
					holdSmooth: { from: 0.0, to: 1.0 },
					ease: "Cubic.Out",
					duration: 100,
				});
			} else {
				this.tween = this.scene.tweens.add({
					targets: this,
					holdSmooth: { from: 1.0, to: 0.0 },
					ease: (v: number) => {
						return Phaser.Math.Easing.Elastic.Out(v, 1.5, 0.5);
					},
					duration: 500,
				});
			}
		}

		this._hold = value;
	}

	onOut(pointer: Phaser.Input.Pointer, event: Phaser.Types.Input.EventData) {
		// this.hover = false;
		this.hold = false;
	}

	onOver(
		pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData
	) {
		// this.hover = true;
	}

	onDown(
		pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData
	) {
		this.hold = true;
		this.blocked = false;

		if (this.clickOnHold) {
			this.emit("click");
		}
	}

	onUp(
		pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData
	) {
		if (this.hold && !this.blocked) {
			this.hold = false;

			if (!this.clickOnHold) {
				this.emit("click");
			}
		}
	}

	onDragStart(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {}

	onDrag(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {}

	onDragEnd(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {}

	isInsidePlayingField(): boolean {
		return false;
	}

	block() {
		this.blocked = true;
	}
}
