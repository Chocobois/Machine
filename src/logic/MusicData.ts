const overlap = 2;

const Data = {
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
};

export type MusicKey = keyof typeof Data;
export type MusicDataType = {
	[K in MusicKey]: {
		offset: number;
		bpm: number;
		loop: boolean;
		start: number;
		end: number;
	};
};

export default Data as MusicDataType;
