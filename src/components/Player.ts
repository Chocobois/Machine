import { GameScene } from "@/scenes/GameScene";
import { NeighborTiles, SIZE, Tile, TileCoord, TileDef } from "@/logic/Tile";
import { GrayScalePostFilter } from "@/pipelines/GrayScalePostFilter";

enum Action {
	Idle,
	Walking,
	Climbing,
	Falling,
	Crashing,
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
	[Action.Crashing]: [10, 11],
	[Action.Dead]: [9],
	[Action.Flying]: [6, 7],
	[Action.Collecting]: [0],
	[Action.Leaving]: [0],
};

export class Player extends Phaser.GameObjects.Container {
	public scene: GameScene;
	public tileCoord: TileCoord;
	public holding: Tile | undefined;

	private sprite: Phaser.GameObjects.Sprite;
	private heldSprite: Phaser.GameObjects.Sprite;
	private explodeSprite: Phaser.GameObjects.Sprite;

	private action: Action = Action.Idle;
	private facingRight: boolean = true;
	private fallSpeed: number = 0;

	private explodePhase: number = 0;

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
		this.heldSprite.setOrigin(0.5, 1 + Math.sin((time / 400 * Math.PI) % Math.PI) * 0.1)

		if(this.action == Action.Dead && this.explodePhase < 990) {
			this.explodePhase += delta;
			this.explodeSprite.setFrame(Math.floor(this.explodePhase / 1000 * 18));
		}
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
		const check = (tiles: Tile[], test: (def: TileDef) => boolean) =>
			tiles.some((tile) => test(TileDef[tile]));

		const dx = this.facingRight ? 1 : -1;
		const front = this.facingRight ? east : west;
		const frontUp = this.facingRight ? ne : nw;
		const frontDown = this.facingRight ? se : sw;
		const back = this.facingRight ? west : east;

		// Fatal tiles
		if (center.includes("Death") || check(center, (d) => d.isSolid)) {
			return this.die();
		}

		// Interactions
		if (center.includes("Gold") && !this.holding) return this.pickUp();
		if (center.includes("Home") && this.readyToLeave) return this.dropOff();

		// Climbing
		if (center.includes("Climb")) {
			if (
				this.action == Action.Climbing &&
				!check(front, (d) => d.isSolid) &&
				check(frontDown, (d) => d.isFloor)
			) {
				// Leave the rope
			} else if (!check(north, (d) => d.isSolid)) {
				this.action = Action.Climbing;
				this.fallSpeed = 0;
				return this.move(0, -1, 800);
			}
		}

		// Zipline
		if (center.includes("Zipline") && front.includes("Zipline")) {
			this.action = Action.Climbing;
			this.fallSpeed = 0;
			return this.move(dx, 0, 800);
		}

		// Updraft
		if (center.includes("Updraft") && !check(north, (d) => d.isSolid)) {
			this.action = Action.Flying;
			this.fallSpeed = 0;
			if (
				!check(front, (d) => d.isSolid) &&
				!check(frontUp, (d) => d.isSolid)
			) {
				return this.move(dx, -1, 400 * 1.4);
			}
			return this.move(0, -1, 400);
		}

		// Gravity
		if (check(center, (d) => !d.isSolid) && !center.includes("Climb")) {
			if (!check(south, (d) => d.isFloor)) {
				return this.fall();
			}
		}

		if (this.fallSpeed > 6) {
			return this.die();
		}

		// Walking
		if (!check(front, (d) => d.isSolid)) {
			return this.walk(dx);
		} else if (!check(back, (d) => d.isSolid)) {
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
		//this.sprite.setPostPipeline(GrayScalePostFilter);
		this.heldSprite.setVisible(false);
		this.explodeSprite.setVisible(true);

		// TODO: Add animation and trigger on end
		this.emit("leave");
	}

	private fall() {
		if (this.action != Action.Falling && this.action != Action.Crashing) this.fallSpeed = 0;
		this.fallSpeed += 1;
		const duration = 500 / (1 + 0.4 * this.fallSpeed);

		if(this.fallSpeed < 6) this.action = Action.Falling;
		else this.action = Action.Crashing;
		this.move(0, 1, duration);
	}

	private walk(deltaTileX: number) {
		this.action = Action.Walking;
		this.move(deltaTileX, 0, 600);
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
		this.emit("leave");

		this.scene.tweens.add({
			targets: this,
			alpha: 0,
			duration: 1000,
		});
	}

	/* Audio */

	yip() {
		const sounds = ["kobot_1", "kobot_2"];
		const key = Phaser.Math.RND.pick(sounds);
		this.emit("sound", key, 1.0);
	}

	/* Helpers */

	private move(dtx: number, dty: number, duration: number) {
		this.scene.tweens.add({
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
