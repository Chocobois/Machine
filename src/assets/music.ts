const overlap = 0.0;

export interface MusicData {
	offset: number;
	bpm: number;
	loop: boolean;
	start: number;
	end: number;
}
export const music = {
	flykten: {
		offset: 580 / 44100 - 0.05,
		bpm: 190,
		loop: true,
		start: 446220 / 44100 + overlap,
		end: 5348280 / 44100 + overlap,
	},
	intro: {
		offset: 574 / 44100,
		bpm: 190,
		loop: true,
		start: 580 / 44100 + overlap,
		end: 223400 / 44100 + overlap,
	},
} satisfies Record<string, MusicData>;
export type MusicKey = keyof typeof music;
