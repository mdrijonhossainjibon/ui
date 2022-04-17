import { takeLatest } from 'redux-saga/effects';
import { EVENT_FETCH } from '../constants';
import { eventFetchSaga } from './eventsSaga';

export function* rootEventSaga() {
	yield takeLatest(EVENT_FETCH, eventFetchSaga);
}
