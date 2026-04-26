import { Image, SpriteSheet, Audio } from "./util";
import { image, sound, music, loadFont, spritesheet } from "./util";

/* Images */
export const images: Image[] = [
	image("blank", "blank.png"),
	image("square", "square.png"),

	// Tileset
	image("texture_walls", "castle/walls.png"),
	image("texture_decoration", "castle/decoration.png"),
	image("texture_colliders", "castle/colliders.png"),

	// UI
	image("ui_bar", "ui/bar.png"),
	image("ui_box", "ui/box.png"),
	image("ui_gold", "ui/gold.png"),
	image("ui_lives", "ui/lives.png"),
	image("ui_wrapup", "ui/wrapup.png"),
	image("ui_retry", "ui/retry.png"),

	// Titlescreen
	image("title_sky", "titlescreen/sky.png"),
	image("title_background", "titlescreen/background.png"),
	image("title_foreground", "titlescreen/foreground.png"),
	image("title_character", "titlescreen/character.png"),
	image("title_logo", "titlescreen/logo.png"),
	image("title_taptoplay", "titlescreen/taptoplay.png"),
];

/* Spritesheets */
export const spritesheets: SpriteSheet[] = [
	// Tilesets
	spritesheet("entities", "castle/entities.png", 16, 16),
	spritesheet("environment", "castle/environment.png", 16, 16),
	spritesheet("home", "castle/home.png", 32, 32),
	spritesheet("chest", "castle/chest.png", 16, 32),
	spritesheet("treasure", "castle/treasure.png", 32, 32),

	// Characters
	spritesheet("kobots_red", "characters/kobots_red.png", 32, 32),
	spritesheet("kobots_yellow", "characters/kobots_yellow.png", 32, 32),
	spritesheet("kobots_green", "characters/kobots_green.png", 32, 32),
	spritesheet("kobots_blue", "characters/kobots_blue.png", 32, 32),
	spritesheet("kobots_violet", "characters/kobots_violet.png", 32, 32),

	// UI
	spritesheet("cursor", "ui/cursor.png", 256, 256),
	spritesheet("speedbuttons", "ui/speedbuttons.png", 16, 16),
];

/* Audios */
export const audios: Audio[] = [
	music("m_main_menu", "title.mp3"),
	music("m_first", "first.mp3"),
	sound("t_rustle", "tree/rustle.mp3", 0.5),
];

/* Fonts */
await loadFont("Game Font", "editundo.ttf");
