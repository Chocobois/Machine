import { BaseScene } from "@/scenes/BaseScene";
import { SIZE } from "@/logic/Tile";

const anim = [1, 2, 1, 3]
const sprites = [
	"kobots_orange",
	"kobots_red",
	"kobots_yellow",
	"kobots_green",
	"kobots_blue",
	"kobots_violet"
]

export class MainMenuKobot extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	private sprite: Phaser.GameObjects.Sprite;
	private facingRight: boolean = true;
	private heldSprite: Phaser.GameObjects.Sprite;

	public duration = 6000;
	private colorid = Math.floor(Math.random() * 4.999);

	constructor(scene: BaseScene) {
		super(scene, 0, scene.H - 140);
		scene.add.existing(this);
		this.scene = scene;
		this.colorid = 0;
		this.sprite = this.scene.add.sprite(0, 0, sprites[this.colorid], 0).setOrigin(0.5,1).setScale(2);
		this.x = -this.sprite.displayWidth;
		this.add(this.sprite);

		const treasureFrame = Phaser.Math.RND.pick([0, 1, 2, 3]);
		this.heldSprite = this.scene.add
			.sprite(0, -this.sprite.height * 2 + 7, "treasure", treasureFrame)
			.setOrigin(0.5, 1.0)
			.setVisible(false);
		this.heldSprite.setScale((4 * SIZE) / this.heldSprite.width);
		this.add(this.heldSprite);
	}

	update(time: number, delta: number) {
		const index = Math.floor(time / 200) % anim.length;
		this.sprite.setFrame(anim[index]);
		this.sprite.setFlipX(!this.facingRight);
		this.heldSprite.setOrigin(0.5, 1 + Math.sin((time / 400 * Math.PI) % Math.PI) * 0.1)
	}

	move() {
		this.scene.tweens.add({
			targets: this,
			duration: this.duration,
			x: { from: -this.sprite.displayWidth, to: this.scene.W},
			onComplete: () => {
				this.facingRight = false;
				this.heldSprite.setVisible(true);
			}
		});
		this.scene.tweens.add({
			targets: this,
			duration: this.duration,
			delay: this.duration,
			x: { from: this.scene.W, to: -this.sprite.displayWidth}
		});
	}
}
