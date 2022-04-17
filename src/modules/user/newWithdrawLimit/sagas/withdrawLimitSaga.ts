// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { WithdrawLimitChecking, withdrawLimitCheckingResponse, WithdrawLimitFetchRemains, withdrawLimitRemainsData } from '..';
import { API, RequestOptions } from 'api';
import { alertPush } from '../../../public/alert';
import { getCsrfToken } from 'helpers';
import { toNumber } from 'lodash';
const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'withdrawLimit', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* withdrawLimitRemainsSaga(action: WithdrawLimitFetchRemains) {
	try {
		const { currency_id } = action.payload;
		const { remains, limit } = yield call(
			API.get(createOptions(getCsrfToken())),
			`/private/withdrawLimit/remains/currency_id=${currency_id}`,
		);
		yield put(
			withdrawLimitRemainsData({
				remains: toNumber(remains),
				limit: toNumber(limit),
			}),
		);
		// yield put(alertPush({ message: ['success.withdraw.action'], type: 'success' }));
	} catch (error) {
		yield put(
			withdrawLimitRemainsData({
				remains: 0,
				limit: 0,
			}),
		);
		yield put(alertPush({ message: [], code: error.code, type: 'error' }));
	}
}

export function* withdrawLimitCheckingSaga(action: WithdrawLimitChecking) {
	try {
		console.log('log run saga', action.payload);

		const {
			isEnough,
			message,
		}: {
			isEnough: boolean;
			message: string;
		} = yield call(API.post(createOptions(getCsrfToken())), `/private/withdrawLimit/checking`, action.payload);
		yield put(
			withdrawLimitCheckingResponse({
				isEnough: isEnough,
				message: message,
			}),
		);
		// yield put(alertPush({ message: ['success.withdraw.action'], type: 'success' }));
	} catch (error) {
		yield put(
			withdrawLimitCheckingResponse({
				isEnough: false,
				message: 'network is down',
			}),
		);
		yield put(alertPush({ message: [], code: error.code, type: 'error' }));
	}
}
