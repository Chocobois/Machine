import { BaseScene } from "@/scenes/BaseScene";
import { Music } from "@/logic/Music";

import { title, version } from "@/version.json";
import { MainMenuKobot } from "@/components/MainMenuKobot";

const creditsLeft = `${title} 

@Handle
@Handle
@Handle`;

const creditsRight = `

role
role
role`;

export class TitleScene extends BaseScene {
	public sky: Phaser.GameObjects.Image;
	public background: Phaser.GameObjects.Image;
	public foreground: Phaser.GameObjects.Image;
	public logo: Phaser.GameObjects.Image;
	public taptoplay: Phaser.GameObjects.Image;

	public credits: Phaser.GameObjects.Container;
	public tap: Phaser.GameObjects.Text;
	public version: Phaser.GameObjects.Text;

	public musicTitle: Phaser.Sound.WebAudioSound;
	public select: Phaser.Sound.WebAudioSound;
	public select2: Phaser.Sound.WebAudioSound;

	public isStarting: boolean;

	public bots: MainMenuKobot[];

	constructor() {
		super({ key: "TitleScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		this.sky = this.add.image(this.CX, this.CY, "title_sky");
		this.background = this.add.image(0, 0, "title_background").setOrigin(0);
		this.foreground = this.add.image(0, 0, "title_foreground").setOrigin(0).setDepth(10);
		this.logo = this.add.image(70, 100, "title_logo").setOrigin(0, 0.5);
		this.taptoplay = this.add.image(110, 350, "title_taptoplay").setOrigin(0);

		this.containToScreen(this.sky);
		this.containToScreen(this.background);
		this.containToScreen(this.foreground);
		this.logo.y += 9000
		this.taptoplay.y += 9000

		this.background.setVisible(false);
		this.background.setAlpha(0);

		this.bots = [];
		for(let i = 0; i < 10; i++)
		{
			this.addEvent(2000 + 1000 * i, () => {
				let bot = new MainMenuKobot(this)
				bot.move();
				this.bots.push(bot);
			})
		}

		this.tweens.add({
			targets: [this.background, this.foreground],
			y: {from: 1000, to: 0},
			duration: 2000,
			ease: Phaser.Math.Easing.Cubic.Out
		})
		this.tweens.add({
			targets: [this.logo],
			y: {from: 1170, to: 170},
			duration: 2000,
			delay: 400,
			ease: Phaser.Math.Easing.Cubic.Out
		})
		this.tweens.add({
			targets: [this.taptoplay],
			y: {from: 1350, to: 350},
			duration: 2000,
			delay: 400,
			ease: Phaser.Math.Easing.Cubic.Out
		})

		this.tap = this.addText({
			x: this.CX,
			y: this.CY,
			size: 140,
			color: "#000",
			text: "Tap to focus",
		});
		this.tap.setOrigin(0.5);
		this.tap.setAlpha(-1);
		this.tap.setStroke("#FFF", 4);
		this.tap.setPadding(2);

		this.version = this.addText({
			x: this.W,
			y: this.H,
			size: 40,
			color: "#000",
			text: version,
		});
		this.version.setOrigin(1, 1);
		this.version.setAlpha(-1);
		this.version.setStroke("#FFF", 4);
		this.version.setPadding(2);

		this.credits = this.add.container(0, 0);
		this.credits.setVisible(false);
		this.credits.setAlpha(0);

		let credits1 = this.addText({
			x: 0.65 * this.W,
			y: 0,
			size: 40,
			color: "#c2185b",
			text: creditsLeft,
		});
		credits1.setStroke("#FFF", 10);
		credits1.setPadding(2);
		credits1.setLineSpacing(0);
		this.credits.add(credits1);

		let credits2 = this.addText({
			x: 0.85 * this.W,
			y: 0,
			size: 40,
			color: "#c2185b",
			text: creditsRight,
		});
		credits2.setStroke("#FFF", 10);
		credits2.setPadding(2);
		credits2.setLineSpacing(0);
		this.credits.add(credits2);

		// Music
		if (!this.musicTitle) {
			this.musicTitle = new Music(this, "m_first", { volume: 0.4 });
			this.musicTitle.on("bar", this.onBar, this);
			this.musicTitle.on("beat", this.onBeat, this);

			// this.select = this.sound.add("dayShift", { volume: 0.8, rate: 1.0 }) as Phaser.Sound.WebAudioSound;
			// this.select2 = this.sound.add("nightShift", { volume: 0.8, rate: 1.0 }) as Phaser.Sound.WebAudioSound;
		}
		this.musicTitle.play();

		// Input

		this.input.keyboard
			?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
			.on("down", this.progress, this);
		this.input.on(
			"pointerdown",
			(pointer: PointerEvent) => {
				if (pointer.button == 0) {
					this.progress();
				}
			},
			this
		);
		this.isStarting = false;
	}

	update(time: number, delta: number) {
		if (this.background.visible) {
			this.logo.setOrigin(0, 0.5 + Math.sin((time / 2000) * Math.PI) * 0.05)
			this.taptoplay.visible = ((time - 2200) / 600) % 2 > 1 && time > 2200

			this.background.alpha += 0.03 * (1 - this.background.alpha);

			this.version.alpha +=
				0.02 * ((this.version.visible ? 1 : 0) - this.version.alpha);

			if (this.credits.visible) {
				this.credits.alpha += 0.02 * (1 - this.credits.alpha);
			}
		} else {
			this.tap.alpha += 0.01 * (1 - this.tap.alpha);

			if (this.musicTitle.seek > 0) {
				this.background.setVisible(true);
				this.tap.setVisible(false);
			}
		}
		this.bots.forEach(bot => bot.update(time, delta));
	}

	progress() {
		if (!this.background.visible) {
			this.onBar(1);
		} else if (!this.isStarting) {
			this.sound.play("t_rustle", { volume: 0.3 });
			// this.sound.play("m_slice", { volume: 0.3 });
			// this.sound.play("u_attack_button", { volume: 0.5 });
			// this.select2.play();
			this.isStarting = true;
			this.flash(3000, 0xffffff, 0.6);

			this.addEvent(1000, () => {
				this.fade(true, 1000, 0x000000);
				this.addEvent(1050, () => {
					this.musicTitle.stop();
					this.scene.start("GameScene");
				});
			});
		}
	}

	onBar(bar: number) {
		if (bar >= 4) {
			this.credits.setVisible(true);
		}
	}

	onBeat(time: number) {
		// this.select.play();
	}
}
