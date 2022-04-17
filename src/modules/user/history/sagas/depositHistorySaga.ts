import { toLower } from 'lodash';
import { getCsrfToken } from 'helpers';
import { depositHistoryData, DepositHistoryFetch } from 'modules';
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'wallet', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* depositsHistorySaga(action: DepositHistoryFetch) {
	try {
		const list = yield call(
			API.get(createOptions(getCsrfToken())),
			`/private/wallet/deposits/history?currency=${toLower(action.payload.currency)}`,
		);
		yield put(
			depositHistoryData({
				payload: list,
				loading: false,
			}),
		);
	} catch (error) {}
}
