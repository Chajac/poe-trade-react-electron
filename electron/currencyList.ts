import axios from "axios";

async function fetchCurrencyList() {
	const url = `https://poe.ninja/api/data/currencyoverview?league=Ancestor&type=Currency`;
	return axios
		.get(url, {
			headers: {
				"sec-ch-ua":
					'"Microsoft Edge";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"Windows"',
			},
		})
		.then((res) => {
			return res.data;
		})
		.catch((err) => console.log(err));
}

export default fetchCurrencyList;
