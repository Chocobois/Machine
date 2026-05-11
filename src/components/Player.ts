import { GameScene } from "@/scenes/GameScene";
import { NeighborTiles, SIZE, Tile, TileCoord, TileDef } from "@/logic/Tile";
import { interpolateColor } from "@/util/functions";

enum Action {
	Idle,
	Walking,
	Climbing,
	Falling,
	Flying,
	Collecting,
	Leaving,
	Dead,
}

const animations: { [key in Action]: number[] } = {
	[Action.Idle]: [0, 1],
	[Action.Walking]: [0, 2, 1, 3],
	[Action.Climbing]: [4, 5],
	[Action.Falling]: [6, 7],
	[Action.Dead]: [9],
	[Action.Flying]: [10, 11],
	[Action.Collecting]: [8],
	[Action.Leaving]: [0, 2, 1, 3],
};

export class Player extends Phaser.GameObjects.Container {
	public scene: GameScene;
	public tileCoord: TileCoord;
	public holding: Tile | undefined;

	private sprite: Phaser.GameObjects.Sprite;
	private heldSprite: Phaser.GameObjects.Sprite;
	private explodeSprite: Phaser.GameObjects.Sprite;

	private action: Action = Action.Idle;
	private tween: Phaser.Tweens.Tween;
	private facingRight: boolean = true;
	private fallSpeed: number = 0;
	private queuedDeath: boolean = false;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;

		let sprite_id = Phaser.Math.RND.pick([
			"kobots_orange",
			// "kobots_red",
			// "kobots_yellow",
			// "kobots_green",
			// "kobots_blue",
			// "kobots_violet"
		]);

		this.sprite = this.scene.add.sprite(0, 0, sprite_id, 0);
		this.sprite.setScale(SIZE / this.sprite.width);
		this.add(this.sprite);

		const frame = Phaser.Math.RND.pick([0, 1, 2, 3]);
		this.heldSprite = this.scene.add
			.sprite(0, -0.35 * SIZE, "treasure", frame)
			.setOrigin(0.5, 1.0)
			.setVisible(false);
		this.heldSprite.setScale(SIZE / this.heldSprite.width);
		this.add(this.heldSprite);

