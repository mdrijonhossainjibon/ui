import { API, RequestOptions } from 'api';
import { call, put } from 'redux-saga/effects';

import { transactionPriceListData, TransactionPriceListFetch } from '../actions';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'transaction', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* fetchTransactionPriceListSaga(action: TransactionPriceListFetch) {
	try {
		const { currencies } = action.payload;
		console.log(currencies);
		const list = yield call(API.get(createOptions()), `/public/transaction/prices?currency=${currencies.join(',')}`);
		console.log(list);

		yield put(
			transactionPriceListData({
				payload: [...list],
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			transactionPriceListData({
				payload: [],
				loading: false,
			}),
		);
	}
}
