import { BaseScene } from "@/scenes/BaseScene";
import { SIZE, Tile, TileCoord } from "./Tile";
import { LevelKey } from "./levels";

export const TILE_UPSCALE = SIZE / 16;

export class TileManager extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	private map: Phaser.Tilemaps.Tilemap;
	private tiles: Tile[][];

	constructor(scene: BaseScene) {
		super(scene);
		this.scene = scene;
	}

	loadTilemap(tilemapKey: LevelKey): Tile[][] {
		/* Map */

		this.map = this.scene.make.tilemap({ key: tilemapKey });
		this.width = this.map.width;
		this.height = this.map.height;

		/* Tilesets */

		const tilesetWalls = this.map.addTilesetImage(
			"tileset_walls",
			"texture_walls",
		);
		const tilesetColliders = this.map.addTilesetImage(
			"tileset_colliders",
			"texture_colliders",
		);
		const tilesetDecor = this.map.addTilesetImage(
			"tileset_decoration",
			"texture_decoration",
		);
		if (!tilesetWalls) throw Error("Tileset 'tileset_walls' not found");
		if (!tilesetColliders) throw Error("Tileset 'tileset_colliders' not found");
		if (!tilesetDecor) throw Error("Tileset 'tileset_decoration' not found");

		/* Graphics */

		const layerDecor = this.map.createLayer("layer_decoration", tilesetDecor);
		const layerWalls = this.map.createLayer("layer_walls_visual", tilesetWalls);
		const layerLogic = this.map.createLayer("layer_logic", tilesetColliders);
		if (!layerDecor) throw Error("Layer 'layer_decoration' not found");
		if (!layerWalls) throw Error("Layer 'layer_walls_visual' not found");
		if (!layerLogic) throw Error("Layer 'layer_logic' not found");

		layerDecor.setScale(TILE_UPSCALE);
		layerWalls.setScale(TILE_UPSCALE);
		layerLogic.setScale(TILE_UPSCALE).setAlpha(0);
		layerWalls.setPosition((16 / 2) * TILE_UPSCALE);

		/* Physics */

		const layerDataWalls = this.map.getLayer("layer_walls_physics");
		const layerDataLogic = this.map.getLayer("layer_logic");
		if (!layerDataWalls) throw Error("Can't find layer 'layer_walls_physics'");
		if (!layerDataLogic) throw Error("Can't find layer 'layer_logic'");

		this.tiles = [];
		const entityTiles: Tile[][] = [];

		for (let y = 0; y < this.height; y++) {
			this.tiles[y] = [];
			entityTiles[y] = [];

			for (let x = 0; x < this.width; x++) {
				const wallTile = layerDataWalls.data[y][x];
				if (wallTile && wallTile.index !== -1) {
					this.tiles[y][x] = this.mapTileToEnum(wallTile);
				}

				const entityTile = layerDataLogic.data[y][x];
				if (entityTile && entityTile.index !== -1) {
					entityTiles[y][x] = this.mapTileToEnum(entityTile);
				}
			}
		}

		return entityTiles;
	}

	private mapTileToEnum(tile: Phaser.Tilemaps.Tile): Tile {
		switch (tile.properties.tile) {
			// Walls
			case "Wall":
				return Tile.Wall;
			case "Platform":
				return Tile.Platform;

			// Entities
			case "Home":
				return Tile.Home;
			case "Gold":
				return Tile.Gold;
			case "Climb":
				return Tile.Climb;
			case "Death":
				return Tile.Death;

			default:
				console.warn(`Unknown tile property: ${tile.properties.tile}`);
				return Tile.None;
		}
	}

	public isInside({ x, y }: TileCoord): boolean {
		return x >= 0 && y >= 0 && x < this.width && y < this.height;
	}

	public getTileAt(tileCoord: TileCoord): Tile {
		if (!this.isInside(tileCoord)) return "Wall";

		// Otherwise return the static tile type
		return this.tiles[tileCoord.y]?.[tileCoord.x] ?? "None";
	}

	// public getEntityAt(tileCoord: TileCoord): Entity | undefined {
	// 	return this.entities.find((entity) => entity.tileCoord == tileCoord);
	// }

	get widthInPixels(): number {
		return this.map.widthInPixels;
	}

	get heightInPixels(): number {
		return this.map.heightInPixels;
	}
}
