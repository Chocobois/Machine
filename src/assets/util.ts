export interface Image {
	key: string;
	path: string;
}

export interface SpriteSheet {
	key: string;
	path: string;
	width: number;
	height: number;
}

export interface Audio {
	key: string;
	path: string;
	volume?: number;
	rate?: number;
}

export interface TileMap {
	key: string;
	path: string;
}

const imageGlob = import.meta.glob<string>("./images/**/*.png", {
	query: "?url",
	import: "default",
	eager: true,
});
export const image = (key: string, path: string): Image => {
	return { key, path: imageGlob[`./images/${path}`] };
};

export const spritesheet = (
	key: string,
	path: string,
	width: number,
	height: number,
): SpriteSheet => {
	return { key, width, height, path: imageGlob[`./images/${path}`] };
};

const musicGlob = import.meta.glob<string>("./music/**/*.mp3", {
	query: "?url",
	import: "default",
	eager: true,
});
export const music = (
	key: string,
	path: string,
	volume?: number,
	rate?: number,
): Audio => {
	return { key, volume, rate, path: musicGlob[`./music/${path}`] };
};

const audioGlob = import.meta.glob<string>("./sounds/**/*.mp3", {
	query: "?url",
	import: "default",
	eager: true,
});
export const sound = (
	key: string,
	path: string,
	volume?: number,
	rate?: number,
): Audio => {
	return { key, volume, rate, path: audioGlob[`./sounds/${path}`] };
};

const fontGlob = import.meta.glob<string>("./fonts/**/*.ttf", {
	query: "?url",
	import: "default",
	eager: true,
});
export const loadFont = async (key: string, path: string) => {
	const face = new FontFace(key, `url(${fontGlob[`./fonts/${path}`]})`, {
		style: "normal",
		weight: "400",
	});
	await face.load();
	document.fonts.add(face);
};

const tilemapGlob = import.meta.glob<string>("./tiled/**/*.json", {
	query: "?url",
	import: "default",
	eager: true,
});
export const tilemap = (key: string, path: string): TileMap => {
	return { key, path: tilemapGlob[`./tiled/${path}`] };
};
