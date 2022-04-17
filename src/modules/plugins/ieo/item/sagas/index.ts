import { takeLatest } from 'redux-saga/effects';
import { IEO_FIND_BY_ID } from '../constants';
import { findIEOItemByIdSaga } from './IEOItemsaga';

export function* rootIEOItemSaga() {
	yield takeLatest(IEO_FIND_BY_ID, findIEOItemByIdSaga);
}
