import { toLower } from 'lodash';
import { getCsrfToken } from 'helpers';
import { withdrawHistoryData, WithdrawHistoryFetch } from 'modules';
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'wallet', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* withdrawHistorySaga(action: WithdrawHistoryFetch) {
	try {
		const list = yield call(
			API.get(createOptions(getCsrfToken())),
			`/private/wallet/withdraws/history?currency=${toLower(action.payload.currency)}`,
		);
		yield put(
			withdrawHistoryData({
				payload: list,
				loading: false,
			}),
		);
	} catch (error) {}
}
