import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
import { call, put } from 'redux-saga/effects';

import { ethFeeData, ethFeeError, ETHFeeFetch } from '../actions';
const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'wallet', headers: { 'X-CSRF-Token': csrfToken } };
};
export function* ethFeeSaga(action: ETHFeeFetch) {
	try {
		const list = yield call(API.get(createOptions(getCsrfToken())), '/private/wallet/fee/eth');
		yield put(ethFeeData(list));
	} catch (error) {
		yield put(ethFeeError(error));
	}
}
