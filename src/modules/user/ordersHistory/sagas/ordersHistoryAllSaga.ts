// tslint:disable-next-line: import-blacklist
import { uniqBy } from 'lodash';
import { OrderCommon } from 'modules/types';
import { call, put } from 'redux-saga/effects';
import { alertPush } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { userOrdersHistoryAlldata, UserOrdersHistoryAllFetch, userOrdersHistoryError } from '../actions';

const ordersOptions: RequestOptions = {
	apiVersion: 'peatio',
};

export function* ordersHistoryAllSaga(action: UserOrdersHistoryAllFetch) {
	try {
		const { pageIndex, limit, type } = action.payload;
		const params = `${type === 'all' ? '' : '&state=wait'}`;
		let data = yield call(API.get(ordersOptions), `/market/orders?page=${pageIndex}&limit=${limit}${params}`);
		if (data.length === limit) {
			yield put(userOrdersHistoryAlldata({ list: data }));
			// loop get all data
			let index = 1;
			const max = 100;
			let checkData: OrderCommon[];
			checkData = yield call(API.get(ordersOptions), `/market/orders?page=${index}&limit=${max}${params}`);
			if (checkData.length === max) {
				data = checkData;
				while (1) {
					checkData = yield call(API.get(ordersOptions), `/market/orders?page=${++index}&limit=${max}${params}`);
					if (checkData.length === max) {
						data = data.concat(checkData);
					} else {
						data = data.concat(checkData);
						break;
					}
				}
			} else {
				data = checkData;
			}
		}
		data = uniqBy(data, (e: any) => e.id);

		yield put(userOrdersHistoryAlldata({ list: data }));
	} catch (error) {
		yield put(userOrdersHistoryError());
		yield put(alertPush({ message: error.message, code: error.code, type: 'error' }));
	}
}
