import { app, BrowserWindow, dialog, ipcMain } from "electron";
import chokidar from "chokidar";
import path from "node:path";
import readLastLines from "read-last-lines";
import Store from "electron-store";
import { tradeRequestParse } from "./tradeRequest";
import focusPoeWindow from "./windowsManagement";
import {
	sendMessage,
	invPlayer,
	tellThanks,
	tellWait,
	itemSold,
	tellNeed,
} from "./gameFunc";
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
	? process.env.DIST
	: path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
//

const store = new Store();
const storedChatlogFilePath = store.get("chatlogFilePath");

let chatlogFilePath: string = "";
let tradeReq: { sender: string };

function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	// Test active push message to Renderer-process.
	win.webContents.on("did-finish-load", () => {
		win?.webContents.send(
			"main-process-message",
			new Date().toLocaleString()
		);
	});

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL);
	} else {
		// win.loadFile('dist/index.html')
		win.loadFile(path.join(process.env.DIST, "index.html"));
	}

	//Stored filepath check
	if (storedChatlogFilePath) {
		//Send stored chatlog path to renderer settings.
		chatlogFilePath = storedChatlogFilePath as string;
		ipcMain.handle("get-stored-chatlog-path", () => {
			return chatlogFilePath;
		});

		startChatlogWatcher(chatlogFilePath, win);
	}

	ipcMain.handle("get-stored-chat-responses", async () => {
		let tradeMacroResponses: Record<string, string> | undefined | unknown =
			await store.get("tradeMacroResponses");
		//TODO: Add default/reset option to traderesponses
		if (!tradeMacroResponses) {
			tradeMacroResponses = {
				thank: "Thanks, good luck!",
				wait: "I'll be a minute",
				invite: "Your item is ready to be picked up!",
				need: "Do you still need?",
				sold: "Sorry, it's sold.",
			};
			store.set("tradeMacroResponses", tradeMacroResponses);
		}
		return JSON.stringify(tradeMacroResponses);
	});
	ipcMain.handle("set-trade-response-macros", async (e, res) => {
		const chatMacros = await res;
		store.set("tradeMacroResponses", chatMacros);
	});

	ipcMain.handle("do-macro-actions", (_, action) => {
		switch (action) {
			case "Wait":
				sendMessage(
					focusPoeWindow,
					tradeReq.sender,
					store.get("tradeMacroResponses.wait")
				);
				break;
			case "Sold":
				sendMessage(
					focusPoeWindow,
					tradeReq.sender,
					store.get("tradeMacroResponses.sold")
				);
				break;

			case "Invite":
				invPlayer(
					focusPoeWindow,
					tradeReq.sender,
					store.get("tradeMacroResponses.invite")
				);

				break;

			case "Need":
				sendMessage(
					focusPoeWindow,
					tradeReq.sender,
					store.get("tradeMacroResponses.need")
				);
				break;

			default:
				break;
		}
	});

	function startChatlogWatcher(path: string, win: BrowserWindow | null) {
		const chatlogFileWatcher = chokidar.watch(path);

		chatlogFileWatcher.on("change", async () => {
			try {
				const newTextLine = await readLastLines.read(path, 1);
				const incTradeRequest = await tradeRequestParse(newTextLine);
				if (incTradeRequest !== null) {
					tradeReq = incTradeRequest;
					win?.webContents.send(
						"trade-request-send",
						JSON.stringify(incTradeRequest)
					);
				}
			} catch (error) {
				console.log(error);
				throw error;
			}
		});
	}
	// IPC HANDLING

	ipcMain.handle("set-chatlog-path", async () => {
		// Allow reselection of chatlog path
		const result = await dialog.showOpenDialog({
			properties: ["openFile"],
			filters: [{ name: "Text Files", extensions: ["txt"] }],
		});
		//Handle success
		if (!result.canceled && result.filePaths.length > 0) {
			chatlogFilePath = result.filePaths[0];
			store.set("chatlogFilePath", chatlogFilePath);

			//start the chatlog watcher
			startChatlogWatcher(chatlogFilePath, win);
			//return the chatlog path to renderer
			return chatlogFilePath;
		} else {
			//start the chatlog watcher if no path is selected.
			startChatlogWatcher(chatlogFilePath, win);
		}
	});
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
		win = null;
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.whenReady().then(createWindow);
