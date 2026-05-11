import { getNextLevel, LevelKey, levelKeys, levels } from "@/logic/levels";
import { BaseScene } from "@/scenes/BaseScene";
import { Color } from "@/util/colors";

export class OverworldScene extends BaseScene {
	private nextLevel: LevelKey;

	constructor() {
		super({ key: "OverworldScene" });
	}

	create({
		level,
		restart,
		seek,
	}: {
		level?: LevelKey;
		restart?: boolean;
		seek?: number;
	}) {
		this.fade(false, 200, Color.Zinc950);
		this.cameras.main.setBackgroundColor(Color.Zinc950);

		this.nextLevel = !restart ? getNextLevel(level) : level!;

		const text = this.addText({
			x: this.CX,
			y: this.CY - 50,
			text: `Level ${levelKeys.indexOf(this.nextLevel) + 1}`,
			size: 32,
		});
		text.setOrigin(0.5);

		const title = this.addText({
			x: this.CX,
			y: this.CY,
			text: levels[this.nextLevel].title,
			size: 64,
		});
		title.setOrigin(0.5);

		this.setupListeners();
		this.addEvent(2000, () => {
			this.startLevel();
		});

		// Specific trick from TitleScene -> UIScene
		if (seek) {
			this.events.emit("setSeek", seek);
		}
	}

	startLevel() {
		this.fade(true, 200, Color.Zinc950);
		this.addEvent(200, () => {
			this.scene.start("GameScene", { level: this.nextLevel });
		});
	}

	setupListeners() {
		const ui = this.scene.get("UIScene");

		// ui.events.on("toggleItem", this.onToggleItem, this);

		// this.events.once("shutdown", () => {
		// 	ui.events.off("toggleItem", this.onToggleItem, this);
		// });
	}
}
