import { create } from "zustand";

interface TradeRequest {
	id: number;
	date: Date;
	time: string;
	sender: string;
	item_name: string;
	price: number;
	currency: string;
	currency_icon: string;
	currency_market_value: number;
	league: string;
	stash_tab: string;
	position: string;
	trade_status: string;
}

interface Name {
	tradeRequests: TradeRequest | null;
	tradeReqArray: TradeRequest[];
	setTradeRequest: (state: TradeRequest) => void;
	setTradeReqArray: (state: TradeRequest[]) => void;
	removeTradeRequest: (id: number) => void;
}

export const useStore = create<Name>((set, get) => ({
	tradeRequests: null,
	tradeReqArray: [],

	setTradeRequest: (state: TradeRequest) =>
		set((prev) => ({
			tradeRequests: state,
			tradeReqArray: [...prev.tradeReqArray, state],
			// tradeReqArray: [...state.tradeReqArray, state.tradeRequests],
		})),
	setTradeReqArray: (trade: TradeRequest[]) => {
		set({ tradeReqArray: [...get().tradeReqArray, ...trade] });
	},
	removeTradeRequest: (id: number) =>
		set((prev) => ({
			tradeReqArray: prev.tradeReqArray.filter(
				(trade) => trade.id !== id
			),
		})),
}));
