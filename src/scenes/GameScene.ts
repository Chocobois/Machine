import { Player } from "@/components/Player";
import { TileManager } from "@/logic/TileManager";
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
import { Item, ItemKey, PlacementRule } from "@/logic/Item";

import { Entity } from "@/components/tiles/Entity";
import { Rope } from "@/components/Rope";
import { Gold } from "@/components/tiles/Gold";
import { Spikes } from "@/components/tiles/Spikes";
import { Home } from "@/components/tiles/Home";
import { Fan } from "@/components/tiles/Fan";
import { Zipline } from "@/components/Zipline";
import { Updraft } from "@/components/tiles/Updraft";
import { Ladder } from "@/components/Ladder";

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
	private isUsingItem = false;
	private dragStartPosition = new Phaser.Math.Vector2();
	private lastPointerPosition = new Phaser.Math.Vector2();
	private lastPointerTileCoord: TileCoord = { x: 0, y: 0 };
	private cursor: Cursor;
	private readonly DRAG_THRESHOLD = 16;
	// private pressedTile: { tileCoord: TileCoord; tileType: Tile } | null = null;
	// private previousTile: { tileCoord: TileCoord; tileType: Tile } | null = null;

	private isDraggingCamera = false;
	private cameraTarget = new Phaser.Math.Vector2();

	private buildStartTile?: TileCoord;
	private previewCoords: TileCoord[] = [];
	private previewEntities: Entity[] = [];
	private previewValid = false;

	private inventory: Inventory = [];

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x63ad9d);

		this.tileManager = new TileManager(this);
		this.entities = [];
		this.loadLevel("leveldev1");

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
		const zoomLevel = 4;

		this.cameras.main.setBounds(
			8,
			8,
			worldWidth - 16,
			worldHeight + UI_HEIGHT / zoomLevel - 16,
		);

		this.cameras.main.setZoom(zoomLevel);
		this.cameras.main.setRoundPixels(true);

		this.cameraTarget.set(-500, -300);
		this.cameras.main.scrollX = this.cameraTarget.x;
		this.cameras.main.scrollY = this.cameraTarget.y;
	}

	update(time: number, delta: number) {
		this.players.forEach((player) => {
			player.update(time, delta);
		});

		this.entities.forEach((entity) => {
			entity.update(time, delta);
		});
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
						entity.on("toggle", this.onEntityToggle, this);
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

	getEntitiesAt(tileCoord: TileCoord, includePreview = false): Entity[] {
		return this.entities.filter(
			(entity) =>
				TileCoord.compare(entity.tileCoord, tileCoord) &&
				(entity.isEnabled() || includePreview),
		);
	}

	getNeighborEntities(
		{ x, y }: TileCoord,
		includePreview = false,
	): NeighborEntities {
		return {
			center: this.getEntitiesAt({ x: x, y: y }, false),
			north: this.getEntitiesAt({ x: x, y: y - 1 }, includePreview),
			ne: this.getEntitiesAt({ x: x + 1, y: y - 1 }, includePreview),
			east: this.getEntitiesAt({ x: x + 1, y: y }, includePreview),
			se: this.getEntitiesAt({ x: x + 1, y: y + 1 }, includePreview),
			south: this.getEntitiesAt({ x: x, y: y + 1 }, includePreview),
			sw: this.getEntitiesAt({ x: x - 1, y: y + 1 }, includePreview),
			west: this.getEntitiesAt({ x: x - 1, y: y }, includePreview),
			nw: this.getEntitiesAt({ x: x - 1, y: y - 1 }, includePreview),
		};
	}

	getTileAt(tileCoord: TileCoord, includePreview = false): Tile[] {
		const tiles = [
			this.tileManager.getTileAt(tileCoord),
			...this.getEntitiesAt(tileCoord, includePreview).map(
				(entity) => entity.tile,
			),
		];
		if (tiles.length >= 2) return tiles.filter((tile) => tile != "None");
		return tiles;
	}

	getNeighborTiles({ x, y }: TileCoord, includePreview = false): NeighborTiles {
		return {
			center: this.getTileAt({ x: x, y: y }, false),
			north: this.getTileAt({ x: x, y: y - 1 }, includePreview),
			ne: this.getTileAt({ x: x + 1, y: y - 1 }, includePreview),
			east: this.getTileAt({ x: x + 1, y: y }, includePreview),
			se: this.getTileAt({ x: x + 1, y: y + 1 }, includePreview),
			south: this.getTileAt({ x: x, y: y + 1 }, includePreview),
			sw: this.getTileAt({ x: x - 1, y: y + 1 }, includePreview),
			west: this.getTileAt({ x: x - 1, y: y }, includePreview),
			nw: this.getTileAt({ x: x - 1, y: y - 1 }, includePreview),
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
			const tile = this.getMouseTileCoord();
			if (!this.canUseItem(tile)) return;
			this.buildStartTile = tile;
			this.previewCoords = [tile];
			this.updatePreview();
		}
	}

	onPointerMove(pointer: Phaser.Input.Pointer): void {
		if (this.inputMode == InputMode.Cutscene) return;

		const mouseTile = this.getMouseTileCoord();

		if (!TileCoord.compare(mouseTile, this.lastPointerTileCoord)) {
			this.lastPointerTileCoord = mouseTile;
			const { x: mx, y: my } = TileCoord.tileToCoord(mouseTile);
			this.cursor.setPosition(mx, my);
			this.cursor.setAllowed(this.canUseItem(mouseTile));
		}

		if (this.buildStartTile) {
			this.previewCoords = this.getBuildLine(this.buildStartTile, mouseTile);
			this.updatePreview();
		}

		// Player is currently building
		if (this.buildStartTile) {
			// Do nothing
		}
		// Player is moving camera
		else if (this.isDraggingCamera) {
			const dx = pointer.x - this.lastPointerPosition.x;
			const dy = pointer.y - this.lastPointerPosition.y;

			this.cameraTarget.x -= dx / this.cameras.main.zoom;
			this.cameraTarget.y -= dy / this.cameras.main.zoom;
			this.cameras.main.scrollX = this.cameraTarget.x;
			this.cameras.main.scrollY = this.cameraTarget.y;
		}
		// Player is holding and dragging, wait to confirm click or drag
		else if (this.isHolding) {
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
		this.lastPointerTileCoord = { x: -1, y: -1 };

		if (this.buildStartTile) {
			if (this.previewValid) {
				this.commitBuild(this.previewCoords);
			}

			this.clearPreview();

			this.buildStartTile = undefined;
			this.previewCoords = [];
		}
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

	getBuildLine(start: TileCoord, end: TileCoord): TileCoord[] {
		const item = this.getSelectedItem();
		if (!item) return [];

		const rules = Item[item.itemKey].rules;

		if (!rules.axis) {
			return [start];
		}

		if (rules.axis === "y") {
			end = { x: start.x, y: end.y };
		}

		if (rules.axis === "x") {
			end = { x: end.x, y: start.y };
		}

		const minX = Math.min(start.x, end.x);
		const maxX = Math.max(start.x, end.x);
		const minY = Math.min(start.y, end.y);
		const maxY = Math.max(start.y, end.y);

		const coords: TileCoord[] = [];

		for (let x = minX; x <= maxX; x++) {
			for (let y = minY; y <= maxY; y++) {
				coords.push({ x, y });
			}
		}

		return coords;
	}

	updatePreview() {
		this.clearPreview();

		const item = this.getSelectedItem();
		if (!item) return;

		// Create preview entities
		this.previewEntities = this.previewCoords.map((coord) => {
			const entity = this.createEntityFromItem(item.itemKey, coord);

			// Make it look like preview
			// entity.setAlpha(0.5);
			// entity.disableInteractive();
			entity.setEnabled(false);

			this.entities.push(entity); // TEMPORARILY include for neighbor logic
			return entity;
		});

		// Update sprites (important!)
		this.previewCoords.forEach((coord) => {
			this.refreshEntitySprites(coord, true);
		});

		// Validate entire build
		this.previewValid = this.validatePreview();
		this.cursor.setAllowed(this.previewValid);

		// Tint everything
		const tint = this.previewValid ? 0x00ff00 : 0xff0000;

		this.previewEntities.forEach((entity) => {
			entity.list.forEach((child) => {
				if (child instanceof Phaser.GameObjects.Sprite) {
					child.setTint(tint);
				}
			});
		});
	}

	validatePreview(): boolean {
		const item = this.getSelectedItem();
		if (!item) return false;

		const def = Item[item.itemKey];
		const rules = def.rules;
		const coords = this.previewCoords;

		if (!rules.axis) {
			return coords.length === 1 && this.canUseItem(coords[0]);
		}

		if (coords.length < rules.min || coords.length > rules.max) return false;

		return coords.every((coord, index) => {
			let ruleSet: PlacementRule[];

			if (index === 0) ruleSet = rules.start;
			else if (index === coords.length - 1) ruleSet = rules.end;
			else ruleSet = rules.middle;

			return this.matchesAnyRule(coord, ruleSet);
		});
	}

	matchesAnyRule(coord: TileCoord, rules: PlacementRule[]): boolean {
		const neighbors = this.getNeighborTiles(coord, false); // IMPORTANT: no preview

		return rules.some((rule) => {
			return (Object.entries(rule) as [keyof typeof neighbors, Tile][]).every(
				([dir, required]) => {
					return neighbors[dir].includes(required);
				},
			);
		});
	}

	clearPreview() {
		this.previewEntities.forEach((entity) => {
			this.entities = this.entities.filter((e) => e !== entity);
			entity.destroy();
		});

		this.previewEntities = [];
	}

	commitBuild(coords: TileCoord[]) {
		const item = this.getSelectedItem();
		if (!item) return;

		const created: Entity[] = [];

		coords.forEach((coord) => {
			const entity = this.createEntityFromItem(item.itemKey, coord);
			this.entities.push(entity);
			entity.on("toggle", this.onEntityToggle, this);
			created.push(entity);
		});

		// Assign parent/children
		const parent = created[0];

		for (let i = 1; i < created.length; i++) {
			const child = created[i];
			child.parent = parent;
			parent.children.push(child);
		}

		// Refresh visuals AFTER all are placed
		coords.forEach((coord) => {
			this.refreshEntitySprites(coord);
		});

		this.refreshUpdrafts();

		this.useItem(item);
	}

	/* Entities */

	spawnPlayers(playerCount: number, homeCoords: TileCoord[]) {
		if (homeCoords.length == 0) {
			console.warn("No Home tile found");
			homeCoords.push({
				x: Math.floor(this.tileManager.width / 2),
				y: Math.floor(this.tileManager.height / 2),
			});
		}

		for (let i = 0; i < playerCount; i++) {
			this.addEvent(1000 + 1000 * i, () => {
				// Cycle between homes in case there are multiple
				const homeCoord = homeCoords[i % homeCoords.length];
				this.addPlayer(homeCoord);
			});
		}
	}

	addPlayer(tileCoord: TileCoord) {
		const player = new Player(this);
		player.setDepth(10);
		this.players.push(player);

		player.on("neighbors", () => {
			const neighbors = this.getNeighborTiles(player.tileCoord);
			player.updateAction(neighbors);
		});
		player.on("collect", () => {
			// Fetch gold entity
			const goldEntity = this.getEntitiesAt(player.tileCoord).find(
				(entity) => entity.tile == "Gold",
			);

			if (goldEntity) {
				player.setHeldItem(goldEntity.tile); // Add goldEntity sprite data

				this.entities = this.entities.filter((entity) => entity != goldEntity);
				goldEntity.destroy();
			}
		});
		player.setTileCoord(tileCoord);
	}

	createEntityFromTile(tile: Tile, tileCoord: TileCoord): Entity | undefined {
		switch (tile) {
			case "Home":
				return new Home(this, tileCoord);
			case "Climb":
				return new Ladder(this, tileCoord);
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
			case "Fan":
				return new Fan(this, tileCoord);
			case "Zipline":
				return new Zipline(this, tileCoord);
		}
	}

	onEntityToggle() {
		this.refreshUpdrafts();
	}

	refreshEntitySprites(tileCoord: TileCoord, includePreview = false) {
		const neighbors = this.getNeighborEntities(tileCoord, includePreview);
		Object.values(neighbors).forEach((entities) => {
			entities.forEach((entity) => {
				entity.updateSprite(
					this.getNeighborTiles(entity.tileCoord, includePreview),
				);
			});
		});
	}

	refreshUpdrafts() {
		// Remove old updrafts safely
		this.entities = this.entities.filter((e) => {
			if (e.tile === "Updraft") {
				e.destroy();
				return false;
			}
			return true;
		});

		// Reset fan children
		this.entities.forEach((e) => {
			if (e.tile === "Fan") {
				e.children = [];
			}
		});

		// Rebuild from all fans
		this.entities
			.filter((e) => e instanceof Fan && e.isEnabled())
			.forEach((fan) => {
				this.createUpdraftFromFan(fan);
			});
	}

	createUpdraftFromFan(fan: Fan) {
		const maxLength = 8;

		const created: Entity[] = [];
		let current = fan.tileCoord;

		for (let i = 0; i < maxLength; i++) {
			const next = { x: current.x, y: current.y - i };

			const blockingTiles = this.getTileAt(next);

			// Stop if blocked
			if (blockingTiles.includes("Wall")) {
				break;
			}

			const updraft = new Updraft(this, next);
			this.entities.push(updraft);
			created.push(updraft);
		}

		// parent = fan, children = updrafts
		created.forEach((child) => {
			child.parent = fan;
			fan.children.push(child);
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
			// this.cursor.setIcon(Item[item.itemKey].image);
			this.cursor.setAxis(Item[item.itemKey].rules.axis);
			this.setInputMode(InputMode.Build);
		}

		this.events.emit("updateInventory", this.inventory);
	}

	getSelectedItem(): InventoryItem | undefined {
		return this.inventory.find((item) => !!item.selected);
	}

	canUseItem(tileCoord: TileCoord): boolean {
		const item = this.getSelectedItem();
		if (!item) return false;
		if (item.amount <= 0) return false;

		const neighbors = this.getNeighborTiles(tileCoord, true);

		return Item[item.itemKey].rules.start.some((rule) => {
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
