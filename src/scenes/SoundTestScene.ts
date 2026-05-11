import { music } from "@/assets/music";
import { Sound, SoundKey, sounds } from "@/assets/sounds";
import { Clickable } from "@/components/ui/Clickable";
import { Slider } from "@/components/ui/Slider";
import { Music } from "@/logic/Music";
import { BaseScene } from "@/scenes/BaseScene";

export class SoundTestScene extends BaseScene {
	private music: Phaser.Sound.WebAudioSound;
	private soundButtons: SoundButton[];
	private audioSlider: Slider;

	constructor() {
		super({ key: "SoundTestScene" });
	}

	create(): void {
		this.cameras.main.setBackgroundColor(0x111111);

		// this.music = new Music(this, "flykten", { volume: 1.0 });
		// this.music.play();

		this.soundButtons = [];
		Object.keys(sounds).forEach((key, index) => {
			const x = this.CX + 200 * ((index % 6) - 2.5);
			const y = 100 + 60 * Math.floor(index / 6);
			const button = new SoundButton(this, x, y, key as SoundKey);
			this.soundButtons.push(button);
		});

		this.audioSlider = new Slider(this, this.CX, 35, 300, 30, 10);
		this.audioSlider.on("onChange", (value: number) => {
			this.sound.setVolume(value);
		});
		this.audioSlider.value = 0.75;
	}

	update(time: number, delta: number) {
		this.soundButtons.forEach((button) => button.update(time, delta));
		this.audioSlider.update(time, delta);
	}
}

class SoundButton extends Clickable {
	private activeSoundsCount: number = 0;

	constructor(scene: BaseScene, x: number, y: number, key: SoundKey) {
		super(scene, x, y, "ui_wrapup", 3.5, 0.05, false, true);

		const text = this.scene
			.addText({
				y: -4,
				text: key,
				size: 24,
				color: "white",
			})
			.setStroke("black", 6)
			.setOrigin(0.5);
		this.add(text);

		const sound = sounds[key] as Sound;
		if (Array.isArray(sound.key)) {
			this.add(
				this.scene
					.addText({
						x: (48 * 3.5) / 2 - 4,
						y: (16 * 3.5) / 2 - 4,
						text: `${sound.key.length}`,
						size: 24,
						color: "#ffff00",
					})
					.setStroke("black", 6)
					.setOrigin(1),
			);
		}
		if (sound.volume !== undefined) {
			this.add(
				this.scene
					.addText({
						x: -(48 * 3.5) / 2 + 4,
						y: -(16 * 3.5) / 2,
						text: `${sound.volume}`,
						size: 24,
						color: "#00ff00",
					})
					.setStroke("black", 6)
					.setOrigin(0),
			);
		}
		if (sound.rate !== undefined) {
			this.add(
				this.scene
					.addText({
						x: -(48 * 3.5) / 2 + 4,
						y: (16 * 3.5) / 2 - 4,
						text: `${sound.rate}`,
						size: 24,
						color: "#7777ff",
					})
					.setStroke("black", 6)
					.setOrigin(0, 1),
			);
		}

		this.on("click", () => {
			this.play(key);
		});
	}

	private play(key: SoundKey) {
		const instance = this.scene.playSound(key)!;

		// Increment the count and update UI
		this.activeSoundsCount++;
		this.updateVisualState();

		// Use a one-time listener to decrement the count
		const decrement = () => {
			this.activeSoundsCount--;
			this.updateVisualState();
		};

		instance.once("complete", decrement);
		instance.once("stop", decrement);
	}

	private updateVisualState() {
		if (this.activeSoundsCount > 0) {
			this.image.setTint(0xffff00);
		} else {
			// Safety: Ensure we never go below zero
			this.activeSoundsCount = Math.max(0, this.activeSoundsCount);
			this.image.clearTint();
		}
	}

	update(time: number, delta: number) {
		// Highlighting logic now relies on the count
		const held = this.activeSoundsCount > 0 ? 1 : 0;

		this.setScale(
			1.0 - this.clickScaling * held,
			1.0 - this.clickScaling * held * (this.oppositeAxis ? -1 : 1),
		);
	}
}
