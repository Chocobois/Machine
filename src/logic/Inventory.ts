/* Item definitions */

export const items = {
	Rope: { name: "Rope", image: "item_rope" },
	Ladder: { name: "Ladder", image: "item_ladder" },
	Cannon: { name: "Cannon", image: "item_cannon" },
} as const;

export type Item = (typeof items)[keyof typeof items];
export type ItemKey = keyof typeof items;

/* Player inventory */

export interface InventoryItem {
	item: Item;
	amount: number;
}

export type Inventory = InventoryItem[];
