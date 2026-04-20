import { Player } from "@/components/Player";
import { TILE_UPSCALE, TileManager } from "@/logic/TileManager";
import {
	SIZE,
	Tile,
	tileToCoord,
	NeighborTiles,
	TileCoord,
} from "@/components/tiles/Tile";
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
	private cursor: Cursor;

	private inventory: Inventory = [];

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x63ad9d);

		this.tileManager = new TileManager(this);
		this.loadLevel("level1");

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

	loadLevel(key: LevelKey) {
		this.tileManager.loadTilemap(key);

		// Shallow copy inventory to avoid mutation
		this.inventory = levels[key].inventory.map((item) => ({ ...item }));

		this.events.emit("setInventory", this.inventory);
	}

	canUseItem(tileCoord: TileCoord): boolean {
		const item = this.selectedItem;
		if (!item) return false;
		if (item.amount <= 0) return false;

		const neighbors = this.getNeighborTiles(tileCoord);

		return Item[item.itemKey].allowedPlacements.some((rule) => {
			return (Object.entries(rule) as [keyof typeof neighbors, Tile][]).every(
				([dir, requiredTile]) => {
					return neighbors[dir] === requiredTile;
				},
			);
		});
	}

	update(time: number, delta: number) {
		this.players.forEach((player) => {
			player.update(time, delta);
		});

		const mouseTile = this.mouseTileCoord;
		const { x: mx, y: my } = tileToCoord(mouseTile);
		this.cursor.setPosition(mx, my);
		this.cursor.setAllowed(this.canUseItem(mouseTile));

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

	getNeighborTiles({ tileX, tileY }: TileCoord): NeighborTiles {
		const getType = (x: number, y: number): Tile => {
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
			const neighbors = this.getNeighborTiles(player.tileCoord);
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

	// 	const center = this.tiles[tileY]?.[tileX] ?? "None";
	// 	const up = this.tiles[tileY - 1]?.[tileX] ?? "None";

	// 	// Valid: Type.None with Type.Wall above
	// 	if (center === "None" && up === "Wall") {
	// 		return true;
	// 	}

	// 	// Valid: Type.Platform (center is Platform)
	// 	if (center === "Platform") {
	// 		return true;
	// 	}

	// 	return false;
	// }

	// public getRopeNeighborTypes({ tileX, tileY }: TileCoord): NeighborTypes {
	// 	const tileUp = this.tiles[tileY - 1]?.[tileX] ?? "None";
	// 	const tileDown = this.tiles[tileY + 1]?.[tileX] ?? "None";
	// 	const ropeUp = this.isRopeAt({ tileX, tileY: tileY - 1 })
	// 		? "Rope"
	// 		: "None";
	// 	const ropeDown = this.isRopeAt({ tileX, tileY: tileY + 1 })
	// 		? "Rope"
	// 		: "None";

	// 	return {
	// 		center: "Rope",
	// 		up: ropeUp !== "None" ? ropeUp : tileUp,
	// 		down: ropeDown !== "None" ? ropeDown : tileDown,
	// 		left: "None",
	// 		right: "None",
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
		this.scene.get("UIScene").events.on("toggleItem", this.onToggleItem, this);
	}

	setupInput() {
		this.input.on("pointerdown", this.onPointerDown, this);
		this.input.on("pointerup", this.onPointerUp, this);
		this.input.on("pointerupoutside", this.onPointerUp, this);
		this.input.on("pointermove", this.onPointerMove, this);

		this.cursor = new Cursor(this).setDepth(100);
	}

	private onPointerDown(pointer: Phaser.Input.Pointer): void {
		if (this.inputMode == InputMode.Camera) {
			this.isDraggingCamera = true;
			this.lastPointerPosition.set(pointer.x, pointer.y);
		} else if (this.inputMode == InputMode.Build) {
			const item = this.selectedItem;
			if (item) {
				const tileCoord = this.mouseTileCoord;

				if (this.canUseItem(tileCoord)) {
					const entity = this.createEntityFromItem(item.itemKey, tileCoord);
					// this.tileManager.addEntity();

					item.amount -= 1;
					this.events.emit("updateInventory", this.inventory);
				}

				// 	const tileType = this.tileManager.getTileAt(tileCoord);
				// if (this.canPlaceRope(tileCoord)) {
				// 	this.pressedTile = { tileCoord, tileType };
				// 	this.createRope(tileCoord);
				// 	this.previousTile = { tileCoord, tileType };
				// }
			}
		}
	}

	createEntityFromItem(key: ItemKey, tileCoord: TileCoord): Entity {
		switch (key) {
			case "Rope":
				return new Rope(this, tileCoord);
			case "Gold":
				return new Gold(this, tileCoord);
			case "Stairs":
			case "Cannon":
			case "Ladder":
				return new Stairs(this, tileCoord);
		}
	}

	private onPointerUp(pointer: Phaser.Input.Pointer): void {
		this.isDraggingCamera = false;

		// 	if (this.pressedTile) {
		// 		// Delete rope if: started on rope, didn't move
		// 		if (
		// 			this.pressedTile.tileType === "Rope" &&
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
	}

	// get tiles(): Tile[][] {
	// 	return this.tileManager.tiles;
	// }

	/* Inventory */

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

	get selectedItem(): InventoryItem | undefined {
		return this.inventory.find((item) => !!item.selected);
	}
}
