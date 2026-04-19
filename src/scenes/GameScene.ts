import { Player } from "@/components/Player";
import { Rope } from "@/components/Rope";
import { TILE_UPSCALE, TileManager } from "@/logic/TileManager";
import {
	SIZE,
	Tile,
	tileToCoord,
	NeighborTypes,
	TileCoord,
} from "@/components/tiles/Tile";
import { BaseScene } from "@/scenes/BaseScene";
import { Inventory, InventoryItem, items } from "@/logic/Inventory";
import { Level, levels } from "@/logic/levels";
import { UI_HEIGHT } from "./UIScene";

enum InputMode {
	Cutscene, // No input allowed
	Camera, // Allow camera dragdrop interactions
	Build, // Allow building interactions
}

export class GameScene extends BaseScene {
	private tileManager: TileManager;

	private players: Player[] = [];
	private pressedTile: { tileCoord: TileCoord; tileType: Tile } | null = null;
	private previousTile: { tileCoord: TileCoord; tileType: Tile } | null = null;

	// Input
	private inputMode: InputMode;
	private isDraggingCamera = false;
	private lastPointerPosition = new Phaser.Math.Vector2();
	private cursor: Phaser.GameObjects.Image;

	private inventory: InventoryItem[] = [];

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x63ad9d);

		this.tileManager = new TileManager(this);
		this.loadLevel(levels.level1);

		for (let i = 0; i < 10; i++) {
			this.addEvent(400 * i, () => {
				this.addPlayer(4, 4);
			});
		}

		/* Input handling */

		this.setupListeners();
		this.setupInput();
		this.setupCamera();
		this.setInputMode(InputMode.Camera);
	}

	loadLevel(level: Level) {
		this.tileManager.loadTilemap(level.tilemapKey);

		// Copy inventory to avoid mutation
		this.inventory = level.inventory.map((item) => ({
			item: item.item,
			amount: item.amount,
		}));

		console.log("GameScene.emit");
		this.events.emit("setInventory", this.inventory);
	}

	update(time: number, delta: number) {
		this.players.forEach((player) => {
			player.update(time, delta);
		});

		const mouseTile = this.mouseTileCoord;
		const { x: mx, y: my } = tileToCoord(mouseTile);
		this.cursor.setPosition(mx, my);

		// Update cursor color based on rope placement validity
		// const canPlace = this.canPlaceRope(mouseTile);
		// if (canPlace) {
		// 	this.cursor.setTint(0x00ff00); // Green for valid
		// } else {
		// 	this.cursor.setTint(0xff0000); // Red for invalid
		// }

		// Handle dragging to extend/remove rope
		if (this.pressedTile && this.input.activePointer.isDown) {
			// Check if we moved to a different tile
			const previousOrPressed =
				this.previousTile?.tileCoord || this.pressedTile.tileCoord;
			// if (!this.sameTile(mouseTile, previousOrPressed)) {
			// 	// Dragging down - expand rope
			// 	if (
			// 		this.previousTile &&
			// 		this.isRopeAt(this.previousTile.tileCoord) &&
			// 		mouseTile.tileY > this.previousTile.tileCoord.tileY &&
			// 		mouseTile.tileX === this.pressedTile.tileCoord.tileX
			// 	) {
			// 		// if (this.canPlaceRope(mouseTile)) {
			// 		this.createRope(mouseTile);
			// 		// }
			// 	}

			// 	// Dragging up - remove rope
			// 	if (
			// 		this.isRopeAt(mouseTile) &&
			// 		this.previousTile &&
			// 		this.isRopeAt(this.previousTile.tileCoord) &&
			// 		this.previousTile.tileCoord.tileY > mouseTile.tileY
			// 	) {
			// 		this.deleteRope(mouseTile);
			// 	}

			// 	this.previousTile = {
			// 		tileCoord: mouseTile,
			// 		tileType: this.getTileAt(mouseTile),
			// 	};
			// }
		}
	}

	getNeighborTypes({ tileX, tileY }: TileCoord): NeighborTypes {
		const getType = (x: number, y: number): Tile => {
			// const entity = this.entities[y]?.[x];
			// if (entity) {
			// 	return entity.tile;
			// }
			return this.tileManager.getTileAt({ tileX: x, tileY: y });
		};

		return {
			center: getType(tileX, tileY),
			up: getType(tileX, tileY - 1),
			down: getType(tileX, tileY + 1),
			left: getType(tileX - 1, tileY),
			right: getType(tileX + 1, tileY),
		};
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

	// private isRopeAt({ tileX, tileY }: TileCoord): boolean {
	// 	return this.entities[tileY]?.[tileX] instanceof Rope;
	// }

	// canPlaceRope({ tileX, tileY }: TileCoord): boolean {
	// 	// Can't place rope where rope already exists
	// 	if (this.isRopeAt({ tileX, tileY })) {
	// 		return true;
	// 	}

	// 	const center = this.tiles[tileY]?.[tileX] ?? Tile.None;
	// 	const up = this.tiles[tileY - 1]?.[tileX] ?? Tile.None;

	// 	// Valid: Type.None with Type.Wall above
	// 	if (center === Tile.None && up === Tile.Wall) {
	// 		return true;
	// 	}

	// 	// Valid: Type.Platform (center is Platform)
	// 	if (center === Tile.Platform) {
	// 		return true;
	// 	}

	// 	return false;
	// }

	// public getRopeNeighborTypes({ tileX, tileY }: TileCoord): NeighborTypes {
	// 	const tileUp = this.tiles[tileY - 1]?.[tileX] ?? Tile.None;
	// 	const tileDown = this.tiles[tileY + 1]?.[tileX] ?? Tile.None;
	// 	const ropeUp = this.isRopeAt({ tileX, tileY: tileY - 1 })
	// 		? Tile.Rope
	// 		: Tile.None;
	// 	const ropeDown = this.isRopeAt({ tileX, tileY: tileY + 1 })
	// 		? Tile.Rope
	// 		: Tile.None;

	// 	return {
	// 		center: Tile.Rope,
	// 		up: ropeUp !== Tile.None ? ropeUp : tileUp,
	// 		down: ropeDown !== Tile.None ? ropeDown : tileDown,
	// 		left: Tile.None,
	// 		right: Tile.None,
	// 	};
	// }

	// private createRope({ tileX, tileY }: TileCoord): void {
	// 	if (!this.entities[tileY]?.[tileX]) {
	// 		const rope = new Rope(this, tileX, tileY);
	// 		this.entities[tileY][tileX] = rope;
	// 		this.updateRopesSprites(tileX);
	// 	}
	// }

	// private deleteRope({ tileX, tileY }: TileCoord): void {
	// 	const entity = this.entities[tileY]?.[tileX];
	// 	if (entity instanceof Rope) {
	// 		entity.destroy();
	// 		this.entities[tileY][tileX] = undefined;
	// 		this.updateRopesSprites(tileX);
	// 	}
	// }

	// private deleteRopeRecursive({ tileX, tileY }: TileCoord): void {
	// 	if (!this.isRopeAt({ tileX, tileY })) {
	// 		return;
	// 	}

	// 	this.deleteRope({ tileX, tileY });

	// 	// Recursively delete connected ropes above and below
	// 	this.deleteRopeRecursive({ tileX, tileY: tileY - 1 });
	// 	this.deleteRopeRecursive({ tileX, tileY: tileY + 1 });
	// }

	// private updateRopesSprites(tileX: number): void {
	// 	// Update all ropes in this column
	// 	for (let tileY = 0; tileY < this.entities.length; tileY++) {
	// 		const entity = this.entities[tileY]?.[tileX];
	// 		if (entity instanceof Rope) {
	// 			entity.updateSprite(this.getRopeNeighborTypes({ tileX, tileY }));
	// 		}
	// 	}
	// }

	/* Input handling */

	setInputMode(inputMode: InputMode) {
		this.inputMode = inputMode;

		this.cursor.setVisible(inputMode == InputMode.Build);
	}

	setupListeners() {
		this.scene.get("UIScene").events.on(
			"itemSelect",
			(item: InventoryItem) => {
				console.log(item);
			},
			this,
		);
	}

	setupInput() {
		this.input.on("pointerdown", this.onPointerDown, this);
		this.input.on("pointerup", this.onPointerUp, this);
		this.input.on("pointerupoutside", this.onPointerUp, this);
		this.input.on("pointermove", this.onPointerMove, this);

		this.cursor = this.add
			.image(0, 0, "square", 0)
			.setTint(0xffff00)
			.setAlpha(0.25)
			.setOrigin(0.5, 0.5)
			.setDepth(100)
			.setVisible(false);
	}

	private onPointerDown(pointer: Phaser.Input.Pointer): void {
		// Ignore if in build mode
		if (this.inputMode != InputMode.Camera) return;

		this.isDraggingCamera = true;
		this.lastPointerPosition.set(pointer.x, pointer.y);

		// 	const tileCoord = this.mouseTileCoord;
		// 	const tileType = this.tileManager.getTileAt(tileCoord);
		// if (this.canPlaceRope(tileCoord)) {
		// 	this.pressedTile = { tileCoord, tileType };
		// 	this.createRope(tileCoord);
		// 	this.previousTile = { tileCoord, tileType };
		// }
	}

	private onPointerUp(pointer: Phaser.Input.Pointer): void {
		this.isDraggingCamera = false;

		// 	if (this.pressedTile) {
		// 		// Delete rope if: started on rope, didn't move
		// 		if (
		// 			this.pressedTile.tileType === Tile.Rope &&
		// 			this.previousTile === null
		// 		) {
		// 			this.deleteRopeRecursive(this.pressedTile.tileCoord);
		// 		}
		// 	}
		// 	this.pressedTile = null;
		// 	this.previousTile = null;
	}

	private onPointerMove(pointer: Phaser.Input.Pointer): void {
		if (!this.isDraggingCamera) return;

		const dx = pointer.x - this.lastPointerPosition.x;
		const dy = pointer.y - this.lastPointerPosition.y;

		const cam = this.cameras.main;

		// Move opposite to drag direction for "grab world" feel
		cam.scrollX -= dx / cam.zoom;
		cam.scrollY -= dy / cam.zoom;

		this.lastPointerPosition.set(pointer.x, pointer.y);
	}

	setupCamera() {
		// Set camera bounds
		const worldWidth = this.tileManager.widthInPixels;
		const worldHeight = this.tileManager.heightInPixels;
		const zoomLevel = 0.3;

		this.cameras.main.setBounds(
			8 * TILE_UPSCALE,
			8 * TILE_UPSCALE,
			worldWidth * TILE_UPSCALE - 16 * TILE_UPSCALE,
			worldHeight * TILE_UPSCALE + UI_HEIGHT / zoomLevel - 16 * TILE_UPSCALE,
		);
		this.cameras.main.setZoom(zoomLevel);

		// Center camera on level
		// this.cameras.main.centerOn(
		// 	(this.width * SIZE) / 2,
		// 	(this.height * SIZE) / 2,
		// );
		// // Zoom to fit the entire level
		// const zoom = Math.min(
		// 	this.W / (this.width * SIZE),
		// 	this.H / (this.height * SIZE),
		// );
		// this.cameras.main.zoomTo(zoom, 0);
		// this.cameras.main.zoomTo(0.3, 0);
	}

	// get tiles(): Tile[][] {
	// 	return this.tileManager.tiles;
	// }
}
