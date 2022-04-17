import { takeLatest } from 'redux-saga/effects';
import { FETCH_IEO_DETAIL } from '../constants';
import { fetchIEODetailSaga } from './detailSaga';

export function* rootIEODetailSaga() {
	yield takeLatest(FETCH_IEO_DETAIL, fetchIEODetailSaga);
}
