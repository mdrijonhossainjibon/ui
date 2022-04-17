import { errorCompetitionItem } from './../actions';
import { dataCompetitionItem } from './../actions';
import { FetchCompetitionItem } from '../actions';
import { put, call } from 'redux-saga/effects';
import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'competition', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* competitionItemSaga(action: FetchCompetitionItem) {
	try {
		const { competition_id: id } = action.payload;
		const competition = yield call(API.get(createOptions(getCsrfToken())), `/public/competition/detail/${id}`);
		yield put(dataCompetitionItem(competition, false));
	} catch (error) {
		yield put(errorCompetitionItem(error));
	}
}
