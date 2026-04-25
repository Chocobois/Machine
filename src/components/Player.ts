import { GameScene } from "@/scenes/GameScene";
import { NeighborTiles, SIZE, Tile, TileCoord } from "@/logic/Tile";

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
	[Action.Walking]: [2, 3],
	[Action.Climbing]: [4, 5],
	[Action.Falling]: [6, 7],
	// [Action.Hurt]: [8],
	[Action.Dead]: [9],
	[Action.Flying]: [10, 11],
	// [Action.Bump]: [12, 13],
	[Action.Collecting]: [13],
	[Action.Leaving]: [0, 1],
};

export class Player extends Phaser.GameObjects.Container {
	public scene: GameScene;
	public tileCoord: TileCoord;
	public holding: Tile | undefined;

	private sprite: Phaser.GameObjects.Sprite;
	private heldSprite: Phaser.GameObjects.Sprite;

	private action: Action = Action.Idle;
	private facingRight: boolean = true;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;

		this.sprite = this.scene.add.sprite(0, 0, "player", 0);
		this.sprite.setScale(SIZE / this.sprite.width);
		this.add(this.sprite);

		this.heldSprite = this.scene.add
			.sprite(0, -0.3 * SIZE, "gold")
			.setOrigin(0.5, 1.0)
			.setVisible(false);
		this.heldSprite.setScale((0.7 * SIZE) / this.heldSprite.width);
		this.add(this.heldSprite);
	}

	update(time: number, delta: number) {
		const frames = animations[this.action];
		const index = Math.floor(time / 250) % frames.length;
		this.sprite.setFrame(frames[index]);
		this.sprite.setFlipX(!this.facingRight);
	}

	setTileCoord(tileCoord: TileCoord) {
		const { x, y } = TileCoord.tileToCoord(tileCoord);
		this.setPosition(x, y);
		this.tileCoord = tileCoord;
		this.emit("neighbors");
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
		const has = (tiles: Tile[], ...wanted: Tile[]) =>
			wanted.some((tile) => tiles.includes(tile));
		const dx = this.facingRight ? 1 : -1;
		const front = this.facingRight ? east : west;
		const frontUp = this.facingRight ? ne : nw;
		const frontDown = this.facingRight ? se : sw;
		const back = this.facingRight ? west : east;

		if (has(center, "Death", "Wall")) return this.die();

		if (has(center, "Gold") && !this.holding) return this.pickUp();
		if (has(center, "Home") && this.holding) return this.dropOff();

		if (has(center, "Climb")) {
			if (!has(north, "Wall")) {
				return this.climb();
			}
		}

		if (has(center, "Updraft") && !has(north, "Wall")) {
			this.action = Action.Flying;
			if (!has(front, "Wall") && !has(frontUp, "Wall")) {
				return this.move(dx, -1, 400 * 1.4);
			}
			return this.move(0, -1, 400);
		}

		if (has(center, "None", "Platform")) {
			if (!has(south, "Wall", "Platform", "Stairs")) {
				return this.fall();
			}
		}

		if (this.facingRight && has(front, "Stairs")) {
			this.action = Action.Walking;
			this.move(dx, -1, 400 * 1.4);
			return;
		}
		if (!this.facingRight && has(south, "Stairs")) {
			this.action = Action.Walking;
			this.move(dx, 1, 400 * 1.4);
			return;
		}

		if (!has(front, "Wall", "Stairs")) {
			return this.walk(dx);
		} else if (!has(back, "Wall")) {
			this.facingRight = !this.facingRight;
			return this.walk(-dx);
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

	private idle() {
		this.action = Action.Idle;
	}

	private die() {
		this.action = Action.Dead;
	}

	private fall() {
		this.action = Action.Falling;
		this.move(0, 1, 400);
	}

	private walk(deltaTileX: number) {
		this.action = Action.Walking;
		this.move(deltaTileX, 0, 400);
	}

	private climb() {
		this.action = Action.Climbing;
		this.move(0, -1, 800);
	}

	private pickUp() {
		this.action = Action.Collecting;
		this.emit("collect");

		this.scene.tweens.add({
			targets: this,
			y: { from: this.y, to: this.y - 0.5 * SIZE },
			duration: 150,
			easing: Phaser.Math.Easing.Circular.Out,
			yoyo: true,
			repeat: 1,
			onComplete: () => {
				this.setTileCoord(this.tileCoord);
			},
		});
	}

	private dropOff() {
		this.action = Action.Leaving;
		this.emit("collect");

		this.scene.tweens.add({
			targets: this,
			alpha: 0,
			duration: 1000,
		});
	}

	/* Helpers */

	private move(dtx: number, dty: number, duration: number) {
		this.scene.tweens.add({
			targets: this,
			duration,
			x: { from: this.x, to: this.x + dtx * SIZE },
			y: { from: this.y, to: this.y + dty * SIZE },
			onComplete: () => {
				this.setTileCoord(TileCoord.add(this.tileCoord, dtx, dty));
			},
		});
	}
}
