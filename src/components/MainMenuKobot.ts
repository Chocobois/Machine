import { BaseScene } from "@/scenes/BaseScene";
import {
	NeighborTypes,
	SIZE,
	Tile,
	TileCoord,
	tileToCoord,
} from "./tiles/Tile";

const anim = [1, 2, 1, 3]
const duration = 5000

export class MainMenuKobot extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	private sprite: Phaser.GameObjects.Sprite;
	private facingRight: boolean = true;

	constructor(scene: BaseScene) {
		super(scene, 0, scene.H - 140);
		scene.add.existing(this);
		this.scene = scene;

		this.sprite = this.scene.add.sprite(0, 0, "mainmenukobot", 0).setOrigin(0,1).setScale(2);
		this.add(this.sprite);
	}

	update(time: number, delta: number) {
		const index = Math.floor(time / 200) % anim.length;
		this.sprite.setFrame(anim[index]);
		this.sprite.setFlipX(!this.facingRight);
	}

	move() {
		this.scene.tweens.add({
			targets: this,
			duration: duration,
			x: { from: -this.sprite.displayWidth, to: this.scene.W},
			onComplete: () => {
				this.facingRight = false
			}
		});
		this.scene.tweens.add({
			targets: this,
			duration: duration,
			delay: duration,
			x: { from: this.scene.W, to: -this.sprite.displayWidth}
		});

	}
}
