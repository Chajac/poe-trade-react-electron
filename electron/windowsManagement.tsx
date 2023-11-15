const { windowManager } = require("node-window-manager");

async function getPoeWindow() {
	try {
		//Get all windows
		const openWins = await windowManager.getWindows();
		// const poeWindow = "PathOfExile_x64Steam.exe" || "PathOfExileSteam.exe";
		const poeWindow = "PathOfExile";
		//Search the array for PoE executable and find non-strict
		const result = openWins.findIndex((item: { path: string }) => {
			return item.path.includes(poeWindow);
		});
		if (result === undefined) {
			return;
		}
		const poeWin = openWins[result];
		return poeWin;
	} catch {
		console.log("PoE is not open");
	}
}

async function focusPoeWindow() {
	const poeWindow = await getPoeWindow();
	const activeWindow = await windowManager.getActiveWindow();
	try {
		if (poeWindow === undefined) {
			return console.log("no POE instance active");
		}
		if (activeWindow === poeWindow) {
			return null;
		}
		poeWindow.bringToTop(poeWindow);
	} catch (error) {
		console.log(error);
	}
}

export default focusPoeWindow;
