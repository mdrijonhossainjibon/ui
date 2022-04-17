import { put, call } from 'redux-saga/effects';
import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
import { catchErrorCompetitionAward, FetchCompetitionAward, getDataCompetitionAward } from '../actions';
const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'competition', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* competitionAwardSaga(action: FetchCompetitionAward) {
	try {
		const { competition_id } = action.payload;
		const awards = yield call(API.get(createOptions(getCsrfToken())), `/public/competition/awards/${competition_id}`);
		yield put(getDataCompetitionAward(awards, false));
	} catch (error) {
		yield put(catchErrorCompetitionAward(error));
	}
}
