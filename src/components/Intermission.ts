import { BaseScene } from "@/scenes/BaseScene";
import { Color } from "@/util/colors";

export type FadeConfig = {
	x: number;
	y: number;
	radius?: number;
	duration?: number;
	black: boolean;
	delay?: number;
};

export class Intermission extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	private graphics: Phaser.GameObjects.Graphics;

	private rect: Phaser.GameObjects.Rectangle;
	private tiles: Phaser.GameObjects.TileSprite;

	constructor(scene: BaseScene) {
		super(scene);
		this.scene = scene;
		scene.add.existing(this);

		this.setVisible(false);
		// this.setAlpha(0);

		/* Masking */

		this.graphics = this.scene.make.graphics();
		this.graphics.fillStyle(Color.White);

		let mask = this.graphics.createGeometryMask();
		mask.setInvertAlpha(true);
		this.setMask(mask);

		// this.redrawMask(scene.CX, scene.CY, scene.W);

		/* Background */

		this.rect = scene.add.rectangle(
			scene.CX,
			scene.CY,
			scene.W,
			scene.H,
			Color.Zinc950,
		);
		// this.rect.setInteractive();
		this.add(this.rect);

		this.tiles = scene.add
			.tileSprite(0, 0, 1920 + 256, 1080 + 256, "out_of_bounds")
			.setOrigin(0)
			.setAlpha(0);
		this.add(this.tiles);

		/* Init */

		this.scene.addEvent(500, () => {
			this.emit("restartLevel");
		});
	}

	update(time: number, delta: number) {
		this.tiles.x = ((time / 50) % 256) - 256;
		this.tiles.y = ((time / 50) % 256) - 256;
	}

	fade(config: FadeConfig) {
		const duration = config.duration ?? 2000;
		const delay = config.delay ?? 0;

		const fullRadius = this.getMaxRadius(config.x, config.y);
		const smallRadius = config.radius;

		if (config.black) {
			this.setVisible(true);
		}

		/* Two step animation */
		if (smallRadius !== undefined) {
			const halfDuration = duration / 2;

			const step1 = config.black
				? { from: fullRadius, to: smallRadius }
				: { from: 0, to: smallRadius };

			const step2 = config.black
				? { from: smallRadius, to: 0 }
				: { from: smallRadius, to: fullRadius };

			// Step 1
			this.scene.tweens.addCounter({
				duration: halfDuration,
				from: step1.from,
				to: step1.to,
				ease: Phaser.Math.Easing.Quintic.InOut,

				onUpdate: (tween, target, key, current: number) => {
					this.redrawMask(config.x, config.y, current);
				},
			});

			// Step 2
			this.scene.tweens.addCounter({
				delay: halfDuration + delay,
				duration: halfDuration,
				from: step2.from,
				to: step2.to,
				ease: Phaser.Math.Easing.Cubic.InOut,

				onUpdate: (tween, target, key, current: number) => {
					this.redrawMask(config.x, config.y, current);
				},

				onComplete: () => {
					if (!config.black) {
						this.setVisible(false);
					}
				},
			});

			return;
		}

		/* Single step animation */

		const from = config.black ? fullRadius : 0;
		const to = config.black ? 0 : fullRadius;

		if (config.black) {
			this.redrawMask(config.x, config.y, fullRadius);
		}

		this.scene.tweens.addCounter({
			duration,
			from,
			to,
			ease: Phaser.Math.Easing.Quintic.InOut,

			onUpdate: (tween, target, key, current: number) => {
				this.redrawMask(config.x, config.y, current);
			},

			onComplete: () => {
				if (!config.black) {
					this.setVisible(false);
				}
			},
		});
	}

	redrawMask(x: number, y: number, radius: number) {
		this.graphics.clear();
		this.graphics.fillCircle(x, y, radius);
	}

	getMaxRadius(x: number, y: number) {
		const corners = [
			{ x: 0, y: 0 },
			{ x: this.scene.W, y: 0 },
			{ x: 0, y: this.scene.H },
			{ x: this.scene.W, y: this.scene.H },
		];

		let maxDistance = 0;

		for (const corner of corners) {
			const distance = Phaser.Math.Distance.Between(x, y, corner.x, corner.y);

			maxDistance = Math.max(maxDistance, distance);
		}

		return maxDistance + 50;
	}
}
