import { Player } from "@/components/Player";
import { TILE_UPSCALE, TileManager } from "@/logic/TileManager";
import {
	SIZE,
	Tile,
	NeighborTiles,
	TileCoord,
	NeighborEntities,
} from "@/logic/Tile";
import { BaseScene } from "@/scenes/BaseScene";
import { Inventory, InventoryItem } from "@/logic/Inventory";
import { LevelKey, levels } from "@/logic/levels";
import { UI_HEIGHT } from "./UIScene";
import { Cursor } from "@/components/Cursor";
import { Item, ItemKey } from "@/logic/Item";

import { Entity } from "@/components/tiles/Entity";
import { Rope } from "@/components/Rope";
import { Gold } from "@/components/tiles/Gold";
import { Stairs } from "@/components/tiles/Stairs";
import { Spikes } from "@/components/tiles/Spikes";
import { Home } from "@/components/tiles/Home";

enum InputMode {
	Cutscene, // No input allowed
	Camera, // Allow camera dragdrop interactions
	Build, // Allow building interactions
}

export class GameScene extends BaseScene {
	// World
	private tileManager: TileManager;
	private entities: Entity[];

	// Kobots
	private players: Player[] = [];

	// Input
	private inputMode: InputMode;
	private isHolding = false;
	private isDraggingCamera = false;
	private isUsingItem = false;
	private dragStartPosition = new Phaser.Math.Vector2();
	private lastPointerPosition = new Phaser.Math.Vector2();
	private cursor: Cursor;
	private readonly DRAG_THRESHOLD = 16;
	// private pressedTile: { tileCoord: TileCoord; tileType: Tile } | null = null;
	// private previousTile: { tileCoord: TileCoord; tileType: Tile } | null = null;

