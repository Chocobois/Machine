import { ItemButton } from "@/components/ui/ItemButton";
import { Panel, UI_HEIGHT } from "@/components/ui/Panel";
import { Inventory, InventoryItem } from "@/logic/Inventory";
import { BaseScene } from "@/scenes/BaseScene";

export class UIScene extends BaseScene {
	private panel: Panel;

	constructor() {
		super({ key: "UIScene" });
	}

	create(): void {
		this.panel = new Panel(this, this.CX, this.H - UI_HEIGHT / 2);

		this.setupListeners();
	}

	update(time: number, delta: number) {
		this.panel.update(time, delta);
	}

	setupListeners() {
		// GameScene
		const gameScene = this.scene.get("GameScene");
		gameScene.events.on("setInventory", (inventory: Inventory) => {
			this.panel.setInventory(inventory);
		});
		gameScene.events.on("updateInventory", (inventory: Inventory) => {
			this.panel.updateInventory(inventory);
		});

		// OverworldScene
		const overworldScene = this.scene.get("OverworldScene");
		overworldScene.events.on("setVisible", (state: boolean) => {
			this.panel.setVisible(state);
		});

		// UI interactions
		this.panel.on("itemClicked", (item: InventoryItem) => {
			this.events.emit("toggleItem", item, item);
		});
	}
}