		this.explodeSprite = this.scene.add
			.sprite(0, 0, "explosion", 0)
			.setOrigin(0.5, 0.5)
			.setVisible(false);
		this.explodeSprite.setScale(SIZE / this.heldSprite.width / 4);
		this.add(this.explodeSprite);
	}

	update(time: number, delta: number) {
		const frames = animations[this.action];
		const index = Math.floor(time / 250) % frames.length;
		this.sprite.setFrame(frames[index]);
		this.sprite.setFlipX(!this.facingRight);
		this.heldSprite.setOrigin(
			0.5,
			1 + Math.sin(((time / 400) * Math.PI) % Math.PI) * 0.1,
		);
	}

	setTileCoord(tileCoord: TileCoord) {
		this.tileCoord = tileCoord;
		const { x, y } = TileCoord.tileToCoord(tileCoord);
		this.setPosition(x, y);
		this.emit("neighbors");
	}

	enterLevel(tileCoord: TileCoord) {
		this.action = Action.Walking;
		this.tileCoord = tileCoord;
		const { x, y } = TileCoord.tileToCoord(tileCoord);
		this.setPosition(x - SIZE, y - SIZE);

		const maskY = y - 1.5 * SIZE;
		const mask = new Phaser.Display.Masks.BitmapMask(
			this.scene,
			undefined,
			x,
			maskY,
			"home_mask",
		);
		mask.invertAlpha = true;
		this.setMask(mask);

		this.tween = this.scene.tweens.addCounter({
			duration: 1000,
			onUpdate: (tween, target, key, current) => {
				this.x = x - SIZE * (1 - current);
				this.y = y - SIZE * (1 - current);
				this.sprite.setTint(interpolateColor(0x2b8573, 0xffffff, current));
			},
			onComplete: () => {
				this.setTileCoord(tileCoord);
				this.clearMask();
				this.sprite.setTint(0xffffff);
			},
		});
	}

	updateAction({
		center,
		north,
		ne,
		east,
		se,
		south,
		sw,
		west,
		nw,
	}: NeighborTiles) {
		const check = (tiles: Tile[], test: (def: TileDef) => boolean) =>
			tiles.some((tile) => test(TileDef[tile]));

		const dx = this.facingRight ? 1 : -1;
		const front = this.facingRight ? east : west;
		const frontUp = this.facingRight ? ne : nw;
		const frontDown = this.facingRight ? se : sw;
		const back = this.facingRight ? west : east;

		// Fatal tiles
		if (
			center.includes("Death") ||
			check(center, (d) => d.isSolid) ||
			this.queuedDeath
		) {
			return this.die();
		}

		// Interactions
		if (center.includes("Gold") && !this.holding) return this.pickUp();
		if (center.includes("Home") && this.readyToLeave) return this.exitLevel();

		// Climbing
		if (center.includes("Climb")) {
			if (
				this.action == Action.Climbing &&
				!check(front, (d) => d.isSolid) &&
				check(frontDown, (d) => d.isFloor)
			) {
				// Leave the rope
			} else if (!check(north, (d) => d.isSolid)) {
				return this.climb();
			}
		}

		// Zipline
		if (center.includes("Zipline") && front.includes("Zipline")) {
			this.action = Action.Climbing;
			this.fallSpeed = 0;
			this.emit("sound", "rope");
			return this.move(dx, 0, 800);
		}

		// Updraft
		if (center.includes("Updraft")) {
			this.action = Action.Flying;
			this.fallSpeed = 0;
			this.emit("sound", "flail");

			// Move diagonally forward, fall out of the wind
			if (
				!check(front, (d) => d.isSolid) &&
				!check(frontUp, (d) => d.isSolid)
			) {
				return this.move(dx, -1, 400 * 1.4);
			}

			if (check(north, (d) => d.isSolid)) {
				if (check(front, (d) => d.isSolid)) {
					return this.turnAround();
				}
				return this.move(dx, 0, 400);
			}

			// Special case where they get stuck in a corner
			if (
				!north.includes("Updraft") &&
				(check(front, (d) => d.isSolid) || check(frontUp, (d) => d.isSolid))
			) {
				return this.turnAround();
			}

			return this.move(0, -1, 400);
		}

		// Gravity
		if (check(center, (d) => !d.isSolid) && !center.includes("Climb")) {
			if (!check(south, (d) => d.isFloor)) {
				return this.fall();
			}
		}

		// Land
		const fatal = this.checkLanding();
		this.fallSpeed = 0;
		if (fatal) return this.die();

		// Walking
		if (!check(front, (d) => d.isSolid)) {
			// If updraft is in front, fly up into it
			if (frontUp.includes("Updraft")) {
				this.action = Action.Flying;
				this.emit("sound", "flail");
				return this.move(dx, -1, 400 * 1.4);
			}

			if (center.includes("Climb") && front.includes("Climb")) {
				this.action = Action.Climbing;
				this.emit("sound", "rope");
				return this.move(dx, 0, 800);
			}

			// Normal walk
			return this.walk(dx);
		} else if (!check(back, (d) => d.isSolid)) {
			return this.turnAround();
		}

		return this.idle();
	}

	setHeldItem(tile: Tile | undefined) {
		console.assert(
			tile == undefined || tile == "Gold",
			"Unimplemented setHeldItem",
		);
		this.holding = tile;
		this.heldSprite.setVisible(!!tile);
	}

	/* Actions */

	private turnAround() {
		this.facingRight = !this.facingRight;
		this.scene.addEvent(10, () => {
			this.setTileCoord(this.tileCoord);
		});
	}

	private idle() {
		this.action = Action.Idle;
	}

	private die() {
		this.action = Action.Dead;
		this.heldSprite.setVisible(false);
		this.emit("sound", "explode");

		this.emit("leave");

		console.assert(!this.tween || !this.tween.isPlaying());
		this.tween = this.scene.tweens.addCounter({
			from: 0,
			to: 17,
			onStart: () => {
				this.explodeSprite.setVisible(true);
			},
			onUpdate: (tween, target, key, current) => {
				this.explodeSprite.setFrame(Math.floor(current));
			},
			onComplete: () => {
				this.explodeSprite.setVisible(false);
			},
		});
	}

	queueDeath() {
		this.queuedDeath = true;
	}

	private fall() {
		if (this.action != Action.Falling && this.action != Action.Flying)
			this.fallSpeed = 0;
		this.fallSpeed += 1;
		const duration = 500 / (1 + 0.4 * this.fallSpeed);

		if (this.fallSpeed > 4 || this.action == Action.Flying) {
			this.action = Action.Flying;
		} else {
			this.action = Action.Falling;
		}

		this.move(0, 1, duration);
	}

	private checkLanding(): boolean {
		switch (this.fallSpeed) {
			case 0:
				break;
			case 1:
			case 2:
				this.emit("sound", "land_soft");
				break;
			case 3:
			case 4:
				this.emit("sound", "land_med");
				break;
			case 5:
			case 6:
				this.emit("sound", "land_hard");
				break;
			default:
				return true;
		}
		return false;
	}

	private walk(deltaTileX: number) {
		this.action = Action.Walking;
		this.move(deltaTileX, 0, 600);

		this.emit("sound", "metal_step");
	}

	private climb() {
		this.action = Action.Climbing;
		this.move(0, -1, 800);
		this.fallSpeed = 0;

		this.emit("sound", "creak");
	}

	private pickUp() {
		this.action = Action.Collecting;
		this.emit("collect");

		console.assert(!this.tween || !this.tween.isPlaying());
		this.tween = this.scene.tweens.add({
			targets: this,
			y: { from: this.y, to: this.y - 0.5 * SIZE },
			duration: 300,
			ease: Phaser.Math.Easing.Cubic.Out,
			yoyo: true,
			repeat: 1,
			onRepeat: () => {
				// this.facingRight = !this.facingRight;
				this.emit("sound", "land_soft");
			},
			onComplete: () => {
				this.setTileCoord(this.tileCoord);
				this.emit("sound", "land_soft");
			},
		});
	}

	private exitLevel() {
		this.action = Action.Leaving;
		this.facingRight = false;
		this.emit("leave");
		this.emit("sound", "staircase");

		const { x, y } = TileCoord.tileToCoord(this.tileCoord);

		const maskY = y - 1.5 * SIZE;
		const mask = new Phaser.Display.Masks.BitmapMask(
			this.scene,
			undefined,
			x,
			maskY,
			"home_mask",
		);
		mask.invertAlpha = true;
		this.setMask(mask);

		console.assert(!this.tween || !this.tween.isPlaying());
		this.tween = this.scene.tweens.addCounter({
			duration: 1000,
			onUpdate: (tween, target, key, current) => {
				this.x = x - SIZE * current;
				this.y = y - SIZE * current;
				this.sprite.setTint(interpolateColor(0xffffff, 0x2b8573, current));
			},
			onComplete: () => {
				// this.action = Action.Leaving;
				this.setVisible(false);
			},
		});
	}

	/* Audio */

	yip() {
		this.emit("sound", "yip");
	}

	/* Helpers */

	private move(dtx: number, dty: number, duration: number) {
		console.assert(!this.tween || !this.tween.isPlaying());
		this.tween = this.scene.tweens.add({
			targets: this,
			duration: duration / this.scene.playSpeed,
			x: { from: this.x, to: this.x + dtx * SIZE },
			y: { from: this.y, to: this.y + dty * SIZE },
			onComplete: () => {
				this.setTileCoord(TileCoord.add(this.tileCoord, dtx, dty));
			},
		});
	}

	get readyToLeave(): boolean {
		return !!this.holding || this.scene.timeToLeave;
	}

	get hasLeft(): boolean {
		return this.action == Action.Leaving || this.action == Action.Dead;
	}
}
