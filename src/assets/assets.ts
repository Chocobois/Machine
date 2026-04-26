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
	music("intro", "intro.mp3"),
	music("flykten", "flykten.mp3"),

	sound("t_rustle", "tree/rustle.mp3", 0.5),

	sound("voice_dragn_1", "voice/dragn_1.mp3"),
	sound("voice_dragn_2", "voice/dragn_2.mp3"),
	sound("voice_dragn_3", "voice/dragn_3.mp3"),
	sound("voice_dragn_4", "voice/dragn_4.mp3"),
	sound("voice_dragn_5", "voice/dragn_5.mp3"),
	sound("voice_dragn_6", "voice/dragn_6.mp3"),
	sound("voice_dragn_7", "voice/dragn_7.mp3"),
	sound("voice_dragn_8", "voice/dragn_8.mp3"),
	sound("voice_generic", "voice/generic.mp3"),
	sound("voice_kobl_1", "voice/kobl_1.mp3"),
	sound("voice_kobl_2", "voice/kobl_2.mp3"),
	sound("voice_kobl_3", "voice/kobl_3.mp3"),
	sound("voice_kobl_4", "voice/kobl_4.mp3"),

	sound("ui_title_begin", "ui/title_begin.mp3"),
	sound("ui_buy", "ui/buy.mp3"),
	sound("ui_paper", "ui/paper.mp3"),
	sound("ui_sparkle", "ui/sparkle.mp3"),
	sound("ui_button", "ui/button.mp3"),
	sound("ui_tooltip", "ui/tooltip.mp3"),
	sound("ui_collect", "ui/collect.mp3"),
	sound("tree_rustle", "tree/rustle.mp3"),
	sound("squeak", "placeholder/placeholder_squeak.mp3"),
	sound("capture", "placeholder/placeholder_capture.mp3"),
	sound("scream", "placeholder/placeholder_scream.mp3"),
	sound("fried", "placeholder/placeholder_fried.mp3"),
	sound("explosion", "placeholder/placeholder_explosion.mp3"),
	sound("hit", "placeholder/placeholder_hit.mp3"),
	sound("demolish", "placeholder/placeholder_demolish.mp3"),
];

/* Fonts */
await loadFont("Game Font", "editundo.ttf");
