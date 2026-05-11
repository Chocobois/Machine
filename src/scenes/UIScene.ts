import { FadeConfig, Intermission } from "@/components/Intermission";
import { UILevelStatePanel } from "@/components/ui/UILevelStatePanel";
import { UIPanel, UI_HEIGHT } from "@/components/ui/UIPanel";
import { PLAY_SPEEDS, UISpeedPanel } from "@/components/ui/UISpeedPanel";
import { Inventory, InventoryItem } from "@/logic/Inventory";
import { Music } from "@/logic/Music";
import { BaseScene } from "@/scenes/BaseScene";

export class UIScene extends BaseScene {
	private uiPanel: UIPanel;
	private speedPanel: UISpeedPanel;
	private levelStatePanel: UILevelStatePanel;

	private intermission: Intermission;

	private music: Phaser.Sound.WebAudioSound;

	constructor() {
		super({ key: "UIScene" });
	}

	create(): void {
		this.uiPanel = new UIPanel(this, this.CX, this.H - UI_HEIGHT / 2);

		this.speedPanel = new UISpeedPanel(this, 128, 32);

		this.levelStatePanel = new UILevelStatePanel(this, this.W - 176, 32);

		this.intermission = new Intermission(this);
		this.intermission.setDepth(10000);

		this.setupListeners();

		if (!this.music) {
			this.music = new Music(this, "flykten", { volume: 0.5 });
			this.music.on("bar", (bar: number) => {
				this.events.emit("onMusicBar", bar);
			});
		}

		this.sound.setVolume(0.75);
	}

	update(time: number, delta: number) {
		this.uiPanel.update(time, delta);
		this.speedPanel.update(time, delta);
		this.levelStatePanel.update(time, delta);
		this.intermission.update(time, delta);
	}

	setupListeners() {
		const titleScene = this.scene.get("TitleScene");
		const overworldScene = this.scene.get("OverworldScene");
		const gameScene = this.scene.get("GameScene");
		const soundTestScene = this.scene.get("SoundTestScene");

		// Title events
		titleScene.events.on("fade", (config: FadeConfig) => {
			this.intermission.fade(config);
		});

		// Overworld events
		overworldScene.events.on("setSeek", (seek: number) => {
			this.music.setSeek(seek);
		});

		// Game events
		gameScene.events.on("setInventory", (inventory: Inventory) => {
			this.uiPanel.setInventory(inventory);
		});
		gameScene.events.on("updateInventory", (inventory: Inventory) => {
			this.uiPanel.updateInventory(inventory);
		});
		gameScene.events.on("setPlayerCount", (count: number) => {
			this.uiPanel.setLives(count);
		});
		gameScene.events.on("setTreasureCount", (count: number) => {
			this.uiPanel.setGold(count);
		});
		gameScene.events.on("fade", (config: FadeConfig) => {
			this.intermission.fade(config);
		});

		// UI interactions
		this.uiPanel.on("itemClicked", (item: InventoryItem) => {
			this.events.emit("toggleItem", item, item);
		});
		this.uiPanel.on("findGold", () => {
			this.events.emit("findGold");
		});
		this.levelStatePanel.on("retry", () => {
			this.events.emit("restartLevel");
		});
		this.levelStatePanel.on("wrapUp", () => {
			this.events.emit("wrapUp");
		});
		this.speedPanel.on("setPlaySpeed", (playSpeed: number) => {
			this.events.emit("setPlaySpeed", playSpeed);

			const rate = [0.5, 1, 1, 2][PLAY_SPEEDS.indexOf(playSpeed)];
			this.tweens.add({
				targets: this.music,
				rate,
				duration: 500,
			});
		});

		// Toggle UI visibility based on scene
		titleScene.events.on(Phaser.Scenes.Events.START, () =>
			this.setVisible(false),
		);
		overworldScene.events.on(Phaser.Scenes.Events.START, () => {
			this.setVisible(false);
			if (!this.music.isPlaying) {
				this.music.play();
			}
			this.speedPanel.resetSpeed();
		});
		gameScene.events.on(Phaser.Scenes.Events.START, () =>
			this.setVisible(true),
		);
		soundTestScene.events.on(Phaser.Scenes.Events.START, () =>
			this.setVisible(false),
		);

		// Global
		this.game.registry.set("allowAudio", true);
		this.game.events.on("blur", () => {
			this.game.registry.set("allowAudio", false);
		});
		this.game.events.on("focus", () => {
			this.game.registry.set("allowAudio", true);
		});
	}

	setVisible(state: boolean) {
		this.uiPanel.setVisible(state);
		this.speedPanel.setVisible(state);
		this.levelStatePanel.setVisible(state);
	}
}
