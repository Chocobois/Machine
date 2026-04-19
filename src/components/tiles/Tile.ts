import { GameScene } from "@/scenes/GameScene";

export enum Type {
	None,
	Wall,
	Platform,
	Rope,
	Climb,
	Gold,
	Home,
	Death,
}

export type TileCoord = { tileX: number; tileY: number };

export type NeighborTiles = {
	center: BaseTile | undefined;
	up: BaseTile | undefined;
	down: BaseTile | undefined;
	left: BaseTile | undefined;
	right: BaseTile | undefined;
};

export type NeighborTypes = {
	center: Type;
	up: Type;
	down: Type;
	left: Type;
	right: Type;
};

export const SIZE = 256;

export function coordToTile(coord: Phaser.Types.Math.Vector2Like): TileCoord {
	return {
		tileX: Math.floor(coord.x / SIZE),
		tileY: Math.floor(coord.y / SIZE),
	};
}

export function tileToCoord({ tileX, tileY }: TileCoord): Phaser.Math.Vector2 {
	return new Phaser.Math.Vector2(
		tileX * SIZE + SIZE / 2,
		tileY * SIZE + SIZE / 2,
	);
}

export abstract class BaseTile extends Phaser.GameObjects.Container {
	public scene: GameScene;
	public tile: Type = Type.None;
	public tileX: number = 0;
	public tileY: number = 0;

	protected sprite: Phaser.GameObjects.Sprite;

	constructor(scene: GameScene, tileX: number, tileY: number) {
		const { x, y } = tileToCoord({ tileX, tileY });
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.tileX = tileX;
		this.tileY = tileY;

		this.sprite = this.scene.add.sprite(0, 0, "blank", 0);
		this.add(this.sprite);
	}

	update(time: number, delta: number) {}

	abstract updateSprite(neighbors: NeighborTypes): void;

	get tileCoord(): TileCoord {
		return { tileX: this.tileX, tileY: this.tileY };
	}
}
