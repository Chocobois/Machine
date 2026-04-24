import { ItemButton } from "@/components/ui/ItemButton";
import { Inventory, InventoryItem } from "@/logic/Inventory";
import { BaseScene } from "@/scenes/BaseScene";

export const UI_HEIGHT = 140;
export const UI_SIZE = 120;

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

		const sceneEvents = this.scene.get("GameScene").events;
		sceneEvents.on("setInventory", this.onSetInventory, this);
		sceneEvents.on("updateInventory", this.onUpdateInventory, this);
	}

	update(time: number, delta: number) {
		this.itemButtons.forEach((itemButton) => itemButton.update(time, delta));
	}

	onSetInventory(inventory: Inventory) {
		this.itemButtons.forEach((itemButton) => itemButton.destroy());
		this.itemButtons = [];

		inventory.forEach((item: InventoryItem, index: number) => {
			let itemX = (-(inventory.length - 1) / 2) * UI_SIZE + index * UI_SIZE;

			const itemButton = new ItemButton(this, itemX, 0, UI_SIZE, item);
			itemButton.on("click", () => {
				this.events.emit("toggleItem", item, item);
			});

			this.itemButtons.push(itemButton);
			this.panel.add(itemButton);
		});
	}

	onUpdateInventory(inventory: Inventory) {
		inventory.forEach((item: InventoryItem, index: number) => {
			const itemButton = this.itemButtons[index];
			itemButton.selected = !!item.selected;
			itemButton.setAmount(item.amount);
		});
	}
}
