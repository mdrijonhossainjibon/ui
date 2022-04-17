import { put, call } from 'redux-saga/effects';
import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
import { catchErrorRankingCompetition, FetchRankingCompetition, getDataRankingCompetition } from '..';
const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'competition', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* competitionRankingSaga(action: FetchRankingCompetition) {
	try {
		const { competition_id } = action.payload;
		const rankingCompetition = yield call(
			API.get(createOptions(getCsrfToken())),
			`/public/competition/ranking/competition_id=${competition_id}`,
		);
		yield put(getDataRankingCompetition(rankingCompetition, false));
	} catch (error) {
		yield put(catchErrorRankingCompetition(error));
	}
}
