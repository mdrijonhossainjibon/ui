import { call, put } from 'redux-saga/effects';
import { alertPush } from './../../../public/alert/actions';
import { stakeHistoryFetch, stakingListFetch } from './../actions';

import { CreateStake, createStakeData } from '../actions';
import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'stake', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* createStakeSaga(action: CreateStake) {
	try {
		const { uid, stake_id } = action.payload;
		const result = yield call(API.post(createOptions(getCsrfToken())), `/private/stake/register`, action.payload);
		if (result.error) {
			throw new Error(result.error);
		}
		yield put(stakingListFetch());
		yield put(stakeHistoryFetch({ uid: uid, stake_id: stake_id }));
		yield put(alertPush({ message: ['create.stake.success'], type: 'success' }));
	} catch (error) {
		yield put(alertPush({ message: [error.message], type: 'error' }));
	}
	yield put(
		createStakeData({
			loading: false,
		}),
	);
}
