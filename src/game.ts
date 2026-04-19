import Phaser from "phaser";
import { PreloadScene } from "@/scenes/PreloadScene";
import { TitleScene } from "@/scenes/TitleScene";
import { GameScene } from "@/scenes/GameScene";
import { UIScene } from "@/scenes/UIScene";
import OutlinePipelinePlugin from "phaser3-rex-plugins/plugins/outlinepipeline-plugin.js";
import { configure } from "mobx";

configure({
	enforceActions: "never",
});

export async function Game() {
	const config: Phaser.Types.Core.GameConfig = {
		type: Phaser.WEBGL,
		width: 1280,
		height: 960,
		// mipmapFilter: "NEAREST_MIPMAP_NEAREST",
		mipmapFilter: "LINEAR_MIPMAP_LINEAR",
		// roundPixels: false,
		// pixelArt: true,
		scale: {
			mode: Phaser.Scale.FIT,
		},
		scene: [PreloadScene, TitleScene, GameScene, UIScene],

		plugins: {
			global: [
				{
					key: "rexOutlinePipeline",
					plugin: OutlinePipelinePlugin,
					start: true,
				},
			],
		},
	};

	const game = new Phaser.Game(config);
}
