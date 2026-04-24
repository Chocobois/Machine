import { ItemKey } from "./Item";

export interface InventoryItem {
	itemKey: ItemKey;
	amount: number;
	selected?: boolean;
}

export type Inventory = InventoryItem[];
