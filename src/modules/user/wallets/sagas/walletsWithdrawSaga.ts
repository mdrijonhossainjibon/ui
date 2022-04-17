// tslint:disable-next-line
import { toNumber } from 'lodash';
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { alertPush } from '../../../index';
import { walletsWithdrawCcyData, walletsWithdrawCcyError, WalletsWithdrawCcyFetch } from '../actions';

const walletsWithdrawCcyOptions = (csrfToken?: string): RequestOptions => {
	return {
		apiVersion: 'peatio',
		headers: { 'X-CSRF-Token': csrfToken },
	};
};

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'wallet', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* walletsWithdrawCcySaga(action: WalletsWithdrawCcyFetch) {
	try {
		const { amount, fee, currency } = action.payload;
		yield put(walletsWithdrawCcyData({ withdrawProcess: 10, showProcessPopup: true, isFinish: false }));
		yield put(alertPush({ message: ['waiting.withdraw.action'], type: 'success' }));
		const { id: transferID } = yield call(API.post(createOptions(getCsrfToken())), '/private/wallet/transfer/create', {
			amount: amount,
			fee: fee,
			currency: currency,
		});
		try {
			yield put(walletsWithdrawCcyData({ withdrawProcess: 30, showProcessPopup: true, isFinish: false }));
			const withdrawResponse = yield call(
				API.post(walletsWithdrawCcyOptions(getCsrfToken())),
				'/account/withdraws',
				action.payload,
			);

			yield call(API.post(createOptions(getCsrfToken())), '/private/wallet/transfer/update', {
				transfer_id: transferID,
				withdraw_id: withdrawResponse.id,
				amount: amount,
			});
			yield put(walletsWithdrawCcyData({ withdrawProcess: 80, showProcessPopup: true, isFinish: false }));
			if (toNumber(fee) === 0) {
				yield call(API.post(createOptions(getCsrfToken())), '/private/wallet/eth/withdraw', {
					withdraw_id: withdrawResponse.id,
					currency: currency,
				});
			}
			yield put(
				walletsWithdrawCcyData({ withdrawProcess: 100, showProcessPopup: true, isFinish: true, status: 'success' }),
			);
			// yield put(alertPush({ message: ['success.withdraw.action'], type: 'success' }));
		} catch (error) {
			const err = error as { code: number; message: string[] };
			const { message } = err;
			yield put(
				walletsWithdrawCcyData({
					withdrawProcess: 80,
					showProcessPopup: true,
					isFinish: true,
					status: 'fail',
					reason: message.join(' '),
				}),
			);
			yield call(API.post(createOptions(getCsrfToken())), '/private/wallet/transfer/update', {
				transfer_id: transferID,
				withdraw_id: undefined,
			});
			yield put(walletsWithdrawCcyData({ withdrawProcess: 100, showProcessPopup: true, isFinish: true, status: 'fail' }));
			return error;
		}
	} catch (error) {
		const err = error as { code: number; message: string[] };
		const { message } = err;

		yield put(
			walletsWithdrawCcyData({
				withdrawProcess: 80,
				showProcessPopup: true,
				isFinish: true,
				status: 'fail',
				reason: message.join(' '),
			}),
		);
		yield put(walletsWithdrawCcyError(err));
		yield put(alertPush({ message: err.message, code: err.code, type: 'error' }));
	}
}
