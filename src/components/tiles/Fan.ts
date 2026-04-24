import { GameScene } from "@/scenes/GameScene";
import { NeighborTiles, TileCoord } from "@/logic/Tile";
import { Entity } from "./Entity";
import { Updraft } from "./Updraft";

export class Fan extends Entity {
	constructor(scene: GameScene, tileCoord: TileCoord) {
		super(scene, tileCoord);
		this.tile = "Fan";
		this.sprite.setTexture("fan");
		this.setDepth(1);
	}

	updateSprite({}: NeighborTiles) {}

	createUpdrafts(scene: GameScene) {
		this.addUpdraftsRecursive(scene, this.tileCoord, 5);
	}

	private addUpdraftsRecursive(
		scene: GameScene,
		tileCoord: TileCoord,
		remainingTiles: number,
	) {
		if (remainingTiles <= 0) return;

		// Check if the tile above has a wall
		const tilesAtAbove = scene.getTileAt(tileCoord);

		// If wall is blocking, stop
		if (tilesAtAbove.includes("Wall")) return;

		// Create updraft at this tile
		const updraft = new Updraft(scene, tileCoord);
		(scene as any).entities.push(updraft);
		scene.refreshEntitySprites(tileCoord);

		// Recurse upward
		this.addUpdraftsRecursive(
			scene,
			{ x: tileCoord.x, y: tileCoord.y - 1 },
			remainingTiles - 1,
		);
	}
}
