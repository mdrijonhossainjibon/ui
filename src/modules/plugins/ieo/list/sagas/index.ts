import { takeLatest } from 'redux-saga/effects';
import { IEO_LIST_FETCH } from '../constants';
import { IEOListSaga } from './IEOListSaga';

export function* rootIEOListSaga() {
	yield takeLatest(IEO_LIST_FETCH, IEOListSaga);
}
