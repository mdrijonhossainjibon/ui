import { takeLatest } from 'redux-saga/effects';
import { COMPETITION_ITEM_FETCH } from '../constants';
import { competitionItemSaga } from './competitionItemSaga';

export function* rootCompetitionItemSaga() {
	yield takeLatest(COMPETITION_ITEM_FETCH, competitionItemSaga);
}
