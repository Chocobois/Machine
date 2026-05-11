import { audios } from "./assets";

export interface Sound {
	key: string | string[];
	volume?: number;
	rate?: number | [number, number];
}
export const sounds = {
	creak: { key: "creak", volume: 0.5 },
	doink: { key: "doink" },
	fall: { key: "fall" },
	fall_lethal: { key: "fall_lethal" },
	flail: { key: "flail", volume: 0.6 },
	hurt: { key: "hurt" },
	land_soft: {
		key: ["land_soft1", "land_soft2", "land_soft3"],
		volume: 0.3,
		rate: [0.9, 1.1],
	},
	land_med: {
		key: ["land_med1", "land_med2", "land_med3"],
		volume: 0.2,
		rate: [0.9, 1.1],
	},
	land_hard: {
		key: ["land_hard1", "land_hard2", "land_hard3"],
		volume: 0.15,
		rate: [0.9, 1.1],
	},
	metal_step: {
		key: ["metal_step1", "metal_step2"],
		volume: 0.08,
		rate: [1, 1.1],
	},
	rope: { key: "rope", volume: 0.6 },
	slurp: { key: "slurp" },
	squish1: { key: "squish1", volume: 1.0 },
	squish2: { key: "squish2", volume: 1.0 },
	staircase: { key: "staircase", volume: 1.5 },

	clank: { key: "clank", volume: 0.6, rate: [0.9, 1.1] },
	extend: { key: "extend", volume: 0.8, rate: [0.9, 1.1] },
	fan_on: { key: "fan_on", rate: 0.7, volume: 0.8 },
	fan_off: { key: "fan_off", rate: 0.7, volume: 0.8 },
	poweroff: { key: "poweroff" },
	press: { key: "press" },
	reel: { key: "reel", volume: 0.8 },
	retract: { key: "retract", volume: 0.8 },
	spring: { key: "spring" },
	toggle1: { key: "toggle1", volume: 0.25 },
	toggle2: { key: "toggle2", volume: 0.25 },
	toggle3: { key: "toggle3", volume: 0.4 },
	toggle4: { key: "toggle4", volume: 0.4 },
	vent: { key: "vent", volume: 0.8 },

	capture: { key: "capture" },
	demolish: { key: "demolish" },
	explosion: { key: "explosion" },
	fried: { key: "fried" },
	hit: { key: "hit" },
	scream: { key: "scream" },
	squeak: { key: "squeak" },

	chest: { key: "chest", volume: 0.8 },
	collect_generic: { key: "collect_generic" },
	gold_pouch: { key: "gold_pouch" },
	gold_spill: { key: "gold_spill" },
	small: { key: "small" },
	sparkle: { key: "sparkle", volume: 1.0 },

	beep: { key: "beep" },
	beep_high: { key: "beep_high" },
	beep_low: { key: "beep_low" },
	button: { key: "button" },
	buy: { key: "buy" },
	cant_place: { key: "cant_place" },
	collect: { key: "collect" },
	disabled: { key: "disabled" },
	hover: { key: "hover" },
	max_length: { key: "max_length" },
	paper: { key: "paper" },
	ui_sparkle: { key: "sparkle" },
	tick: { key: "tick" },
	title_begin: { key: "title_begin" },
	tooltip: { key: "tooltip" },

	dragon: {
		key: [
			"dragn_1",
			"dragn_2",
			"dragn_3",
			"dragn_4",
			"dragn_5",
			"dragn_6",
			"dragn_7",
			"dragn_8",
		],
		volume: 1,
		rate: 1.0,
	},
	generic: { key: "generic" },
	yip: {
		key: [
			"kobl_1",
			"kobl_2",
			"kobl_3",
			"kobl_4",
			// "yip1",
			// "yip2",
			// "yip3",
			// "yip4",
			"kobot_1",
			"kobot_2",
		],
		volume: 0.3,
		rate: [0.95, 1.05],
	},
	explode: { key: "explode", volume: 0.4 },
} satisfies Record<string, Sound>;
export type SoundKey = keyof typeof sounds;

/* Validate sounds */

const loadedKeys = new Set(audios.map((a) => a.key));
Object.entries(sounds).forEach(([soundName, config]) => {
	const keysToVerify = Array.isArray(config.key) ? config.key : [config.key];
	keysToVerify.forEach((key) => {
		if (!loadedKeys.has(key)) {
			console.error(
				`Sound "${soundName}" requires key "${key}" which cannot be found in audios`,
			);
		}
	});
});
