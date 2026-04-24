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
	image("spikes", "tiles/spikes.png"),

	// UI
	image("item_box", "ui/item_box.png"),
	image("item_cannon", "ui/item_cannon.png"),
	image("item_ladder", "ui/item_ladder.png"),
	image("item_rope", "ui/item_rope.png"),
	image("item_stairs", "ui/item_stairs.png"),
	image("item_fan", "ui/item_fan.png"),
	image("ui_gold", "ui/ui_gold.png"),
	image("ui_lives", "ui/ui_lives.png"),

	// Titlescreen
	image("title_sky", "titlescreen/sky.png"),
	image("title_background", "titlescreen/background.png"),
	image("title_foreground", "titlescreen/foreground.png"),
	image("title_character", "titlescreen/character.png"),
	image("title_logo", "titlescreen/logo.png"),
	image("title_taptoplay", "titlescreen/taptoplay.png")
];

/* Spritesheets */
export const spritesheets: SpriteSheet[] = [
	spritesheet("player", "characters/player.png", 256, 256),
	spritesheet("wall", "tiles/wall.png", 256, 256),
	spritesheet("platform", "tiles/platform.png", 256, 256),
	spritesheet("rope", "tiles/rope.png", 256, 256),
	spritesheet("gold", "tiles/gold.png", 256, 256),

	spritesheet("kobot_red", "characters/kobot_red.png", 32, 32),
	spritesheet("kobot_yellow", "characters/kobot_yellow.png", 32, 32),
	spritesheet("kobot_green", "characters/kobot_green.png", 32, 32),
	spritesheet("kobot_blue", "characters/kobot_blue.png", 32, 32),
	spritesheet("kobot_violet", "characters/kobot_violet.png", 32, 32),
	spritesheet("fan", "tiles/fan.png", 256, 256),
	spritesheet("updraft", "tiles/updraft.png", 256, 256),
];

/* Audios */
export const audios: Audio[] = [
	music("m_main_menu", "title.mp3"),
	music("m_first", "first.mp3"),
	sound("t_rustle", "tree/rustle.mp3", 0.5),
];

/* Fonts */
await loadFont("Game Font", "editundo.ttf");
