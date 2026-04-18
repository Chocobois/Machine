import { GameScene } from "@/scenes/GameScene";
import {
	NeighborTypes,
	SIZE,
	Type,
	TileCoord,
	tileToCoord,
} from "./tiles/Tile";

enum Action {
	Idle,
	Walk,
	Climb,
	Fall,
	Hurt,
	Dead,
	Jump,
	Bump,
}

const animations: { [key in Action]: number[] } = {
	[Action.Idle]: [0, 1],
	[Action.Walk]: [2, 3],
	[Action.Climb]: [4, 5],
	[Action.Fall]: [6, 7],
	[Action.Hurt]: [8],
	[Action.Dead]: [9],
	[Action.Jump]: [10, 11],
	[Action.Bump]: [12, 13],
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
		const { x, y } = tileToCoord(tileCoord);
		this.setPosition(x, y);
		this.tileX = tileCoord.tileX;
		this.tileY = tileCoord.tileY;
		this.emit("neighbors");
	}

	updateAction({ center, up, down, left, right }: NeighborTypes) {
		if (center == Type.Rope) {
			if (up == Type.Rope) {
				return this.setClimb();
			} else {
				return this.setWalk(this.facingRight ? 1 : -1);
			}
		}

		if (down == Type.None) {
			return this.setFall();
		}

		if (this.facingRight) {
			if (right != Type.Wall) {
				return this.setWalk(1);
			} else if (left != Type.Wall) {
				this.facingRight = false;
				return this.setWalk(-1);
			} else {
				return this.setIdle();
			}
		} else {
			if (left != Type.Wall) {
				return this.setWalk(-1);
			} else if (right != Type.Wall) {
				this.facingRight = true;
				return this.setWalk(1);
			} else {
				return this.setIdle();
			}
		}
	}

	setIdle() {
		this.action = Action.Idle;
	}

	setFall() {
		this.action = Action.Fall;
		this.move(0, 1, 400);
	}

	setWalk(dtx: number) {
		this.action = Action.Walk;
		this.move(dtx, 0, 400);
	}

	setClimb() {
		this.action = Action.Climb;
		this.move(0, -1, 800);
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
