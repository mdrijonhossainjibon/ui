import { takeLatest } from 'redux-saga/effects';
import { FETCH_BUY_HISTORY, FETCH_BUYERS_HISTORY } from '../constanst';
import { fetchBuyHistorySaga, fetchBuyersHistorySaga } from './buyHistorySaga';

export function* rootHistoryBuySaga() {
	yield takeLatest(FETCH_BUY_HISTORY, fetchBuyHistorySaga);
	yield takeLatest(FETCH_BUYERS_HISTORY, fetchBuyersHistorySaga);
}
