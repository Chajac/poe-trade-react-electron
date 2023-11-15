import { ReactNode } from "react";

export interface TradeRequest {
	date: string;
	time: string;
	id: number;
	sender: string;
	item_name: string;
	item_icon: string;
	item_history: [number];
	price: number;
	currency: string;
	currency_icon: string;
	currency_market_value: number;
	league: string;
	stash_tab: string;
	position: string;
	trade_status: string;
}

export interface ITradeResponses {
	thank: string;
	invite: string;
	wait: string;
	need: string;
	sold: string;
}

export interface ISideBar {
	icon: JSX.Element;
	text: string;
	route: string;
	pendingTrades: number;
	isExpanded: boolean;
	children?: ReactNode;
	isActive: boolean | null;
	onClick: () => void;
}
