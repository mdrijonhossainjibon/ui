import { commisionHistoryData, CommisionHistoryFetch } from './../actions';
import { API, RequestOptions } from 'api';
import { alertPush } from 'modules/public/alert';
import { call, put } from 'redux-saga/effects';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'referral', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* commisionHistoryFetch(actions: CommisionHistoryFetch) {
	try {
		const { page, limit } = actions.payload;
		const list = yield call(API.get(createOptions()), `/private/referral/commision/history?page=${page}&limit=${limit}`);
		yield put(
			commisionHistoryData({
				payload: list,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			commisionHistoryData({
				payload: [0, []],
				loading: false,
			}),
		);
		yield put(alertPush({ message: [], code: error.code, type: 'error' }));
	}
}
