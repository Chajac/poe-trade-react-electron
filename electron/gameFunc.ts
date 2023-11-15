import { clipboard } from "electron";
const { keyboard, Key } = require("@nut-tree/nut-js");
keyboard.config.autoDelayMs = 1;

async function enterAndPaste() {
	await keyboard.type(Key.Enter);
	await keyboard.type(Key.LeftControl, Key.V);
	await keyboard.type(Key.Enter);
}

async function sendMessage(
	windowToTop: { (): Promise<void | null>; (): any },
	characterName: string,
	message: unknown
) {
	await windowToTop();
	const string = `@${characterName} ${message}`;
	await clipboard.writeText(string);
	await enterAndPaste();
}

async function invPlayer(windowToTop, characterName: string, message: unknown) {
	await windowToTop();
	const string = `/invite ${characterName} `;
	await clipboard.writeText(string);
	await enterAndPaste();
	const inviteMessage = `@${characterName} ${message}`;
	await clipboard.writeText(inviteMessage);
	await enterAndPaste();
}

async function tellThanks(windowToTop, characterName: string, message: string) {
	await windowToTop();
	const string = `@${characterName} ${message} `;
	await clipboard.writeText(string);
	await enterAndPaste();
}

async function tellWait(
	windowToTop: { (): Promise<void | null>; (): any },
	characterName: string,
	message: unknown
) {
	await windowToTop();
	const string = `@${characterName} ${message}`;
	await clipboard.writeText(string);
	await enterAndPaste();
}

async function tellNeed(windowToTop, characterName: string, message: string) {
	await windowToTop();
	const string = `@${characterName} ${message}`;
	await clipboard.writeText(string);
	await enterAndPaste();
}

async function itemSold(windowToTop, characterName: string, message: string) {
	await windowToTop();
	const string = `@${characterName} ${message}`;
	await clipboard.writeText(string);
	await enterAndPaste();
}

export { invPlayer, tellThanks, tellWait, itemSold, tellNeed, sendMessage };
