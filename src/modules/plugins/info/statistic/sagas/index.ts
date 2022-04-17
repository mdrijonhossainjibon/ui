import { takeLatest } from 'redux-saga/effects';
import { STATISTIC_FETCH } from '../constants';
import { fetchStatisticSaga } from './statistic';
export function* rootStatisticSaga() {
	yield takeLatest(STATISTIC_FETCH, fetchStatisticSaga);
}
