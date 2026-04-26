import { ItemButton } from "@/components/ui/ItemButton";
import { Inventory, InventoryItem } from "@/logic/Inventory";
import { BaseScene } from "@/scenes/BaseScene";

export const UI_HEIGHT = 150;
export const UI_SIZE = 120;

export class Panel extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	private background: Phaser.GameObjects.Image;
	private livesText: Phaser.GameObjects.Text;
	private goldText: Phaser.GameObjects.Text;

	private itemButtons: ItemButton[] = [];

	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;
		this.scene.add.existing(this);

		this.setSize(scene.W, UI_HEIGHT);

		this.createBackground();
		this.createLives();
		this.createGold();
	}

	/* Background */

	private createBackground() {
		this.background = this.scene.add
			.image(0, -this.height / 2, "ui_bar")
			.setOrigin(0.5, 0);

		this.background.setScale(this.width / this.background.width);
		this.scene.textures
			.get("ui_bar")
			.setFilter(Phaser.Textures.FilterMode.NEAREST);

		this.add(this.background);
	}

	/* Lives */

	private createLives() {
		const livesX = -this.width / 2 + UI_SIZE;

		const livesIcon = this.scene.add.image(livesX, 20, "ui_lives");
		this.scene.textures
			.get("ui_lives")
			.setFilter(Phaser.Textures.FilterMode.NEAREST);

		livesIcon.setScale((UI_SIZE / livesIcon.width) * 1.35);
		this.add(livesIcon);

		this.livesText = this.scene
			.addText({
				x: livesX + 0.6 * UI_SIZE,
				y: 0.5 * UI_SIZE,
				text: "x0",
				size: 40,
				color: "black",
			})
			.setStroke("white", 10)
			.setOrigin(1);

		this.add(this.livesText);
	}

	setLives(value: number) {
		this.livesText.setText(`x${value}`);
	}

	/* Gold */

	private createGold() {
		const goldX = this.width / 2 - UI_SIZE + 20;

		const goldIcon = this.scene.add.image(goldX, 5, "ui_gold");
		this.scene.textures
			.get("ui_gold")
			.setFilter(Phaser.Textures.FilterMode.NEAREST);

		goldIcon.setScale((UI_SIZE / goldIcon.width) * 0.9);
		this.add(goldIcon);

		this.goldText = this.scene
			.addText({
				x: goldX + 0.5 * UI_SIZE,
				y: 0.5 * UI_SIZE,
				text: "$0",
				size: 40,
				color: "black",
			})
			.setStroke("white", 10)
			.setOrigin(1);

		this.add(this.goldText);
	}

	setGold(value: number) {
		this.goldText.setText(`$${value}`);
	}

	/* Inventory */

	setInventory(inventory: Inventory) {
		const spacing = UI_SIZE + 16;

		this.itemButtons.forEach((b) => b.destroy());
		this.itemButtons = [];

		inventory.forEach((item: InventoryItem, index: number) => {
			const itemX = (-(inventory.length - 1) / 2) * spacing + index * spacing;

			const btn = new ItemButton(this.scene, itemX, 6, UI_SIZE, item);

			btn.on("click", () => {
				this.emit("itemClicked", item);
			});

			this.itemButtons.push(btn);
			this.add(btn);
		});
	}

	updateInventory(inventory: Inventory) {
		inventory.forEach((item, index) => {
			const btn = this.itemButtons[index];
			if (!btn) return;

			btn.selected = !!item.selected;
			btn.setAmount(item.amount);
		});
	}

	update(time: number, delta: number) {
		this.itemButtons.forEach((b) => b.update(time, delta));
	}
}
