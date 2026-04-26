import { GameScene } from "@/scenes/GameScene";
import { SIZE, TileCoord } from "@/logic/Tile";
import { Entity } from "./Entity";

export class Chest extends Entity {
	private treasureCount: number = 3;

	constructor(scene: GameScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Gold";
		this.sprite.setTexture("chest", 0); // Closed chest
		this.sprite.setScale(SIZE / this.sprite.width);
		this.sprite.setOrigin(0.5, 0.75);
	}

	takeTreasure() {
		this.sprite.setFrame(1); // Open chest
		this.treasureCount -= 1;

		if (this.treasureCount <= 0) {
			this.sprite.setFrame(2); // Empty chest
			this.setEnabled(false);
		}

		if (this.treasureCount == 2) {
			this.emit("sound", "chest", 0.4);
		}
		this.emit("sound", "gold_pouch", 0.5);
	}
}
