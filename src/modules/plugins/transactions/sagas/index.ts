import { takeLatest } from 'redux-saga/effects';
import { TRANSACTIONS_LIST_FETCH, TRANSACTION_PRICE_LIST_FETCH } from '../constants';
import { fetchTransactionPriceListSaga } from './prices';
import { fetchTransactionListSaga } from './transactions';
export function* rootTransactionSaga() {
	yield takeLatest(TRANSACTION_PRICE_LIST_FETCH, fetchTransactionPriceListSaga);
	yield takeLatest(TRANSACTIONS_LIST_FETCH, fetchTransactionListSaga);
}
