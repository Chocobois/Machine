import { ItemButton } from "@/components/ui/ItemButton";
import { Inventory, InventoryItem } from "@/logic/Inventory";
import { BaseScene } from "@/scenes/BaseScene";

export const UI_HEIGHT = 170;
export const UI_SIZE = 150;

export class UIScene extends BaseScene {
	private panel: Phaser.GameObjects.Container;
	private background: Phaser.GameObjects.Rectangle;
	private livesText: Phaser.GameObjects.Text;
	private goldText: Phaser.GameObjects.Text;

	private itemButtons: ItemButton[] = [];

	constructor() {
		super({ key: "UIScene" });
	}

	create(): void {
		/* Panel */

		this.panel = this.add.container(this.CX, this.H - UI_HEIGHT / 2);
		this.panel.width = this.W;
		this.panel.height = UI_HEIGHT;

		this.background = this.add.rectangle(
			0,
			0,
			this.panel.width,
			this.panel.height,
			0xffffff,
		);
		this.panel.add(this.background);

		/* Lives */

		const livesX = -this.panel.width / 2 + UI_SIZE;

		const livesIcon = this.add.image(livesX, 0, "ui_lives");
		livesIcon.setScale(UI_SIZE / livesIcon.width);
		this.panel.add(livesIcon);

		this.livesText = this.addText({
			x: livesX + 0.5 * UI_SIZE,
			y: 0.5 * UI_SIZE,
			size: 60,
			color: "black",
			text: "x123",
		})
			.setOrigin(1)
			.setStroke("white", 10);
		this.panel.add(this.livesText);

		/* Gold */

		const goldX = this.panel.width / 2 - UI_SIZE;

		const goldIcon = this.add.image(goldX, 0, "ui_gold");
		goldIcon.setScale(UI_SIZE / goldIcon.width);
		this.panel.add(goldIcon);

		this.goldText = this.addText({
			x: goldX + 0.5 * UI_SIZE,
			y: 0.5 * UI_SIZE,
			size: 60,
			color: "black",
			text: "$456",
		})
			.setOrigin(1)
			.setStroke("white", 10);
		this.panel.add(this.goldText);

		/* Items */

		this.itemButtons = [];

		/* Listeners */

		console.log("UIScene.listeners");
		this.scene
			.get("GameScene")
			.events.on("setInventory", (inventory: Inventory) => {
				this.setInventory(inventory);
			});
	}

	update(time: number, delta: number) {
		this.itemButtons.forEach((itemButton) => itemButton.update(time, delta));
	}

	setInventory(inventory: Inventory) {
		console.log("UIScene.setInventory");

		const gap = 0;
		let itemX = (-(inventory.length - 1) / 2) * UI_SIZE;

		inventory.forEach((item: InventoryItem) => {
			const itemButton = new ItemButton(this, itemX, 0, UI_SIZE, item);
			itemButton.on("click", () => {
				this.events.emit("itemSelect", item);
			});

			this.itemButtons.push(itemButton);
			this.panel.add(itemButton);
			itemX += UI_SIZE;
		});
	}
}
