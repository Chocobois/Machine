import { Image, SpriteSheet, Audio, TileMap, tilemap } from "./util";
import { image, sound, music, loadFont, spritesheet } from "./util";

/* Images */
export const images: Image[] = [
	image("blank", "blank.png"),
	image("square", "square.png"),

	// Tileset
	image("walls", "castle/walls_16.png"),
	image("decor", "castle/decor_16.png"),
	image("colliders", "castle/colliders.png"),

	// Titlescreen
	image("title_sky", "titlescreen/sky.png"),
	image("title_background", "titlescreen/background.png"),
	image("title_foreground", "titlescreen/foreground.png"),
	image("title_character", "titlescreen/character.png"),
];

/* Spritesheets */
export const spritesheets: SpriteSheet[] = [
	spritesheet("player", "characters/player.png", 256, 256),
	spritesheet("wall", "tiles/wall.png", 256, 256),
	spritesheet("platform", "tiles/platform.png", 256, 256),
	spritesheet("rope", "tiles/rope.png", 256, 256),
	spritesheet("gold", "tiles/gold.png", 256, 256),
];

/* Audios */
export const audios: Audio[] = [
	music("m_main_menu", "title.mp3"),
	music("m_first", "first.mp3"),
	sound("t_rustle", "tree/rustle.mp3", 0.5),
];

/* Tilemaps */
export const tilemaps: TileMap[] = [tilemap("level1", "maps/level1.json")];

/* Fonts */
await loadFont("Game Font", "DynaPuff-Medium.ttf");
