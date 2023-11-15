import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useStore } from "../store/store";
import { useEffect } from "react";
import { db } from "../../db/db";

export default function Root() {
	//handle incoming trade requests to set in Zustrand
	const { setTradeRequest, setTradeReqArray } = useStore();

	useEffect(() => {
		const handleTradeRequest = (data: string) => {
			// Handle the trade request data here
			try {
				const parseData = JSON.parse(data);
				setTradeRequest(parseData);
				db.trades.add(parseData);
			} catch (error) {
				console.error("Error parsing JSON:", error);
				throw error;
			}
		};
		// Add the event listener
		window.ipcRenderer.receiveTradeRequest(
			"trade-request-send",
			handleTradeRequest
		);
		// Remove the event listener when the component unmounts
		return () => {
			window.ipcRenderer.removeTradeRequestListener(
				"trade-request-send",
				handleTradeRequest
			);
		};
	}, [setTradeReqArray, setTradeRequest]);

	return (
		<>
			<div className="dark">
				<div className="flex ">
					<Sidebar />
					<div id="detail">
						<Outlet />
					</div>
				</div>
			</div>
		</>
	);
}
