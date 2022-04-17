import { API, RequestOptions } from 'api';
import { call, put } from 'redux-saga/effects';
import { transactionsListData } from '..';

import { TransactionsListFetch } from '../actions';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'transaction', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* fetchTransactionListSaga(action: TransactionsListFetch) {
	const { limit, page } = action.payload;
	try {
		const list = yield call(API.get(createOptions()), `/public/transaction/list?page=${page}&limit=${limit}`);

		if (list[0] && list[1] && list[2]) {
			yield put(
				transactionsListData({
					payload: [list[0], list[1], list[2]],
					loading: false,
				}),
			);
		}
	} catch (error) {
		yield put(
			transactionsListData({
				payload: [
					{
						totalPage: 0,
						page: page,
						limit: limit,
					},
					[],
					{
						udonTotal: 0,
					},
				],
				loading: false,
			}),
		);
	}
}
