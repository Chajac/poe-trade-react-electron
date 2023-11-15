import Dexie, { Table } from "dexie";
import { TradeRequest } from "../src/pages/Trade";

export class MySubClassedDexie extends Dexie {
	trades!: Table<TradeRequest>;

	constructor() {
		super("tradeRequestsStore");
		this.version(1).stores({
			trades: `id,
            date,
            time,
            sender,
            item_name,
            item_icon,
            item_history,
            item_history_change,
            item_current_divine,
            price,
            currency,
            currency_icon,
            currency_market_value,
            league,
            stash_tab,
            position,
            trade_status`,
		});
	}
}

export const db = new MySubClassedDexie();
