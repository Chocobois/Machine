import { SIZE } from "@/components/tiles/Tile";
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
	spritesheet("player", "characters/player.png", SIZE, SIZE),
	spritesheet("wall", "tiles/wall.png", SIZE, SIZE),
	spritesheet("platform", "tiles/platform.png", SIZE, SIZE),
	spritesheet("rope", "tiles/rope.png", SIZE, SIZE),
	spritesheet("gold", "tiles/gold.png", SIZE, SIZE),
	
	spritesheet("tileset", "tiles/tilekit_castle_dual.png", 16, 16),
];

/* Audios */
const audios: Audio[] = [
	music("m_main_menu", "title.mp3"),
	music("m_first", "first.mp3"),
	sound("t_rustle", "tree/rustle.mp3", 0.5),
];

/* Fonts */
await loadFont("Game Font", "Sketch.ttf");

export { images, spritesheets, audios };
