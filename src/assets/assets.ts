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
	spritesheet("kobots_orange", "characters/kobots_orange.png", 32, 32),
	spritesheet("kobots_red", "characters/kobots_red.png", 32, 32),
	spritesheet("kobots_yellow", "characters/kobots_yellow.png", 32, 32),
	spritesheet("kobots_green", "characters/kobots_green.png", 32, 32),
	spritesheet("kobots_blue", "characters/kobots_blue.png", 32, 32),
	spritesheet("kobots_violet", "characters/kobots_violet.png", 32, 32),

	// UI
	spritesheet("cursor", "ui/cursor.png", 256, 256),
	spritesheet("speedbuttons", "ui/speedbuttons.png", 16, 16),

	// VFX
	spritesheet("explosion", "vfx/explosion.png", 200, 256),
];

/* Audios */
export const audios: Audio[] = [
	music("intro", "intro.mp3"),
	music("flykten", "flykten.mp3"),

	sound("creak", "kobot/creak.mp3"),
	sound("doink", "kobot/doink.mp3"),
	sound("fall", "kobot/fall.mp3"),
	sound("fall_lethal", "kobot/fall_lethal.mp3"),
	sound("flail", "kobot/flail.mp3"),
	sound("hurt", "kobot/hurt.mp3"),
	sound("land_hard1", "kobot/land_hard1.mp3"),
	sound("land_hard2", "kobot/land_hard2.mp3"),
	sound("land_hard3", "kobot/land_hard3.mp3"),
	sound("land_med1", "kobot/land_med1.mp3"),
	sound("land_med2", "kobot/land_med2.mp3"),
	sound("land_med3", "kobot/land_med3.mp3"),
	sound("land_soft1", "kobot/land_soft1.mp3"),
	sound("land_soft2", "kobot/land_soft2.mp3"),
	sound("land_soft3", "kobot/land_soft3.mp3"),
	sound("metal_step1", "kobot/metal_step1.mp3"),
	sound("metal_step2", "kobot/metal_step2.mp3"),
	sound("rope", "kobot/rope.mp3"),
	sound("slurp", "kobot/slurp.mp3"),
	sound("squish1", "kobot/squish1.mp3"),
	sound("squish2", "kobot/squish2.mp3"),
	sound("staircase", "kobot/staircase.mp3"),
	sound("yip1", "kobot/yip1.mp3"),
	sound("yip2", "kobot/yip2.mp3"),
	sound("yip3", "kobot/yip3.mp3"),
	sound("yip4", "kobot/yip4.mp3"),

	sound("clank", "machine/clank.mp3"),
	sound("extend", "machine/extend.mp3"),
	sound("fan_off", "machine/fan_off.mp3"),
	sound("fan_on", "machine/fan_on.mp3"),
	sound("poweroff", "machine/poweroff.mp3"),
	sound("press", "machine/press.mp3"),
	sound("reel", "machine/reel.mp3"),
	sound("retract", "machine/retract.mp3"),
	sound("spring", "machine/spring.mp3"),
	sound("toggle1", "machine/toggle1.mp3"),
	sound("toggle2", "machine/toggle2.mp3"),
	sound("toggle3", "machine/toggle3.mp3"),
	sound("toggle4", "machine/toggle4.mp3"),
	sound("vent", "machine/vent.mp3"),

	sound("capture", "placeholder/capture.mp3"),
	sound("demolish", "placeholder/demolish.mp3"),
	sound("explosion", "placeholder/explosion.mp3"),
	sound("fried", "placeholder/fried.mp3"),
	sound("hit", "placeholder/hit.mp3"),
	sound("scream", "placeholder/scream.mp3"),
	sound("squeak", "placeholder/squeak.mp3"),

	sound("cash", "treasure/cash.mp3"),
	sound("chest", "treasure/chest.mp3"),
	sound("collect_generic", "treasure/collect_generic.mp3"),
	sound("gold_pouch", "treasure/gold_pouch.mp3"),
	sound("gold_spill", "treasure/gold_spill.mp3"),
	sound("small", "treasure/small.mp3"),
	sound("sparkle", "treasure/sparkle.mp3"),

	sound("beep", "ui/beep.mp3"),
	sound("beep_high", "ui/beep_high.mp3"),
	sound("beep_low", "ui/beep_low.mp3"),
	sound("button", "ui/button.mp3"),
	sound("buy", "ui/buy.mp3"),
	sound("cant_place", "ui/cant_place.mp3"),
	sound("collect", "ui/collect.mp3"),
	sound("disabled", "ui/disabled.mp3"),
	sound("hover", "ui/hover.mp3"),
	sound("max_length", "ui/max_length.mp3"),
	sound("paper", "ui/paper.mp3"),
	sound("sparkle", "ui/sparkle.mp3"),
	sound("tick", "ui/tick.mp3"),
	sound("title_begin", "ui/title_begin.mp3"),
	sound("tooltip", "ui/tooltip.mp3"),

	sound("dragn_1", "voice/dragn_1.mp3"),
	sound("dragn_2", "voice/dragn_2.mp3"),
	sound("dragn_3", "voice/dragn_3.mp3"),
	sound("dragn_4", "voice/dragn_4.mp3"),
	sound("dragn_5", "voice/dragn_5.mp3"),
	sound("dragn_6", "voice/dragn_6.mp3"),
	sound("dragn_7", "voice/dragn_7.mp3"),
	sound("dragn_8", "voice/dragn_8.mp3"),
	sound("generic", "voice/generic.mp3"),
	sound("kobl_1", "voice/kobl_1.mp3"),
	sound("kobl_2", "voice/kobl_2.mp3"),
	sound("kobl_3", "voice/kobl_3.mp3"),
	sound("kobl_4", "voice/kobl_4.mp3"),
	sound("kobot_1", "voice/kobot_1.mp3"),
	sound("kobot_2", "voice/kobot_2.mp3"),
];

/* Fonts */
await loadFont("Game Font", "editundo.ttf");
