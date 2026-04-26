import { getNextLevel, LevelKey, levels } from "@/logic/levels";
import { BaseScene } from "@/scenes/BaseScene";

export class OverworldScene extends BaseScene {
	private prevLevel: LevelKey | undefined;
	private nextLevel: LevelKey;

	constructor() {
		super({ key: "OverworldScene" });
	}

	create({ level }: { level?: LevelKey }) {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x111111);

		this.prevLevel = level;
		this.nextLevel = getNextLevel(level);

		const text = this.addText({
			x: this.CX,
			y: this.CY,
			text: `Up next\n"${levels[this.nextLevel].title}"`,
			size: 64,
		});
		text.setOrigin(0.5);

		this.setupListeners();
		this.addEvent(2000, () => {
			this.startLevel();
		});
	}

	startLevel() {
		this.fade(true, 100, 0x000000);
		this.addEvent(100, () => {
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
