import React, { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSackDollar, FaReceipt, FaGear } from "react-icons/fa6";
import { useStore } from "../store/store";
import { db } from "../../db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { ISideBar } from "../interfaces/Interfaces";

const sidebarItems = [
	{
		text: "Trade",
		icon: <FaSackDollar size="32" />,
		route: "trade",
	},
	{
		text: "History",
		icon: <FaReceipt size="32" />,
		route: "history",
	},
	{
		text: "Settings",
		icon: <FaGear size="32" />,
		route: "settings",
	},
];

const matchDbIds = async (db, db2): Promise<string[] | null> => {
	const db1ids = db.map((i: { id: string }) => i.id);
	const db2ids = db2.map((i: { id: string }) => i.id);
	if (!db2ids) return null;

	const matchIds = db2ids.filter((id: string) => db1ids.includes(id));

	return matchIds;
};

const Sidebar = () => {
	const [pendingTrades, setPendingTrades] = useState(0);
	const [isExpanded, setExpanded] = useState(false);
	const [activeElement, setActiveElement] = useState<string | null>(null);
	const { tradeReqArray } = useStore();

	const toggleSidebar = () => {
		setExpanded(!isExpanded);
	};
	const handleElementClick = (route: React.SetStateAction<string | null>) => {
		setActiveElement(route);
	};

	const tradeDb = useLiveQuery(() => db.trades.toArray());
	const tradeDb2 = useLiveQuery(() => db.trades);

	useEffect(() => {
		const fetchPendingTrades = async () => {
			const matchedSessionToDbId = await matchDbIds(
				tradeReqArray,
				tradeDb
			);

			const matchedTrades = await tradeDb2
				?.where("id")
				.anyOf(matchedSessionToDbId)
				.and((trade) => trade.trade_status === "pending")
				.count();

			if (matchedTrades === undefined) {
				return null;
			} else {
				setPendingTrades(matchedTrades);
			}
		};
		fetchPendingTrades();
		console.log(pendingTrades);
	}, [pendingTrades, tradeDb, tradeDb2, tradeReqArray]);

	if (!tradeDb || tradeDb === undefined) {
		return null;
	}

	return (
		<nav
			className={`flex top-0 left-0 h-screen m- flex-col text-white shadow-lg bg-gray-950 `}
		>
			<div
				className={`sidebar-container flex flex-col transition-all ${
					isExpanded ? "w-44 pl-4" : "w-14 pl-0"
				}`}
			>
				<button className="text-white p-4" onClick={toggleSidebar}>
					X
				</button>
				{sidebarItems.map((item) => (
					<SideBarIcon
						key={item.route}
						text={item.text}
						icon={item.icon}
						route={item.route}
						pendingTrades={pendingTrades}
						isExpanded={isExpanded}
						isActive={activeElement === item.route}
						onClick={() => handleElementClick(item.route)}
					/>
				))}
			</div>
		</nav>
	);
};

const SideBarIcon = ({
	icon,
	text,
	route,
	pendingTrades,
	isExpanded,
	isActive,
	onClick,
}: ISideBar) => {
	const [shouldAnimate, setShouldAnimate] = useState(false);

	useEffect(() => {
		// Trigger the ping animation when pendingTrades updates
		if (pendingTrades > 0) {
			setShouldAnimate(true);

			// Set shouldPing back to false after a short delay (adjust as needed)
			const timeoutId = setTimeout(() => {
				setShouldAnimate(false);
			}, 1000); // 1000 milliseconds = 1 second

			// Clear the timeout when the component unmounts or when pendingTrades updates again
			return () => clearTimeout(timeoutId);
		}
	}, [pendingTrades]);
	return (
		<div>
			<Link to={"/" + route}>
				<div
					className={`sidebar-icon w-full group flex-col pt-2 items-center transition-all ${
						isActive ? "bg-gray-800 text-green-500" : "bg-gray-950 "
					}
						`}
					onClick={onClick}
				>
					<div>
						<span>{icon}</span>
					</div>
					<div>
						<span className="text-xs">{text}</span>
					</div>
					{route === "trade" && pendingTrades > 0 && (
						<div
							className={`absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs ${
								shouldAnimate ? "animate-bounce" : ""
							}`}
						>
							{pendingTrades}
						</div>
					)}
					{/* {isExpanded ? (
							<span className="mr-1 ml-1">{text}</span>
						) : null} */}

					{/* <span
						className={`sidebar-tooltip group-hover:scale-100 ${
							isExpanded ? "hidden" : "flex"
						}`}
					>
						{text}
					</span> */}
				</div>
			</Link>
		</div>
	);
};

export default Sidebar;