	private inventory: Inventory = [];

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x63ad9d);

		this.tileManager = new TileManager(this);
		this.entities = [];
		this.loadLevel("level1");

		/* Input handling */

		this.setupListeners();
		this.setupInput();
		this.setupCamera();

		this.setInputMode(InputMode.Camera);
	}

	setupListeners() {
		this.scene.get("UIScene").events.on("toggleItem", this.onToggleItem, this);
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
	}

	update(time: number, delta: number) {
		this.players.forEach((player) => {
			player.update(time, delta);
		});

		const mouseTile = this.getMouseTileCoord();
		const { x: mx, y: my } = TileCoord.tileToCoord(mouseTile);
		this.cursor.setPosition(mx, my);
		this.cursor.setAllowed(this.canUseItem(mouseTile));
	}

	/* Tiles */

	loadLevel(key: LevelKey) {
		const entityTiles = this.tileManager.loadTilemap(key);
		const homeCoords: TileCoord[] = [];

		for (let y = 0; y < this.tileManager.height; y++) {
			for (let x = 0; x < this.tileManager.width; x++) {
				const tile = entityTiles[y][x];
				if (tile) {
					const tileCoord = { x, y };
					const entity = this.createEntityFromTile(tile, tileCoord);

					if (entity) {
						this.entities.push(entity);
						this.refreshEntitySprites(tileCoord);
					}

					if (tile == "Home") {
						homeCoords.push(tileCoord);
					}
				}
			}
		}

		this.setInventory(levels[key].inventory);

		this.spawnPlayers(levels[key].playerCount, homeCoords);
	}

	getEntityAt(tileCoord: TileCoord): Entity[] {
		return this.entities.filter((entity) =>
			TileCoord.compare(entity.tileCoord, tileCoord),
		);
	}

	getNeighborEntities({ x, y }: TileCoord): NeighborEntities {
		return {
			center: this.getEntityAt({ x: x, y: y }),
			up: this.getEntityAt({ x: x, y: y - 1 }),
			down: this.getEntityAt({ x: x, y: y + 1 }),
			left: this.getEntityAt({ x: x - 1, y: y }),
			right: this.getEntityAt({ x: x + 1, y: y }),
		};
	}

	getTileAt(tileCoord: TileCoord): Tile[] {
		const tiles = [
			this.tileManager.getTileAt(tileCoord),
			...this.getEntityAt(tileCoord).map((entity) => entity.tile),
		];
		if (tiles.length >= 2) return tiles.filter((tile) => tile != "None");
		return tiles;
	}

	getNeighborTiles({ x, y }: TileCoord): NeighborTiles {
		return {
			center: this.getTileAt({ x: x, y: y }),
			up: this.getTileAt({ x: x, y: y - 1 }),
			down: this.getTileAt({ x: x, y: y + 1 }),
			left: this.getTileAt({ x: x - 1, y: y }),
			right: this.getTileAt({ x: x + 1, y: y }),
		};
	}

	/* Input handling */

	setupInput() {
		this.input.on("pointerdown", this.onPointerDown, this);
		this.input.on("pointerup", this.onPointerUp, this);
		this.input.on("pointerupoutside", this.onPointerUp, this);
		this.input.on("pointermove", this.onPointerMove, this);

		this.cursor = new Cursor(this).setDepth(100);
	}

	setInputMode(inputMode: InputMode) {
		this.inputMode = inputMode;
		this.cursor.setVisible(inputMode == InputMode.Build);
	}

	onPointerDown(pointer: Phaser.Input.Pointer): void {
		if (this.inputMode == InputMode.Cutscene) return;

		// Store initial position for drag threshold detection
		this.dragStartPosition.set(pointer.x, pointer.y);
		this.lastPointerPosition.set(pointer.x, pointer.y);

		this.isHolding = true;
		this.isDraggingCamera = false;
		this.isUsingItem = false;

		if (this.inputMode == InputMode.Build) {
			this.attemptUseItem();
		}
	}

	onPointerMove(pointer: Phaser.Input.Pointer): void {
		if (this.inputMode == InputMode.Cutscene) return;

		if (this.isUsingItem) {
			this.attemptUseItem();
		} else if (this.isDraggingCamera) {
			const dx = pointer.x - this.lastPointerPosition.x;
			const dy = pointer.y - this.lastPointerPosition.y;

			this.cameras.main.scrollX -= dx / this.cameras.main.zoom;
			this.cameras.main.scrollY -= dy / this.cameras.main.zoom;
		} else if (this.isHolding) {
			const dragDistance = Phaser.Math.Distance.Between(
				this.dragStartPosition.x,
				this.dragStartPosition.y,
				pointer.x,
				pointer.y,
			);
			if (dragDistance >= this.DRAG_THRESHOLD) {
				this.isDraggingCamera = true;
			}
		}

		this.lastPointerPosition.set(pointer.x, pointer.y);
	}

	onPointerUp(pointer: Phaser.Input.Pointer): void {
		this.isHolding = false;
		this.isDraggingCamera = false;
		this.isUsingItem = false;
	}

	getMouseTileCoord(): TileCoord {
		const worldPoint = this.cameras.main.getWorldPoint(
			this.input.activePointer.x,
			this.input.activePointer.y,
		);
		return {
			x: Math.floor(worldPoint.x / SIZE),
			y: Math.floor(worldPoint.y / SIZE),
		};
	}

	/* Entities */

	spawnPlayers(playerCount: number, homeCoords: TileCoord[]) {
		for (let i = 0; i < playerCount; i++) {
			this.addEvent(1000 + 500 * i, () => {
				// Cycle between homes in case there are multiple
				const homeCoord = homeCoords[i % homeCoords.length];
				this.addPlayer(homeCoord);
			});
		}
	}

	addPlayer(tileCoord: TileCoord) {
		const player = new Player(this);
		this.players.push(player);

		player.on("neighbors", () => {
			const neighbors = this.getNeighborTiles(player.tileCoord);
			player.updateAction(neighbors);
		});
		player.on("collect", () => {
			const entities = this.getEntityAt(player.tileCoord).filter(
				(entity) => entity.tile == "Gold",
			);
			entities.forEach((entity) => {
				this.entities = this.entities.filter((e) => e != entity);
				entity.destroy();
			});
		});
		player.setTile(tileCoord);
	}

	createEntityFromTile(tile: Tile, tileCoord: TileCoord): Entity | undefined {
		switch (tile) {
			case "Home":
				return new Home(this, tileCoord);
			case "Climb":
				return new Rope(this, tileCoord);
			case "Gold":
				return new Gold(this, tileCoord);
			case "Death":
				return new Spikes(this, tileCoord);

			case "None":
				return;
			default:
				console.warn("Unknown entity");
		}
	}

	createEntityFromItem(key: ItemKey, tileCoord: TileCoord): Entity {
		switch (key) {
			case "Rope":
				return new Rope(this, tileCoord);
			case "Gold":
				return new Gold(this, tileCoord);
			case "Stairs":
			case "Ladder":
				return new Stairs(this, tileCoord);
		}
	}

	refreshEntitySprites(tileCoord: TileCoord) {
		const neighbors = this.getNeighborEntities(tileCoord);
		Object.values(neighbors).forEach((entities) => {
			entities.forEach((entity) => {
				entity.updateSprite(this.getNeighborTiles(entity.tileCoord));
			});
		});
	}

	/* Inventory */

	setInventory(inventory: Inventory) {
		// Shallow copy inventory to avoid mutation
		this.inventory = inventory.map((item) => ({ ...item }));

		this.events.emit("setInventory", this.inventory);
	}

	onToggleItem(item: InventoryItem) {
		if (this.inputMode == InputMode.Cutscene) return;

		if (item.selected) {
			item.selected = false;
			this.setInputMode(InputMode.Camera);
		} else {
			this.inventory.forEach((item) => (item.selected = false));
			item.selected = true;
			this.cursor.setIcon(Item[item.itemKey].image);
			this.setInputMode(InputMode.Build);
		}

		this.events.emit("updateInventory", this.inventory);
	}

	getSelectedItem(): InventoryItem | undefined {
		return this.inventory.find((item) => !!item.selected);
	}

	attemptUseItem() {
		const item = this.getSelectedItem();
		if (item) {
			const tileCoord = this.getMouseTileCoord();

			if (this.canUseItem(tileCoord)) {
				const entity = this.createEntityFromItem(item.itemKey, tileCoord);
				this.entities.push(entity);
				this.refreshEntitySprites(tileCoord);

				this.useItem(item);
			}
		}
	}

	canUseItem(tileCoord: TileCoord): boolean {
		const item = this.getSelectedItem();
		if (!item) return false;
		if (item.amount <= 0) return false;

		const neighbors = this.getNeighborTiles(tileCoord);

		if (neighbors.center.includes(Item[item.itemKey].tile)) return false;

		return Item[item.itemKey].allowedPlacements.some((rule) => {
			return (Object.entries(rule) as [keyof typeof neighbors, Tile][]).every(
				([dir, requiredTile]) => {
					const tilesAtDir = neighbors[dir];
					return tilesAtDir.includes(requiredTile);
				},
			);
		});
	}

	useItem(item: InventoryItem) {
		this.isUsingItem = true;

		item.amount -= 1;
		if (item.amount <= 0) {
			item.selected = false;
			this.setInputMode(InputMode.Camera);
		}

		this.events.emit("updateInventory", this.inventory);
	}
}
