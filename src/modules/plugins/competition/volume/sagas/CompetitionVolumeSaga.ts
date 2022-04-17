import { put, call } from 'redux-saga/effects';
import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
import { catchErrorCompetitionVolume, FetchCompetitionVolume, getDataCompetitionVolume } from '../actions';
const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'competition', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* competitionVolumeSaga(action: FetchCompetitionVolume) {
	try {
		const { competition_id: id } = action.payload;
		const volume = yield call(API.get(createOptions(getCsrfToken())), `/private/competition/volume/competition_id=${id}`);
		yield put(getDataCompetitionVolume(volume, false));
	} catch (error) {
		yield put(catchErrorCompetitionVolume(error));
	}
}
