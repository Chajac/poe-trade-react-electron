import axios from "axios";
import { Iitem } from "../electron/interfaces/electronInterfaces";

async function fetchItemList() {
	//currency probably not needed; uses poe.ninja one within currencyLists
	const urls: string[] = [
		"https://api.poe.watch/get?category=currency&league=Ancestor",
		"https://api.poe.watch/get?category=armour&league=Ancestor",
		"https://api.poe.watch/get?category=weapon&league=Ancestor",
		"https://api.poe.watch/get?category=accessory&league=Ancestor",
		"https://api.poe.watch/get?category=bases&league=Ancestor",
		"https://api.poe.watch/get?category=beast&league=Ancestor",
		"https://api.poe.watch/get?category=fragment&league=Ancestor",
		"https://api.poe.watch/get?category=essence&league=Ancestor",
		"https://api.poe.watch/get?category=scarab&league=Ancestor",
		"https://api.poe.watch/get?category=flask&league=Ancestor",
		"https://api.poe.watch/get?category=fossil&league=Ancestor",
		"https://api.poe.watch/get?category=gem&league=Ancestor",
		"https://api.poe.watch/get?category=invitation&league=Ancestor",
		"https://api.poe.watch/get?category=jewel&league=Ancestor",
		"https://api.poe.watch/get?category=oil&league=Ancestor",
		"https://api.poe.watch/get?category=map&league=Ancestor",
		"https://api.poe.watch/get?category=sextants&league=Ancestor",
		"https://api.poe.watch/get?category=card&league=Ancestor",
	];

	try {
		return Promise.all(
			urls.map((url) =>
				axios.get<Iitem>(url, {
					headers: {
						"sec-ch-ua":
							'"Microsoft Edge";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
						"sec-ch-ua-mobile": "?0",
						"sec-ch-ua-platform": '"Windows"',
					},
				})
			)
		)
			.then((fetchedLists) => {
				let mergedLists: Iitem[] = [];
				fetchedLists.forEach((itemList) => {
					mergedLists = mergedLists.concat(itemList.data);
				});
				return mergedLists;
			})
			.then((mergedLists) => {
				const filteredData = mergedLists.map(
					(item, ind) =>
						(mergedLists[ind] = {
							item_name: item.name,
							item_icon: item.icon,
							item_change: item.change,
							item_history: item.history,
							item_divine: item.divine,
						})
				);
				return filteredData;
			});
	} catch (error) {
		console.log("Couldnt fetch item data: ", error);
		return [];
	}
}

export default fetchItemList;
