import { Image, SpriteSheet, Audio } from "./util";
import { image, sound, music, loadFont, spritesheet } from "./util";

/* Images */
const images: Image[] = [
	// Tiles
	image("blank", "blank.png"),
	image("square", "square.png"),

	// Titlescreen
	image("title_sky", "titlescreen/sky.png"),
	image("title_background", "titlescreen/background.png"),
	image("title_foreground", "titlescreen/foreground.png"),
	image("title_character", "titlescreen/character.png"),
];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [
	spritesheet("player", "characters/player.png", 256, 256),
	spritesheet("wall", "tiles/wall.png", 256, 256),
	spritesheet("platform", "tiles/platform.png", 256, 256),
	spritesheet("rope", "tiles/rope.png", 256, 256),
	spritesheet("gold", "tiles/gold.png", 256, 256),

	spritesheet("walls", "castle/walls_128.png", 128, 128),
	spritesheet("decor", "castle/decor_128.png", 128, 128),
];

/* Audios */
const audios: Audio[] = [
	music("m_main_menu", "title.mp3"),
	music("m_first", "first.mp3"),
	sound("t_rustle", "tree/rustle.mp3", 0.5),
];

/* Fonts */
await loadFont("Game Font", "DynaPuff-Medium.ttf");

export { images, spritesheets, audios };
