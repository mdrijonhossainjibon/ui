import axios from 'axios';
import { put } from 'redux-saga/effects';

import { GetPrice, priceData, priceError } from '../actions';

const COMPARE_BASE_API_URL = 'https://min-api.cryptocompare.com/data/price';
const API_KEY = '25fc5392e29e67321a0bfb9ff465ea0671c5c3b741266b0e04dc79264efb9ee3';

export function* getPrice(action: GetPrice) {
	const fsym = action.payload.fsym;
	const tsyms = action.payload.tsyms.map(tysm => tysm.toUpperCase()).join(',');
	try {
		const price = yield axios.get(`${COMPARE_BASE_API_URL}?fsym=${fsym}&tsyms=${tsyms.toUpperCase()}&api_key=${API_KEY}`);
		const keys = Object.keys(price.data);
		// tslint:disable-next-line: ban
		keys.forEach(key => {
			price.data.key = String(price.data.key).toUpperCase();
			price.data[key] = Number(price.data[key]);
		});
		let newPrice = { ...price.data };
		// const cxPrice = yield axios.get('https://demo.zozitech.com/api/v2/udonex/public/markets/cxusdt/tickers');

		newPrice = {
			...newPrice,
			// KOBE: Number(kobePrice.data.ticker.last),
			// ESC: Number(escPrice.data.ticker.last),
			// SWP: Number(swpPrice.data.ticker.last),
			//CX: Number(cxPrice.data.ticker.last),
		};
		yield put(
			priceData({
				payload: {
					...newPrice,
				},
				loading: false,
			}),
		);
	} catch (error) {
		yield put(priceError(error));
	}
}
