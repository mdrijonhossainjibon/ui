import { referralRanksData, ReferralRanksFetch } from './../actions';
import { API, RequestOptions } from 'api';
import { call, put } from 'redux-saga/effects';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'referral', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* referralRanksFetch(actions: ReferralRanksFetch) {
	try {
		const list = yield call(API.get(createOptions()), `/public/referral/ranks/get`);
		yield put(
			referralRanksData({
				payload: list,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			referralRanksData({
				payload: [],
				loading: false,
			}),
		);
	}
}
