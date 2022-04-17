import { getCsrfToken } from 'helpers';
import { API, RequestOptions } from '../../../../api';
import { call, put } from 'redux-saga/effects';
import { walletsWithdrawLimitData, WalletsWithdrawLimitFetch } from 'modules';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'wallet', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* walletsWithdrawLimitSaga(action: WalletsWithdrawLimitFetch) {
	try {
		const { isLimitWithdraw } = yield call(API.get(createOptions(getCsrfToken())), '/private/wallet/withdraws/limit');
		yield put(
			walletsWithdrawLimitData({
				payload: { isLimitWithdraw: isLimitWithdraw },
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			walletsWithdrawLimitData({
				payload: { isLimitWithdraw: false },
				loading: false,
			}),
		);
	}
}
