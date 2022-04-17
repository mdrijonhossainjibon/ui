import { alertPush, findIEOById } from 'modules';
import { fetchBuyHistory, fetchBuyersHistory } from './../../history';
import { buyIEOLoading, BuyIEOItem, GetIEOTotalBuyers, totalIEOBuyersData, totalIEOBuyersError } from '../actions';

import { put, call } from 'redux-saga/effects';
import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'ieo', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* buyIEOItemSaga(action: BuyIEOItem) {
	try {
		yield call(API.post(createOptions(getCsrfToken())), `/private/ieo/buy`, action.payload);
		yield put(
			findIEOById({
				id: String(action.payload.ieo_id),
			}),
		);
		yield put(
			fetchBuyHistory({
				ieo_id: Number(action.payload.ieo_id),
				page: 0,
				pageSize: 5,
			}),
		);
		yield put(
			buyIEOLoading({
				loading: true,
				success: true,
			}),
		);
		yield put(
			fetchBuyersHistory({
				ieo_id: Number(action.payload.ieo_id),
				page: 0,
				pageSize: 5,
			}),
		);
		yield put(alertPush({ message: ['page.ieo.buy.success'], type: 'success' }));
	} catch (error) {
		yield put(
			buyIEOLoading({
				loading: true,
				success: false,
			}),
		);
		yield put(alertPush({ message: ['page.ieo.buy.error'], type: 'error' }));
	}
}

export function* resetBuyResponseSaga() {
	yield put(
		buyIEOLoading({
			loading: false,
			success: false,
		}),
	);
}

export function* getTotalBuyersSaga(action: GetIEOTotalBuyers) {
	try {
		const {ieo_id} = action.payload;
		const response = yield call(API.get(createOptions(getCsrfToken())), `public/ieo/total-purchase/${ieo_id}`, action.payload);
		yield put(
			totalIEOBuyersData({
				payload: response,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(totalIEOBuyersError(error));
	}
}
