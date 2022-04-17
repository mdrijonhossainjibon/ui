import { takeLatest } from 'redux-saga/effects';
import { COMPETITION_RANKING_FETCH } from '../constants';

import { competitionRankingSaga } from './rankingCompetitionSaga';

export function* rootCompetitionRankingSaga() {
	yield takeLatest(COMPETITION_RANKING_FETCH, competitionRankingSaga);
}
