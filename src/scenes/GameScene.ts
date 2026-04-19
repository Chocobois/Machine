import { Player } from "@/components/Player";
import { Gold } from "@/components/tiles/Gold";
import { Platform } from "@/components/tiles/Platform";
import { Rope } from "@/components/Rope";
import {
	BaseTile,
	SIZE,
	Type,
	tileToCoord,
	NeighborTiles,
	NeighborTypes,
	TileCoord,
} from "@/components/tiles/Tile";
import { Wall as Wall } from "@/components/tiles/Wall";
import { BaseScene } from "@/scenes/BaseScene";

export class GameScene extends BaseScene {
	private width: number;
	private height: number;
	private tiles: (Type | undefined)[][];
	private entities: (Rope | undefined)[][];
	private players: Player[] = [];
	private cursor: Phaser.GameObjects.Image;
	private pressedTile: { tileCoord: TileCoord; tileType: Type } | null = null;
	private previousTile: { tileCoord: TileCoord; tileType: Type } | null = null;

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x63ad9d);

		this.loadLevel("level1");

		this.centerCamera();

		for (let i = 0; i < 10; i++) {
			this.addEvent(400 * i, () => {
				this.addPlayer(4, 4);
			});
		}

		this.cursor = this.add.image(0, 0, "square", 0);
		this.cursor.setTint(0xffff00);
		this.cursor.setAlpha(0.25);
		this.cursor.setOrigin(0.5, 0.5);
		this.cursor.setDepth(100);

		// Mouse input handlers
		this.input.on("pointerdown", this.onPointerDown, this);
		this.input.on("pointerup", this.onPointerUp, this);
	}

	update(time: number, delta: number) {
		this.players.forEach((player) => {
			player.update(time, delta);
		});

		const mouseTile = this.mouseTileCoord;
		const { x: mx, y: my } = tileToCoord(mouseTile);
		this.cursor.setPosition(mx, my);

		// Update cursor color based on rope placement validity
		const canPlace = this.canPlaceRope(mouseTile);
		if (canPlace) {
			this.cursor.setTint(0x00ff00); // Green for valid
		} else {
			this.cursor.setTint(0xff0000); // Red for invalid
		}

		// Handle dragging to extend/remove rope
		if (this.pressedTile && this.input.activePointer.isDown) {
			// Check if we moved to a different tile
			const previousOrPressed =
				this.previousTile?.tileCoord || this.pressedTile.tileCoord;
			if (!this.sameTile(mouseTile, previousOrPressed)) {
				// Dragging down - expand rope
				if (
					this.previousTile &&
					this.isRopeAt(this.previousTile.tileCoord) &&
					mouseTile.tileY > this.previousTile.tileCoord.tileY &&
					mouseTile.tileX === this.pressedTile.tileCoord.tileX
				) {
					// if (this.canPlaceRope(mouseTile)) {
					this.createRope(mouseTile);
					// }
				}

				// Dragging up - remove rope
				if (
					this.isRopeAt(mouseTile) &&
					this.previousTile &&
					this.isRopeAt(this.previousTile.tileCoord) &&
					this.previousTile.tileCoord.tileY > mouseTile.tileY
				) {
					this.deleteRope(mouseTile);
				}

				this.previousTile = {
					tileCoord: mouseTile,
					tileType: this.getTileTypeAt(mouseTile),
				};
			}
		}
	}

	loadLevel(level: string) {
		const map = this.make.tilemap({ key: "level1" });
		const wallsTileset = map.addTilesetImage("castle_walls", "walls")!;
		const collidersTileset = map.addTilesetImage("colliders", "colliders")!;

		// Graphics
		const wallsDebugLayer = map.createLayer("entities", collidersTileset, 0, 0);
		wallsDebugLayer?.setScale(16);
		const wallsVisualLayer = map.createLayer(
			"walls_visual",
			wallsTileset,
			128,
			128,
		);
		wallsVisualLayer?.setScale(16);

		// Physics
		const wallsLayer = map.getLayer("walls_physics");
		const entitiesLayer = map.getLayer("entities");
		if (!wallsLayer || !entitiesLayer) return console.error("FAIL");

		this.width = map.width;
		this.height = map.height;
		this.tiles = [];
		this.entities = [];

		for (let y = 0; y < this.height; y++) {
			this.tiles[y] = [];
			this.entities[y] = [];

			for (let x = 0; x < this.width; x++) {
				let result = Type.None;

				const wallTile = wallsLayer.data[y][x];
				if (wallTile && wallTile.index !== -1) {
					result = this.mapTileToEnum(wallTile);
				}

				const entityTile = entitiesLayer.data[y][x];
				if (entityTile && entityTile.index !== -1) {
					const mapped = this.mapTileToEnum(entityTile);
					if (mapped !== Type.None) {
						result = mapped;
					}
				}

				this.tiles[y][x] = result;
			}
		}

		// this.tiles = [[]];
		// this.entities = [];
		// for (let tileY = 0; tileY < this.height; tileY++) {
		// 	this.tiles[tileY] = [];
		// 	this.entities[tileY] = [];
		// 	for (let tileX = 0; tileX < this.width; tileX++) {
		// 		const tile = level.tiles[tileY][tileX];
		// 		this.tiles[tileY][tileX] = this.createTile({ tileX, tileY }, tile);
		// 		this.entities[tileY][tileX] = undefined;
		// 	}
		// }

		// for (let tileY = 0; tileY < this.height; tileY++) {
		// 	for (let tileX = 0; tileX < this.width; tileX++) {
		// 		this.tiles[tileY][tileX]?.updateSprite(
		// 			this.getNeighborTypes({ tileX, tileY }),
		// 		);
		// 	}
		// }

		/* Tilemap */
		// const f = (x: number, y: number) =>
		// 	this.getTileTypeAt({ tileX: x - 1, tileY: y - 1 }) == Type.Wall;

		// for (let ty = 0; ty <= this.height; ty++) {
		// 	for (let tx = 0; tx <= this.width; tx++) {
		// 		const tl = f(tx - 0, ty - 0) ? 1 : 0;
		// 		const tr = f(tx + 1, ty - 0) ? 1 : 0;
		// 		const bl = f(tx - 0, ty + 1) ? 1 : 0;
		// 		const br = f(tx + 1, ty + 1) ? 1 : 0;

		// 		const mask = (tl << 0) | (tr << 1) | (bl << 2) | (br << 3);

		// 		const { x, y } = tileToCoord({ tileX: tx, tileY: ty });
		// 		const tile = this.add.image(x - SIZE / 2, y - SIZE / 2, "walls", 6);
		// 		tile.setScale(SIZE / tile.width);

		// 		let frame = [12, 15, 8, 9, 0, 11, 14, 7, 13, 4, 1, 10, 3, 2, 5, 6][
		// 			mask
		// 		];
		// 		tile.setFrame(frame);
		// 	}
		// }

		// this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

		// const cursors = this.input.keyboard.createCursorKeys();
		// const controlConfig = {
		// 	camera: this.cameras.main,
		// 	left: cursors.left,
		// 	right: cursors.right,
		// 	up: cursors.up,
		// 	down: cursors.down,
		// 	speed: 0.5,
		// };
		// this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

		// const help = this.add.text(16, 16, "Arrow keys to scroll", {
		// 	fontSize: "18px",
		// 	padding: { x: 10, y: 5 },
		// 	backgroundColor: "#000000",
		// 	fill: "#ffffff",
		// });
		// help.setScrollFactor(0);
	}

	mapTileToEnum(tile: Phaser.Tilemaps.Tile): Type {
		const tileProp = tile.properties.tile;

		if (!tileProp) return Type.None;

		const type = Type[tileProp as keyof typeof Type];
		if (!type) console.warn("Unknown type", tileProp);
		return type ?? Type.None;
	}

	// createTile({ tileX, tileY }: TileCoord, tile: Type): BaseTile | undefined {
	// 	switch (tile) {
	// 		case Type.Wall:
	// 			return new Wall(this, tileX, tileY);
	// 		case Type.Platform:
	// 			return new Platform(this, tileX, tileY);
	// 		case Type.Gold:
	// 			return new Gold(this, tileX, tileY);
	// 		case Type.Rope:
	// 			// Ropes are no longer created from levels
	// 			return undefined;
	// 	}
	// }

	getNeighborTiles({ tileX, tileY }: TileCoord): NeighborTypes {
		const getEntity = (x: number, y: number): Type => {
			const entity = this.entities[y]?.[x];
			if (entity) return entity.tile;
			return this.tiles[y]?.[x] ?? Type.None;
		};

		return {
			center: getEntity(tileX, tileY),
			up: getEntity(tileX, tileY - 1),
			down: getEntity(tileX, tileY + 1),
			left: getEntity(tileX - 1, tileY),
			right: getEntity(tileX + 1, tileY),
		};
	}

	getNeighborTypes({ tileX, tileY }: TileCoord): NeighborTypes {
		const getType = (x: number, y: number): Type => {
			const entity = this.entities[y]?.[x];
			if (entity) {
				return entity.tile;
			}
			return this.tiles[y]?.[x] ?? Type.None;
		};

		return {
			center: getType(tileX, tileY),
			up: getType(tileX, tileY - 1),
			down: getType(tileX, tileY + 1),
			left: getType(tileX - 1, tileY),
			right: getType(tileX + 1, tileY),
		};
	}

	centerCamera() {
		// Center camera on level
		this.cameras.main.centerOn(
			(this.width * SIZE) / 2,
			(this.height * SIZE) / 2,
		);

		// Zoom to fit the entire level
		const zoom = Math.min(
			this.W / (this.width * SIZE),
			this.H / (this.height * SIZE),
		);
		this.cameras.main.zoomTo(zoom, 0);
	}

	addPlayer(tileX: number, tileY: number) {
		const player = new Player(this);
		this.players.push(player);

		player.on("neighbors", () => {
			const neighbors = this.getNeighborTypes(player.tileCoord);
			player.updateAction(neighbors);
		});
		player.setTile({ tileX, tileY });
	}

	get mouseTileCoord(): TileCoord {
		const worldPoint = this.cameras.main.getWorldPoint(
			this.input.activePointer.x,
			this.input.activePointer.y,
		);
		return {
			tileX: Math.floor(worldPoint.x / SIZE),
			tileY: Math.floor(worldPoint.y / SIZE),
		};
	}

	private isRopeAt({ tileX, tileY }: TileCoord): boolean {
		return this.entities[tileY]?.[tileX] instanceof Rope;
	}

	private sameTile(tile1: TileCoord, tile2: TileCoord): boolean {
		return tile1.tileX === tile2.tileX && tile1.tileY === tile2.tileY;
	}

	private getTileTypeAt({ tileX, tileY }: TileCoord): Type {
		if (!this.isInside({ tileX, tileY })) return Type.Wall;

		// Check if entity exists at this location first
		const entity = this.entities[tileY]?.[tileX];
		if (entity) {
			return entity.tile;
		}
		// Otherwise return the static tile type
		return this.tiles[tileY]?.[tileX] ?? Type.None;
	}

	private isInside({ tileX, tileY }: TileCoord): boolean {
		return (
			tileX >= 0 && tileY >= 0 && tileX < this.width && tileY < this.height
		);
	}

	canPlaceRope({ tileX, tileY }: TileCoord): boolean {
		// Can't place rope where rope already exists
		if (this.isRopeAt({ tileX, tileY })) {
			return true;
		}

		const center = this.tiles[tileY]?.[tileX] ?? Type.None;
		const up = this.tiles[tileY - 1]?.[tileX] ?? Type.None;

		// Valid: Type.None with Type.Wall above
		if (center === Type.None && up === Type.Wall) {
			return true;
		}

		// Valid: Type.Platform (center is Platform)
		if (center === Type.Platform) {
			return true;
		}

		return false;
	}

	public getRopeNeighborTypes({ tileX, tileY }: TileCoord): NeighborTypes {
		const tileUp = this.tiles[tileY - 1]?.[tileX] ?? Type.None;
		const tileDown = this.tiles[tileY + 1]?.[tileX] ?? Type.None;
		const ropeUp = this.isRopeAt({ tileX, tileY: tileY - 1 })
			? Type.Rope
			: Type.None;
		const ropeDown = this.isRopeAt({ tileX, tileY: tileY + 1 })
			? Type.Rope
			: Type.None;

		return {
			center: Type.Rope,
			up: ropeUp !== Type.None ? ropeUp : tileUp,
			down: ropeDown !== Type.None ? ropeDown : tileDown,
			left: Type.None,
			right: Type.None,
		};
	}

	private onPointerDown(): void {
		const tileCoord = this.mouseTileCoord;
		const tileType = this.getTileTypeAt(tileCoord);

		if (this.canPlaceRope(tileCoord)) {
			this.pressedTile = { tileCoord, tileType };
			this.createRope(tileCoord);
			this.previousTile = { tileCoord, tileType };
		}
	}

	private onPointerUp(): void {
		if (this.pressedTile) {
			// Delete rope if: started on rope, didn't move
			if (
				this.pressedTile.tileType === Type.Rope &&
				this.previousTile === null
			) {
				this.deleteRopeRecursive(this.pressedTile.tileCoord);
			}
		}

		this.pressedTile = null;
		this.previousTile = null;
	}

	private createRope({ tileX, tileY }: TileCoord): void {
		if (!this.entities[tileY]?.[tileX]) {
			const rope = new Rope(this, tileX, tileY);
			this.entities[tileY][tileX] = rope;
			this.updateRopesSprites(tileX);
		}
	}

	private deleteRope({ tileX, tileY }: TileCoord): void {
		const entity = this.entities[tileY]?.[tileX];
		if (entity instanceof Rope) {
			entity.destroy();
			this.entities[tileY][tileX] = undefined;
			this.updateRopesSprites(tileX);
		}
	}

	private deleteRopeRecursive({ tileX, tileY }: TileCoord): void {
		if (!this.isRopeAt({ tileX, tileY })) {
			return;
		}

		this.deleteRope({ tileX, tileY });

		// Recursively delete connected ropes above and below
		this.deleteRopeRecursive({ tileX, tileY: tileY - 1 });
		this.deleteRopeRecursive({ tileX, tileY: tileY + 1 });
	}

	private updateRopesSprites(tileX: number): void {
		// Update all ropes in this column
		for (let tileY = 0; tileY < this.entities.length; tileY++) {
			const entity = this.entities[tileY]?.[tileX];
			if (entity instanceof Rope) {
				entity.updateSprite(this.getRopeNeighborTypes({ tileX, tileY }));
			}
		}
	}
}
