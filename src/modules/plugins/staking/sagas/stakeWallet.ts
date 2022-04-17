import { API, RequestOptions } from 'api';
import { stringify } from 'querystring';
import { call, put } from 'redux-saga/effects';

import { stakeWalletData, StakeWalletFetch } from '../actions';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'stake', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* fetchStakeWallet(action: StakeWalletFetch) {
	try {
		const { uid } = action.payload;
		if (uid) {
			const wallets = yield call(API.get(createOptions()), `/private/stake/accounts?${stringify(action.payload)}`);
			yield put(
				stakeWalletData({
					payload: [...wallets],
					loading: false,
				}),
			);
		} else {
			yield put(
				stakeWalletData({
					payload: [],
					loading: false,
				}),
			);
		}
	} catch (error) {
		yield put(
			stakeWalletData({
				payload: [],
				loading: false,
			}),
		);
	}
}
