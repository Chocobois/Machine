import { BaseScene } from "@/scenes/BaseScene";
import { NeighborTiles, SIZE, Tile, TileCoord } from "@/logic/Tile";
import { Entity } from "./Entity";

export class Rope extends Entity {
	constructor(scene: BaseScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Climb";
		this.sprite.setTexture("entities", 2);
		this.sprite.setScale(SIZE / this.sprite.width);
	}

	updateSprite({ north, south }: NeighborTiles): void {
		const has = (tiles: Tile[], ...wanted: Tile[]) =>
			wanted.some((tile) => tiles.includes(tile));

		// Normal sprite
		const up = has(north, "Climb");
		const down = has(south, "Climb");
		const index = up && down ? 12 : up ? 17 : down ? 7 : 2;
		this.sprite.setFrame(index);
		this.sprite.setAlpha(1);
		this.sprite.setTint(0xffffff);

		// Preview sprite
		if (this.isPreview()) {
			this.sprite.setAlpha(0.5);
		}
		// Inactive sprite
		else if (!this.isEnabled()) {
			if (!up) {
				this.sprite.setFrame(2);
			} else {
				this.sprite.setAlpha(0.1);
				this.sprite.setTint(0x000000);
			}
		}
	}

	onClick() {
		this.setEnabled(!this.isEnabled());
		this.emit("toggle");

		this.emit("sound", this.enabled ? "retract" : "reel", 0.5);
	}

	onBuild() {
		this.emit("sound", "reel", 0.5);
		this.emit("sound", "clank", 0.4);
	}

	destroy(): void {
		this.sprite.destroy();
	}
}
