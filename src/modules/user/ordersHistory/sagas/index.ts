import { takeLatest } from 'redux-saga/effects';
import {
	ORDERS_CANCEL_ALL_FETCH,
	ORDERS_HISTORY_ALL_FETCH,
	ORDERS_HISTORY_CANCEL_FETCH,
	ORDERS_HISTORY_FETCH,
} from '../constants';
import { ordersCancelAllSaga } from './ordersCancelAllSaga';
import { ordersHistoryAllSaga } from './ordersHistoryAllSaga';
import { ordersHistoryCancelSaga } from './ordersHistoryCancelSaga';
import { ordersHistorySaga } from './ordersHistorySaga';

export function* rootOrdersHistorySaga() {
	yield takeLatest(ORDERS_HISTORY_FETCH, ordersHistorySaga);
	yield takeLatest(ORDERS_CANCEL_ALL_FETCH, ordersCancelAllSaga);
	yield takeLatest(ORDERS_HISTORY_CANCEL_FETCH, ordersHistoryCancelSaga);
	yield takeLatest(ORDERS_HISTORY_ALL_FETCH, ordersHistoryAllSaga);
}
