import { BaseScene } from "@/scenes/BaseScene";
import { Tile, TileCoord } from "../components/tiles/Tile";
import { Rope } from "../components/Rope";
import { Level } from "./levels";

export const TILE_UPSCALE = 16;

export class TileManager extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	private map: Phaser.Tilemaps.Tilemap;
	private tiles: Tile[][];
	private entities: (Rope | undefined)[][];

	constructor(scene: BaseScene) {
		super(scene);
		this.scene = scene;
	}

	loadTilemap(tilemapKey: string) {
		/* Map */

		this.map = this.scene.make.tilemap({ key: tilemapKey });
		this.width = this.map.width;
		this.height = this.map.height;

		/* Tilesets */

		const tilesetWalls = this.map.addTilesetImage(
			"tileset_walls",
			"texture_walls",
		)!;
		const tilesetColliders = this.map.addTilesetImage(
			"tileset_colliders",
			"texture_colliders",
		)!;
		const tilesetDecor = this.map.addTilesetImage(
			"tileset_decoration",
			"texture_decoration",
		)!;

		/* Graphics */

		const layerDecor = this.map.createLayer("layer_decoration", tilesetDecor);
		const layerWalls = this.map.createLayer("layer_walls_visual", tilesetWalls);
		const layerLogic = this.map.createLayer("layer_logic", tilesetColliders);

		layerDecor?.setScale(TILE_UPSCALE);
		layerWalls?.setScale(TILE_UPSCALE);
		layerLogic?.setScale(TILE_UPSCALE);
		layerWalls?.setPosition((16 / 2) * TILE_UPSCALE);

		/* Physics */

		const layerDataWalls = this.map.getLayer("layer_walls_physics");
		const layerDataLogic = this.map.getLayer("layer_logic");
		if (!layerDataWalls) throw Error("Can't find layer 'layer_walls_physics'");
		if (!layerDataLogic) throw Error("Can't find layer 'layer_logic'");

		this.tiles = [];
		this.entities = [];

		for (let y = 0; y < this.height; y++) {
			this.tiles[y] = [];
			this.entities[y] = [];

			for (let x = 0; x < this.width; x++) {
				let result = Tile.None;

				const wallTile = layerDataWalls.data[y][x];
				if (wallTile && wallTile.index !== -1) {
					result = this.mapTileToEnum(wallTile);
				}

				const entityTile = layerDataLogic.data[y][x];
				if (entityTile && entityTile.index !== -1) {
					const mapped = this.mapTileToEnum(entityTile);
					if (mapped !== Tile.None) {
						result = mapped;
					}
				}

				this.tiles[y][x] = result;
			}
		}
	}

	private mapTileToEnum(tile: Phaser.Tilemaps.Tile): Tile {
		const tileProp = tile.properties.tile;

		if (!tileProp) return Tile.None;

		const type = Tile[tileProp as keyof typeof Tile];
		if (!type) console.warn("Unknown type", tileProp);
		return type ?? Tile.None;
	}

	public isInside({ tileX, tileY }: TileCoord): boolean {
		return (
			tileX >= 0 && tileY >= 0 && tileX < this.width && tileY < this.height
		);
	}

	public getTileAt({ tileX, tileY }: TileCoord): Tile {
		if (!this.isInside({ tileX, tileY })) return Tile.Wall;

		// Check if entity exists at this location first
		const entity = this.entities[tileY]?.[tileX];
		if (entity) {
			return entity.tile;
		}
		// Otherwise return the static tile type
		return this.tiles[tileY]?.[tileX] ?? Tile.None;
	}

	public sameTile(tile1: TileCoord, tile2: TileCoord): boolean {
		return tile1.tileX === tile2.tileX && tile1.tileY === tile2.tileY;
	}

	get widthInPixels(): number {
		return this.map.widthInPixels;
	}

	get heightInPixels(): number {
		return this.map.heightInPixels;
	}
}
