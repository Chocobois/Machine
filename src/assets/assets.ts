import { Image, SpriteSheet, Audio } from "./util";
import { image, sound, music, loadFont, spritesheet } from "./util";

/* Images */
export const images: Image[] = [
	image("blank", "blank.png"),
	image("square", "square.png"),

	// Tileset
	image("texture_walls", "castle/walls_16.png"),
	image("texture_decoration", "castle/decor_16.png"),
	image("texture_colliders", "castle/colliders.png"),

	// Entities
	image("gold", "tiles/gold.png"),
	image("stairs", "tiles/stairs.png"),

	// UI
	image("item_box", "ui/item_box.png"),
	image("item_cannon", "ui/item_cannon.png"),
	image("item_ladder", "ui/item_ladder.png"),
	image("item_rope", "ui/item_rope.png"),
	image("item_stairs", "ui/item_stairs.png"),
	image("item_fan", "ui/item_fan.png"),
	image("item_zipline", "ui/item_zipline.png"),
	image("ui_gold", "ui/ui_gold.png"),
	image("ui_lives", "ui/ui_lives.png"),

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
	spritesheet("entities", "castle/entities_64.png", 64, 64),
	spritesheet("environment", "castle/environment_64.png", 64, 64),

	spritesheet("kobots_red", "characters/kobots_red.png", 32, 32),
	// spritesheet("kobots_yellow", "characters/kobots_yellow.png", 32, 32),
	// spritesheet("kobots_green", "characters/kobots_green.png", 32, 32),
	// spritesheet("kobots_blue", "characters/kobots_blue.png", 32, 32),
	// spritesheet("kobots_violet", "characters/kobots_violet.png", 32, 32),

	spritesheet("cursor", "ui/cursor.png", 256, 256),
];

/* Audios */
export const audios: Audio[] = [
	music("m_main_menu", "title.mp3"),
	music("m_first", "first.mp3"),
	sound("t_rustle", "tree/rustle.mp3", 0.5),
];

/* Fonts */
await loadFont("Game Font", "editundo.ttf");
