import { API, RequestOptions } from 'api';
import { stringify } from 'querystring';
import { call, put } from 'redux-saga/effects';

import { unStakeHistoryData, UnStakeHistoryFetch } from '../actions';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'stake', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* fetchUnStakeHistory(action: UnStakeHistoryFetch) {
	try {
		const { uid, currency_id } = action.payload;
		if (uid && currency_id) {
			const histories = yield call(
				API.get(createOptions()),
				`/private/stake/history/unstaked?${stringify(action.payload)}`,
			);

			yield put(
				unStakeHistoryData({
					payload: [...histories],
					loading: false,
				}),
			);
		}
	} catch (error) {
		yield put(
			unStakeHistoryData({
				payload: [],
				loading: false,
			}),
		);
	}
}
