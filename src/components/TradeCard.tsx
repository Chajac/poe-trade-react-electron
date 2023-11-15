import { Button } from "@nextui-org/react";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Divider,
	Image,
} from "@nextui-org/react";
import { db } from "../../db/db";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { useStore } from "../store/store";

import { useEffect, useState } from "react";
import DynamicFontSizingTitles from "./DynamicFontSizingTitles";
import Chart from "./ResponsiveLineChart";
import { calculateAveragePercentageChange } from "../../utilities/calculateAveragePercentageChange";
import { calculateRemainder } from "../../utilities/calculateRemainder";

const tradeButtons = [
	{
		name: "Wait",
	},
	{
		name: "Invite",
	},
	{
		name: "Need",
	},
	{
		name: "Kick",
	},
	{
		name: "Complete",
	},
	{
		name: "Fail",
	},
];

const convertToGraphData = (itemHistory: [number]) => {
	if (!itemHistory || !Array.isArray(itemHistory)) {
		console.log("Invalid or empty itemHistory array.");
		return [];
	}
	const graphData = [
		{
			id: "test",
			data: itemHistory.map((i: number, ind: number) => {
				return {
					x: ind,
					y: i,
				};
			}),
		},
	];
	return graphData;
};

const TradeCard = ({ ...tradeData }) => {
	const [tradeStatus, setTradeStatus] = useState(tradeData.trade_status);
	const { removeTradeRequest } = useStore();

	useEffect(() => {
		setTradeStatus(tradeData.trade_status);
	}, [tradeData.trade_status]);

	const handleClose = (tradeData: { id: number }) => {
		// const getTradeIndex = tradeReqArray.findIndex(
		// 	(trade) => trade.id === tradeData.id
		// );

		// const updatedTradeReqArray = [
		// 	...tradeReqArray.slice(0, getTradeIndex),
		// 	...tradeReqArray.slice(getTradeIndex + 1),
		// ];

		// const updatedTradeReqArray = tradeReqArray.filter(
		// 	(trade) => trade.id !== tradeData.id
		// );
		removeTradeRequest(tradeData.id);
	};

	let remainderCost: number | undefined;
	if (tradeData !== null) {
		remainderCost = calculateRemainder(
			tradeData.price,
			tradeData.currency_market_value
		);
	}
	const handleClick = (action: string) => {
		window.ipcRenderer.handleTradeActions(action);
		console.log(action);

		if (action === "Complete") {
			setTradeStatus((tradeData.trade_status = "success"));
			const tradeId = tradeData.id;
			const changes = { trade_status: "success" };

			db.trades.update(tradeId, changes).then((updated) => {
				if (updated) {
					console.log("Trade status updated to success");
				} else {
					console.log(
						"Trade with ID not found, no updates were made"
					);
				}
			});
		}
		if (action === "Fail") {
			setTradeStatus((tradeData.trade_status = "failure"));
			const tradeId = tradeData.id;
			const changes = { trade_status: "failure" };

			db.trades.update(tradeId, changes).then((updated) => {
				if (updated) {
					console.log("Trade status updated to failure");
				} else {
					console.log(
						"Trade with ID not found, no updates were made"
					);
				}
			});
		}
	};

	const percentChange = calculateAveragePercentageChange(
		tradeData.item_history && Array.isArray(tradeData.item_history)
			? tradeData.item_history
			: []
	);

	return (
		<>
			<div
				className={`mt-4 relative z-0 after:-z-10 before:absolute before:top-2 before:left-0 before:w-full before:h-full transition-all ${
					tradeStatus === "success"
						? "before:bg-green-500"
						: tradeStatus === "failure"
						? "before:bg-red-500"
						: "before:bg-yellow-500"
				}`}
			>
				<Card radius="none" className="max-w-[500px] max-h-[250px]">
					<CardHeader className={`flex gap-5 h-14 bg-gray-950`}>
						<div>
							<Image
								alt="Item Icon"
								height={25}
								radius="sm"
								src={tradeData.item_icon}
								width={25}
							/>
						</div>
						<div className="flex flex-col w-10/12">
							<span className="text-xl">
								{tradeData.item_name
									? tradeData.item_name
									: "Some item name here"}
							</span>
							<span className="text-small text-default-500 text-left">
								@
								{tradeData.sender
									? tradeData.sender
									: "Username "}
							</span>
						</div>
						<Button
							size="sm"
							radius="none"
							onPress={() => handleClose(tradeData)}
						>
							X
						</Button>
					</CardHeader>
					{/* 					<Divider /> */}
					<CardBody className="flex flex-row ">
						<div className="flex flex-col w-3/4">
							<DynamicFontSizingTitles tradeData={tradeData} />

							{/* {tradeData.currency_icon && (
									<Image
										alt="Currency Icon"
										radius="sm"
										src={tradeData.currency_icon}
										width={50}
										className="pt-0"
									/>
								)} */}
							<div
								className={
									tradeData.currency !== "divine"
										? "hidden"
										: "visible"
								}
							>
								{/* {tradeData.currency !== "divine" ? `err` : null} */}
								<span>
									TOTAL: {Math.floor(tradeData.price)}{" "}
									{tradeData.currency
										? tradeData.currency.toUpperCase()
										: "No Currency found"}{" "}
									&{` ${remainderCost} CHAOS`}
								</span>
							</div>
						</div>
						<div className=" w-1/3 flex flex-col ">
							<div className="flex gap-1 text-lg mr-3 justify-end ">
								{percentChange < 0 ? (
									<FaArrowTrendDown className="mt-1.5 fill-red-500" />
								) : (
									<FaArrowTrendUp className="mt-1.5 fill-green-500" />
								)}

								<span
									className={
										percentChange < 0
											? `text-red-500`
											: `text-green-500`
									}
								>
									{`${percentChange}%`}
								</span>
							</div>
							<div className="h-16 w-8/12 self-end">
								<Chart
									data={convertToGraphData(
										tradeData.item_history
									)}
								/>
							</div>
						</div>
					</CardBody>

					<Divider />
					<CardFooter className="gap-4 ">
						{tradeButtons.map((i, key) => {
							return (
								<Button
									className=""
									variant="bordered"
									key={key}
									size="sm"
									radius="none"
									onClick={() => handleClick(i.name)}
								>
									{i.name}
								</Button>
							);
						})}
					</CardFooter>
				</Card>
			</div>
		</>
	);
};

export default TradeCard;
