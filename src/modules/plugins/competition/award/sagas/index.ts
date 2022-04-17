import { takeLatest } from 'redux-saga/effects';
import { COMPETITION_AWARDS_FETCH } from '../constants';
import { competitionAwardSaga } from './CompetitionVolumeSaga';

export function* rootCompetitionAwardSaga() {
	yield takeLatest(COMPETITION_AWARDS_FETCH, competitionAwardSaga);
}
