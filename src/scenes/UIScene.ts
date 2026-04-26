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

	private music: Phaser.Sound.WebAudioSound;

	constructor() {
		super({ key: "UIScene" });
	}

	create(): void {
		this.uiPanel = new UIPanel(this, this.CX, this.H - UI_HEIGHT / 2);

		this.speedPanel = new UISpeedPanel(this, 128, 32);

		this.levelStatePanel = new UILevelStatePanel(this, this.W - 176, 32);

		this.setupListeners();

		if (!this.music) {
			this.music = new Music(this, "flykten", { volume: 0.4*0 });
			this.music.on("bar", (bar: number) => {
				this.events.emit("onMusicBar", bar);
			});
		}
	}

	update(time: number, delta: number) {
		this.uiPanel.update(time, delta);
		this.speedPanel.update(time, delta);
		this.levelStatePanel.update(time, delta);
	}

	setupListeners() {
		const titleScene = this.scene.get("TitleScene");
		const overworldScene = this.scene.get("OverworldScene");
		const gameScene = this.scene.get("GameScene");

		// GameScene
		overworldScene.events.on("setSeek", (seek: number) => {
			this.music.setSeek(seek);
		});

		// GameScene
		gameScene.events.on("setInventory", (inventory: Inventory) => {
			this.uiPanel.setInventory(inventory);
		});
		gameScene.events.on("updateInventory", (inventory: Inventory) => {
			this.uiPanel.updateInventory(inventory);
		});

		// UI interactions
		this.uiPanel.on("itemClicked", (item: InventoryItem) => {
			this.events.emit("toggleItem", item, item);
		});
		this.levelStatePanel.on("retry", () => {
			this.events.emit("restartLevel");
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
	}

	setVisible(state: boolean) {
		this.uiPanel.setVisible(state);
		this.speedPanel.setVisible(state);
		this.levelStatePanel.setVisible(state);
	}
}
