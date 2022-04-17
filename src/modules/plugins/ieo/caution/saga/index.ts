import { takeLatest } from 'redux-saga/effects';
import { FETCH_IEO_CAUTION } from '../constants';
import { fetchIEOCautionSaga } from './cautionSaga';

export function* rootIEOCautionSaga() {
	yield takeLatest(FETCH_IEO_CAUTION, fetchIEOCautionSaga);
}
