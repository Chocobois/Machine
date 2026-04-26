import { ItemButton } from "@/components/ui/ItemButton";
import { Inventory, InventoryItem } from "@/logic/Inventory";
import { BaseScene } from "@/scenes/BaseScene";

export const UI_HEIGHT = 150;
export const UI_SIZE = 120;

export class UIScene extends BaseScene {
	private panel: Phaser.GameObjects.Container;
	private background: Phaser.GameObjects.Image;
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

		this.background = this.add
			.image(0, -this.panel.height / 2, "ui_bar")
			.setOrigin(0.5, 0);
		this.background.setScale(this.panel.width / this.background.width);
		this.textures.get("ui_bar").setFilter(Phaser.Textures.FilterMode.NEAREST);
		this.panel.add(this.background);

		/* Lives */

		const livesX = -this.panel.width / 2 + UI_SIZE;

		const livesIcon = this.add.image(livesX, 20, "ui_lives");
		this.textures.get("ui_lives").setFilter(Phaser.Textures.FilterMode.NEAREST);
		livesIcon.setScale((UI_SIZE / livesIcon.width) * 1.35);
		this.panel.add(livesIcon);

		this.livesText = this.addText({
			x: livesX + 0.6 * UI_SIZE,
			y: 0.5 * UI_SIZE,
			size: 40,
			color: "black",
			text: "x123",
		})
			.setOrigin(1)
			.setStroke("white", 10);
		this.panel.add(this.livesText);

		/* Gold */

		const goldX = this.panel.width / 2 - UI_SIZE + 20;

		const goldIcon = this.add.image(goldX, 5, "ui_gold");
		this.textures.get("ui_gold").setFilter(Phaser.Textures.FilterMode.NEAREST);
		goldIcon.setScale((UI_SIZE / goldIcon.width) * 0.9);
		this.panel.add(goldIcon);

		this.goldText = this.addText({
			x: goldX + 0.5 * UI_SIZE,
			y: 0.5 * UI_SIZE,
			size: 40,
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
		const spacing = UI_SIZE + 16;

		this.itemButtons.forEach((itemButton) => itemButton.destroy());
		this.itemButtons = [];

		inventory.forEach((item: InventoryItem, index: number) => {
			let itemX = (-(inventory.length - 1) / 2) * spacing + index * spacing;

			const itemButton = new ItemButton(this, itemX, 6, UI_SIZE, item);
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
