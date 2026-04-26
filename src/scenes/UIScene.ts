import { UIPanel, UI_HEIGHT } from "@/components/ui/UIPanel";
import { UISpeedPanel } from "@/components/ui/UISpeedPanel";
import { Inventory, InventoryItem } from "@/logic/Inventory";
import { BaseScene } from "@/scenes/BaseScene";

export class UIScene extends BaseScene {
	private uiPanel: UIPanel;
	private speedPanel: UISpeedPanel;

	constructor() {
		super({ key: "UIScene" });
	}

	create(): void {
		this.uiPanel = new UIPanel(this, this.CX, this.H - UI_HEIGHT / 2);

		this.speedPanel = new UISpeedPanel(this, 128, 32);

		this.setupListeners();
	}

	update(time: number, delta: number) {
		this.uiPanel.update(time, delta);
		this.speedPanel.update(time, delta);
	}

	setupListeners() {
		const gameScene = this.scene.get("GameScene");
		const overworldScene = this.scene.get("OverworldScene");
		const titleScene = this.scene.get("TitleScene");

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
		this.speedPanel.on("setPlaySpeed", (playSpeed: number) => {
			this.events.emit("setPlaySpeed", playSpeed);
		});

		// Toggle UI visibility based on scene
		titleScene.events.on(Phaser.Scenes.Events.START, () =>
			this.setVisible(false),
		);
		overworldScene.events.on(Phaser.Scenes.Events.START, () =>
			this.setVisible(false),
		);
		gameScene.events.on(Phaser.Scenes.Events.START, () =>
			this.setVisible(true),
		);
	}

	setVisible(state: boolean) {
		this.uiPanel.setVisible(state);
		this.speedPanel.setVisible(state);
	}
}
