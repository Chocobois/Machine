import { BaseScene } from "@/scenes/BaseScene";
import { Music } from "@/logic/Music";

import { title, version } from "@/version.json";
import { MainMenuKobot } from "@/components/MainMenuKobot";

const creditsLeft = `Golen
Naika`;

const creditsRight = `code
art`;

const slideinduration = 2000;
const botspawninterval = 800;

enum MainMenuState {
  NotStarted,
  SlideIn,
  Idle,
  Starting
}

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
	public state: MainMenuState;

	public bots: MainMenuKobot[];
	private botspawntimer = botspawninterval;

	constructor() {
		super({ key: "TitleScene" });
	}

	create(): void {
		this.state = MainMenuState.NotStarted;
		this.fade(false, 200, 0x000000);

		this.sky = this.add.image(this.CX, this.CY, "title_sky");
		this.background = this.add.image(0, 0, "title_background").setOrigin(0);
		this.foreground = this.add.image(0, 0, "title_foreground").setOrigin(0).setDepth(10);
		this.logo = this.add.image(70, 100, "title_logo").setOrigin(0, 0.5);
		this.taptoplay = this.add.image(110, 350, "title_taptoplay").setOrigin(0);

		this.containToScreen(this.sky);
		this.containToScreen(this.background);
		this.containToScreen(this.foreground);
		this.background.y += 9000;
		this.foreground.y += 9000;
		this.logo.y += 9000;
		this.taptoplay.y += 9000;

		this.bots = [];

		this.tap = this.addText({
			x: this.CX,
			y: this.CY,
			size: 120,
			color: "#FFF",
			text: "Tap to focus",
		});
		this.tap.setOrigin(0.5);
		this.tap.setAlpha(1);
		this.tap.setStroke("#000", 16);
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
		this.version.setDepth(20);

		this.credits = this.add.container(0, 0);
		this.credits.setVisible(false);
		this.credits.setAlpha(0);
		this.credits.setDepth(20);

		let credits1 = this.addText({
			x: 60,
			y: this.H - 100,
			size: 40,
			color: "#c2185b",
			text: creditsLeft,
		});
		credits1.setStroke("#FFF", 6);
		credits1.setPadding(2);
		credits1.setLineSpacing(0);
		this.credits.add(credits1);

		let credits2 = this.addText({
			x: 200,
			y: this.H - 100,
			size: 40,
			color: "#c2185b",
			text: creditsRight,
		});
		credits2.setStroke("#FFF", 6);
		credits2.setPadding(2);
		credits2.setLineSpacing(0);
		this.credits.add(credits2);

		// Music
		if (!this.musicTitle) { this.musicTitle = new Music(this, "m_first", { volume: 0.4 }); }
		this.musicTitle.play();

		// Input
		this.input.keyboard
			?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
			.on("down", this.on_input, this);
		this.input.on(
			"pointerdown",
			(pointer: PointerEvent) => {
				if (pointer.button == 0) {
					this.on_input();
				}
			},
			this
		);

		this.isStarting = false;
	}

	set_state(_newstate: MainMenuState) {
		this.state = _newstate;
		switch(this.state) {
			case MainMenuState.SlideIn:
				//this.musicTitle.play();
				this.tap.setVisible(false);
				// Slide in Tweens
				this.tweens.add({
					targets: [this.background, this.foreground],
					y: {from: 1000, to: 0},
					duration: slideinduration,
					ease: Phaser.Math.Easing.Cubic.Out
				})
				this.tweens.add({
					targets: [this.logo],
					y: {from: 1170, to: 170},
					duration: slideinduration,
					delay: 400,
					ease: Phaser.Math.Easing.Cubic.Out
				})
				this.tweens.add({
					targets: [this.taptoplay],
					y: {from: 1350, to: 350},
					duration: slideinduration,
					delay: 400,
					ease: Phaser.Math.Easing.Cubic.Out
				})

				this.addEvent(slideinduration, () => {
						this.set_state(MainMenuState.Idle)
				})

				break;
			case MainMenuState.Idle:
				this.credits.setVisible(true);
				break;
			case MainMenuState.Starting:
				this.sound.play("t_rustle", { volume: 0.3 });
				this.isStarting = true;
				this.flash(3000, 0xffffff, 0.6);

				this.addEvent(1000, () => {
					this.fade(true, 1000, 0x000000);
					this.addEvent(1050, () => {
						this.musicTitle.stop();
						this.scene.start("OverworldScene");
					});
				});
				break;
		}
	}
	spawn_bot() {
		let bot = new MainMenuKobot(this);
		//bot.duration *= 1 + (Math.random() - 0.5 / 2);
		bot.move();
		this.addEvent(bot.duration * 2, () => {
			bot.destroy()
		});
		this.bots.push(bot);
	}
	update(time: number, delta: number) {
		if (this.state > 0) {
			this.logo.setOrigin(0, 0.5 + Math.sin((time / 2000) * Math.PI) * 0.05)
			this.taptoplay.visible = ((time - 2200) / 600) % 2 > 1 && this.state > 1

			this.background.alpha += 0.03 * (1 - this.background.alpha);

			this.version.alpha +=
				0.02 * ((this.version.visible ? 1 : 0) - this.version.alpha);

			if (this.credits.visible) {
				this.credits.alpha += 0.02 * (1 - this.credits.alpha);
			}
			
			if (this.state > 1){
				this.taptoplay.visible = ((time - 2200) / 600) % 2 > 1;

				if (this.botspawntimer > 0) { this.botspawntimer -= delta }
				else { 
					this.spawn_bot();
					this.botspawntimer = botspawninterval;
				}
			}
			
		} else {
			if (this.musicTitle.seek > 0) {
				this.set_state(MainMenuState.SlideIn)
				this.tap.setVisible(false);
			}
		}
		this.bots.forEach(bot => bot.update(time, delta));
	}

	on_input(){
		switch(this.state) {
			case MainMenuState.NotStarted:
				//this.set_state(MainMenuState.SlideIn)
				break;
			case MainMenuState.Idle:
				this.set_state(MainMenuState.Starting)
				break;
		}
	}
}
