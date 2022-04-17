import { call, put } from 'redux-saga/effects';
import { alertPush } from './../../../public/alert/actions';
import { stakeWalletFetch, unStakeHistoryFetch } from './../actions';

import { unStakeData, UnstakePost } from '../actions';
import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'stake', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* unstakeSaga(action: UnstakePost) {
	try {
		const { uid, currency_id, amount } = action.payload;
		const unstake_data = {
			uid,
			currency_id,
			amount,
		};
		const result = yield call(API.post(createOptions(getCsrfToken())), `/private/stake/unstake`, unstake_data);
		if (result.error) {
			throw new Error(result.error);
		}
		yield put(unStakeHistoryFetch({ uid: uid, currency_id: currency_id }));
		yield put(
			stakeWalletFetch({
				uid: uid,
			}),
		);
		yield put(alertPush({ message: ['unstake.success'], type: 'success' }));
	} catch (error) {
		yield put(alertPush({ message: [error.message], type: 'error' }));
	}
	yield put(
		unStakeData({
			loading: false,
		}),
	);
}
