import fetchCurrencyList from "./currencyList";
import fetchItemList from "./itemLists";
import { PoeCurrency } from "./interfaces/electronInterfaces";

const regexPattern =
	/(\d{4}\/\d{2}\/\d{2}) (\d{2}:\d{2}:\d{2}) (\d+) .+?@From(?: <[^>]+>)? ([^:]+): Hi, I would like to buy your (.*?) listed for (\d+(\.\d+)?) ([^ ]+) in ([^(]+) \(stash tab "([^"]+)"; position: ([^)]+)\)/;

function escapeRegExp(string: string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters in the search query
}
let curObj: PoeCurrency;

async function mapCurrency() {
	let currencyMap: {
		cur_tradename: string | undefined;
		cur_name: string;
		cur_icon: string | undefined;
		chaos_equivalent?: number;
		receive?: [data: [number], totalChange: number];
	}[] = [];

	try {
		curObj = await fetchCurrencyList();

		currencyMap = curObj.currencyDetails.map(
			(i) =>
				(currencyMap[i] = {
					cur_tradename: i.tradeId,
					cur_name: i.name,
					cur_icon: i.icon,
				})
		);
		currencyMap = currencyMap.map((mappedCurrency) => {
			const matchForMarketValue = curObj.lines.find(
				(l) => l.currencyTypeName === mappedCurrency.cur_name
			);
			if (matchForMarketValue) {
				return {
					...mappedCurrency,
					chaos_equivalent: matchForMarketValue.chaosEquivalent,
					r: matchForMarketValue.receiveSparkLine,
				};
			} else {
				return mappedCurrency;
			}
		});
		return currencyMap;
	} catch (error) {
		console.log(error);
	}
}

export async function tradeRequestParse(text: string) {
	try {
		let currencyMapped;
		let itemsMapped: unknown;
		if (!currencyMapped && !itemsMapped) {
			currencyMapped = await mapCurrency();
			itemsMapped = await fetchItemList();
		}

		const regexResult = text.match(regexPattern);

		if (regexResult && currencyMapped && itemsMapped) {
			const targetCurrency = regexResult[8];
			const matchCurrency = currencyMapped.find(
				(item) => item.cur_tradename === targetCurrency
			);
			const currency_icon = matchCurrency ? matchCurrency.cur_icon : null;

			//Necessary to try match item_icon if it doesn't match exactly. Checks each word and returns the first match, not perfect.
			//Using bestMatch results in sometimes the wrong image/item being returned. Slightly more accurate though.
			const searchForPartialMatch = (searchQuery: string) => {
				const splitQuery = searchQuery.split(/\s|, /);
				const regexPattern = new RegExp(
					splitQuery
						.filter((word) => !word.match(/^\blevel \d+ \d+%\b$/))
						.map((word: string) => `\\b${escapeRegExp(word)}\\b`)
						.join("|"),
					"i"
				);
				return itemsMapped?.filter((item: { item_name: string }) =>
					regexPattern.test(item.item_name)
				);
			};

			const selectBestMatch = (
				matches: Array<{ item_name: string }>,
				searchQuery: string
			) => {
				if (matches.length === 0) {
					return null;
				}

				const mapMatches = matches.map((match) => {
					const matchedWords = match.item_name.split(/\s|, /);
					const queryWords = searchQuery.split(/\s|, /);
					return matchedWords.filter((word) =>
						queryWords.includes(word)
					).length;
				});

				const bestMatchIndex = mapMatches.indexOf(
					Math.max(...mapMatches)
				);

				return matches[bestMatchIndex];
			};

			const itemSearchQuery = regexResult[5];
			const partMatch = searchForPartialMatch(itemSearchQuery);
			const bestMatch = selectBestMatch(partMatch, itemSearchQuery);

			let matchItem = itemsMapped?.find(
				(item: { item_name: string }) =>
					item.item_name === regexResult[5]
			);

			if (matchItem) {
				console.log("match found, ", matchItem);
				return matchItem;
			}

			if (bestMatch) {
				matchItem = bestMatch;
			} else {
				console.log(
					"No matches found, here were partial matches: ",
					partMatch
				);
			}

			const item_icon = matchItem ? matchItem.item_icon : null;

			const tradeRequest = {
				id: regexResult[3],
				date: regexResult[1],
				time: regexResult[2],
				sender: regexResult[4],
				item_name: regexResult[5],
				item_icon: item_icon,
				item_history: matchItem?.item_history,
				item_history_change: matchItem?.item_change,
				item_current_divine: matchItem?.item_divine,
				price: regexResult[6],
				currency: regexResult[8],
				currency_icon: currency_icon,
				currency_market_value: matchCurrency?.chaos_equivalent,
				league: regexResult[9],
				stash_tab: regexResult[10],
				position: regexResult[11],
				trade_status: "pending",
			};

			return tradeRequest;
		}
		return {};
	} catch (error) {
		console.error("Error processing chatlog:", error);
		throw error;
	}
}

module.exports = { tradeRequestParse };
