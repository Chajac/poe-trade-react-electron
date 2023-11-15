import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { ITradeResponses } from "../interfaces/Interfaces";

const Settings = () => {
	const initTradeResponses: ITradeResponses = {
		thank: "Thanks, good luck!",
		wait: "I'll be a minute",
		invite: "Your item is ready to be picked up!",
		need: "Do you still need?",
		sold: "Sorry, it's sold.",
	};

	//TODO: Add default/reset option to traderesponses
	const [filePath, setFilePath] = useState("");
	const [tradeResponses, setTradeResponses] = useState({});

	const getStoredChatMacros = async () => {
		const storedResponses =
			await window.ipcRenderer.getStoredChatResponses();
		setTradeResponses(JSON.parse(storedResponses));
	};

	if (Object.keys(tradeResponses).length === 0) {
		getStoredChatMacros();
	}

	const handleFilePicker = async () => {
		try {
			const path = await window.ipcRenderer.setChatlogPath();
			if (path) {
				const localPath = path.replace(/\\/g, "/");
				setFilePath(localPath);
			} else {
				console.log("file selection canceled.");
			}
		} catch (error) {
			console.error("Error opening file:", error);
		}
	};

	//needs to be curried to prevent infinite loop.
	const handleResponseChange =
		(key: keyof ITradeResponses) =>
		(event: { target: { value: string } }) => {
			const newResponseValue = event.target.value;

			if (newResponseValue === "") {
				setTradeResponses((tradeResponses) => ({
					...tradeResponses,
					[key]: initTradeResponses[key],
				}));
			} else {
				setTradeResponses((tradeResponses) => ({
					...tradeResponses,
					[key]: newResponseValue,
				}));
			}
		};

	const handleResponseSet = (tradeResponses: ITradeResponses) => {
		window.ipcRenderer.setChatResponses(tradeResponses);
	};

	useEffect(() => {
		const fetchData = async () => {
			const storedChatlogPath =
				await window.ipcRenderer.getStoredChatlogPath();
			if (storedChatlogPath) {
				setFilePath(storedChatlogPath);
			}
		};
		fetchData();
	}, []);

	return (
		<div className="max-w-md mx-auto p-4 rounded-md shadow-md text-center">
			<h1 className="text-2xl font-bold mb-4 align-center">Settings</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
				<Button onClick={handleFilePicker}>Get Chatlog Filepath</Button>
				<Input
					type="text"
					label="File path"
					isReadOnly={true}
					placeholder="Please fetch your chatlog.txt"
					value={filePath}
				/>
			</div>
			<div className="mt-4">
				<h1 className="text-1xl font-bold mb-4 align-center">
					Set trade responses
				</h1>
				{Object.entries(tradeResponses).map(([key, value]) => (
					<div className="flex mb-2" key={key}>
						<Input
							type="text"
							isClearable
							key={key}
							placeholder={
								initTradeResponses[
									key as keyof ITradeResponses
								] as string
							}
							value={value}
							onClear={() =>
								handleResponseChange(
									key as keyof ITradeResponses
								)({ target: { value: "" } })
							}
							onChange={handleResponseChange(
								key as keyof ITradeResponses
							)}
						/>
						<Button
							className="ml-2"
							onClick={() =>
								handleResponseSet(
									tradeResponses as ITradeResponses
								)
							}
						>
							Set
						</Button>
					</div>
				))}
			</div>
		</div>
	);
};

export default Settings;
