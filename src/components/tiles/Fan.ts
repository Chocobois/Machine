import { BaseScene } from "@/scenes/BaseScene";
import { NeighborTiles, SIZE, TileCoord } from "@/logic/Tile";
import { Entity } from "./Entity";

export class Fan extends Entity {
	constructor(scene: BaseScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Fan";
		this.sprite.setTexture("entities", 10);
		this.sprite.setScale(SIZE / this.sprite.width);
		this.setDepth(1);
	}

	update(time: number, delta: number) {
		if (this.isEnabled()) {
			const frames = [0, 5];
			const index = Math.floor(time / 100) % frames.length;
			this.sprite.setFrame(frames[index]);
		} else {
			this.sprite.setFrame(10);
		}
	}

	updateSprite({}: NeighborTiles) {}

	onClick() {
		this.setEnabled(!this.isEnabled());
		this.emit("toggle");

		this.emit("sound", this.enabled ? "toggle1" : "toggle2", 0.5);
		this.emit("sound", this.enabled ? "fan_on" : "fan_off", 0.5);
	}

	onBuild() {
		this.emit("sound", "clank", 0.4);
		this.emit("sound", "fan_on", 0.5);
	}
}
