import { GameScene } from "@/scenes/GameScene";
import { NeighborTiles, SIZE, TileCoord } from "@/logic/Tile";

enum Action {
	Idle,
	Walking,
	Climbing,
	Falling,
	// Hurt,
	Happy,
	Dead,
}

const animations: { [key in Action]: number[] } = {
	[Action.Idle]: [0, 1],
	[Action.Walking]: [2, 3],
	[Action.Climbing]: [4, 5],
	[Action.Falling]: [6, 7],
	// [Action.Hurt]: [8],
	[Action.Dead]: [9],
	// [Action.Jump]: [10, 11],
	// [Action.Bump]: [12, 13],
	[Action.Happy]: [13],
};

export class Player extends Phaser.GameObjects.Container {
	public scene: GameScene;
	public tileX: number = 0;
	public tileY: number = 0;

	private sprite: Phaser.GameObjects.Sprite;

	private action: Action = Action.Idle;
	private facingRight: boolean = true;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;

		this.sprite = this.scene.add.sprite(0, 0, "player", 0);
		this.add(this.sprite);
	}

	update(time: number, delta: number) {
		const frames = animations[this.action];
		const index = Math.floor(time / 250) % frames.length;
		this.sprite.setFrame(frames[index]);
		this.sprite.setFlipX(!this.facingRight);
	}

	setTile(tileCoord: TileCoord) {
		const { x, y } = TileCoord.tileToCoord(tileCoord);
		this.setPosition(x, y);
		this.tileX = tileCoord.tileX;
		this.tileY = tileCoord.tileY;
		this.emit("neighbors");
	}

	updateAction({ center, up, down, left, right }: NeighborTiles) {
		switch (center) {
			case "Wall":
			case "Death":
				return this.setDeath();
			case "Gold":
				return this.setHappy();
			case "Climb":
				if (up != "Wall" && up != "Platform") {
					return this.setClimb();
				}
			case "Home":
				break;
			case "Platform":
			case "Stairs":
			case "None":
				if (down != "Wall" && down != "Platform") {
					return this.setFall();
				}
		}

		const dir = this.facingRight ? 1 : -1;
		const front = this.facingRight ? right : left;
		const back = this.facingRight ? left : right;

		if (front !== "Wall") {
			return this.setWalk(dir);
		}

		if (back !== "Wall") {
			this.facingRight = !this.facingRight;
			return this.setWalk(-dir);
		}

		return this.setIdle();
	}

	setIdle() {
		this.action = Action.Idle;
	}

	setDeath() {
		this.action = Action.Dead;
	}

	setFall() {
		this.action = Action.Falling;
		this.move(0, 1, 400);
	}

	setWalk(dtx: number) {
		this.action = Action.Walking;
		this.move(dtx, 0, 400);
	}

	setClimb() {
		this.action = Action.Climbing;
		this.move(0, -1, 800);
	}

	setHappy() {
		this.action = Action.Happy;
		this.emit("collect");
	}

	move(dtx: number, dty: number, duration: number = 500) {
		this.scene.tweens.add({
			targets: this,
			duration,
			x: { from: this.x, to: this.x + dtx * SIZE },
			y: { from: this.y, to: this.y + dty * SIZE },
			onComplete: () => {
				this.setTile({ tileX: this.tileX + dtx, tileY: this.tileY + dty });
			},
		});
	}

	get tileCoord(): TileCoord {
		return { tileX: this.tileX, tileY: this.tileY };
	}
}
