import { takeLatest } from 'redux-saga/effects';
import { COMPETITION_VOLUME_FETCH } from '../constants';
import { competitionVolumeSaga } from './CompetitionVolumeSaga';

export function* rootCompetitionVolumeSaga() {
	yield takeLatest(COMPETITION_VOLUME_FETCH, competitionVolumeSaga);
}
