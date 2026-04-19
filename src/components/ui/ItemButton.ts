import { BaseScene } from "@/scenes/BaseScene";
import { Button } from "./Button";
import { InventoryItem } from "@/logic/Inventory";

export class ItemButton extends Button {
	public scene: BaseScene;

	private background: Phaser.GameObjects.Image;
	private itemIcon: Phaser.GameObjects.Image;
	private countText: Phaser.GameObjects.Text;

	constructor(
		scene: BaseScene,
		x: number,
		y: number,
		size: number,
		item: InventoryItem,
	) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		this.background = this.scene.add.image(0, 0, "item_box");
		this.background.setScale(size / this.background.width);
		this.add(this.background);

		this.itemIcon = this.scene.add.image(0, 0, item.item.image);
		this.itemIcon.setScale(size / this.itemIcon.width);
		this.add(this.itemIcon);

		this.countText = this.scene
			.addText({
				x: 0.45 * size,
				y: 0.45 * size,
				size: 40,
				text: `x${item.amount}`,
				color: "black",
			})
			.setOrigin(1)
			.setStroke("white", 10);
		this.add(this.countText);

		// Input

		this.bindInteractive(this.background);
	}

	update(time: number, delta: number) {
        this.setScale(1.0 - 0.1 * this.holdSmooth);
		this.background.setTint(this.hold ? 0xffcc00 : 0xffffff);
	}

	setHighlight() {
		this.background.setTint(0xff0000);
	}

	/* Input */

	onOut(pointer: Phaser.Input.Pointer, event: Phaser.Types.Input.EventData) {
		super.onOut(pointer, event);
	}

	onOver(
		pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData,
	) {
		super.onOver(pointer, localX, localY, event);
	}

	onDown(
		pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData,
	) {
		super.onDown(pointer, localX, localY, event);
	}

	onUp(
		pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData,
	) {
		super.onUp(pointer, localX, localY, event);
	}
}
