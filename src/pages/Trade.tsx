import { useState } from "react";
import { Pagination } from "@nextui-org/react";

import { useStore } from "../store/store";
import TradeCard from "../components/TradeCard";

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

function Trade() {
	const { tradeRequests, tradeReqArray } = useStore();
	const itemsPerPage = 3; // Adjust as needed
	const [currentPage, setCurrentPage] = useState(1);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = tradeReqArray.slice(indexOfFirstItem, indexOfLastItem);

	return (
		<>
			<div className="flex flex-col ml-8 mr-8 justify-center">
				{tradeRequests === null ? (
					<h1 className=" text-2xl font-bold mb-4 align-center">
						No Trade Requests
					</h1>
				) : (
					currentItems.map((trade) => (
						<TradeCard key={trade.id} {...trade} />
					))
				)}
				<Pagination
					className=" self-center mt-2.5"
					total={5}
					initialPage={currentPage}
					onChange={(page) => setCurrentPage(page)}
				></Pagination>
			</div>
		</>
	);
}

export default Trade;
