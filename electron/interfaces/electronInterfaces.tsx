export interface Iitem {
	name: string;
	item_name: string;
	item_icon: string;
	icon: string;
	item_change: number;
	change: number;
	item_history: number[];
	history: number[];
	item_divine: number;
	divine: number;
}

export interface IfilteredItems {
	item_name: string;
	item_icon: string;
	item_change: number;
	item_history: number[];
	item_divine: number;
}

export interface PoeCurrency {
	lines: Line[];
	currencyDetails: CurrencyDetail[];
}

export interface CurrencyDetail {
	id: number;
	icon?: string;
	name: string;
	tradeId?: string;
}

export interface ITradeRequest {
	id: number;
	date: Date;
	time: string;
	sender: string;
	item_name: string;
	price: string;
	currency: string;
	currency_icon: string | null | undefined;
	currency_market_value: number;
	league: string;
	stash_tab: string;
	position: string;
	trade_status: string;
	item_icon: string;
}

export interface Line {
	currencyTypeName: string;
	pay?: Pay;
	receive?: Pay;
	paySparkLine: PaySparkLine;
	receiveSparkLine: ReceiveSparkLine;
	chaosEquivalent: number;
	lowConfidencePaySparkLine: PaySparkLine;
	lowConfidenceReceiveSparkLine: ReceiveSparkLine;
	detailsId: string;
}

export interface PaySparkLine {
	data: Array<number | null>;
	totalChange: number;
}

export interface ReceiveSparkLine {
	data: number[];
	totalChange: number;
}

export interface Pay {
	id: number;
	league_id: number;
	pay_currency_id: number;
	get_currency_id: number;
	sample_time_utc: Date;
	count: number;
	value: number;
	data_point_count: number;
	includes_secondary: boolean;
	listing_count: number;
}
