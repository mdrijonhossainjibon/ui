import { API, RequestOptions } from 'api';
import { call, put } from 'redux-saga/effects';

import { statisticData, StatisticFetch } from '../actions';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'statistic', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* fetchStatisticSaga(action: StatisticFetch) {
	try {
		const list = yield call(API.get(createOptions()), `/public/statistic/fetch`);

		yield put(
			statisticData({
				payload: list,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			statisticData({
				payload: {
					currencies: 0,
					members: 0,
					markets: 0,
				},
				loading: false,
			}),
		);
	}
}
