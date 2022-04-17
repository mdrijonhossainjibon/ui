import { takeLatest } from 'redux-saga/effects';
import { COMPETITION_LIST_FETCH } from '../constants';
import { CompetitionListSaga } from './competitionListSaga';

export function* rootCompetitionListSaga() {
	yield takeLatest(COMPETITION_LIST_FETCH, CompetitionListSaga);
}
