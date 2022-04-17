import { API, RequestOptions } from 'api';
import { stringify } from 'querystring';
import { call, put } from 'redux-saga/effects';

import { stakeHistoryData, StakeHistoryFetch } from '../actions';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'stake', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* fetchStakeHistory(action: StakeHistoryFetch) {
	try {
		const { uid, stake_id } = action.payload;
		if (uid && stake_id) {
			const histories = yield call(API.get(createOptions()), `/private/stake/history/staked?${stringify(action.payload)}`);
			yield put(
				stakeHistoryData({
					payload: [...histories],
					loading: false,
				}),
			);
		}
	} catch (error) {
		yield put(
			stakeHistoryData({
				payload: [],
				loading: false,
			}),
		);
	}
}
