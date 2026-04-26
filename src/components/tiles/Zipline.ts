import { BaseScene } from "@/scenes/BaseScene";
import { NeighborTiles, SIZE, Tile, TileCoord } from "@/logic/Tile";
import { Entity } from "./Entity";

export class Zipline extends Entity {
	constructor(scene: BaseScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Zipline";
		this.sprite.setTexture("entities", 8);
		this.sprite.setScale(SIZE / this.sprite.width);
	}

	updateSprite({ east, south, west }: NeighborTiles): void {
		const has = (tiles: Tile[], ...wanted: Tile[]) =>
			wanted.some((tile) => tiles.includes(tile));

		// Floor on: left 3, right4
		// Floor off: left 8, right 9
		// Side on: left 13, right 14
		// Side off: left 18, right 19
		// Rope: 15

		const left = has(west, "Zipline");
		const right = has(east, "Zipline");
		const floor = has(south, "Wall", "Platform");
		const wall = has(west, "Wall", "Platform") || has(east, "Wall", "Platform");

		// Normal sprite
		if (left && right) this.sprite.setFrame(15);
		else if (wall && right) this.sprite.setFrame(13);
		else if (wall && left) this.sprite.setFrame(14);
		else if (right) this.sprite.setFrame(3);
		else if (left) this.sprite.setFrame(4);
		this.sprite.setAlpha(1);
		this.sprite.setTint(0xffffff);

		// Preview sprite
		if (this.isPreview()) {
			this.sprite.setAlpha(0.5);
		}
		// Inactive sprite
		else if (!this.isEnabled()) {
			if (!left) {
				this.sprite.setFrame(wall ? 18 : 8);
			} else if (!right) {
				this.sprite.setFrame(wall ? 19 : 9);
			} else {
				this.sprite.setAlpha(0.1);
				this.sprite.setTint(0x000000);
			}
		}
	}

	onClick() {
		this.setEnabled(!this.isEnabled());
		this.emit("toggle");

		this.emit("sound", this.enabled ? "extend" : "vent", 0.5);
	}

	onBuild() {
		this.emit("sound", "extend", 0.5);
		this.emit("sound", "clank", 0.4);
	}

	destroy(): void {
		this.sprite.destroy();
	}
}
