import { RankingCompetitionActions } from './actions';
import { COMPETITION_RANKING_FETCH, COMPETITION_RANKING_DATA, COMPETITION_RANKING_ERROR } from './constants';
import { RankingCompetitionState } from './types';

const initialRankingCompetitionState: RankingCompetitionState = {
	payload: [],
	loading: true,
};
export const rankingCompetitionReducer = (state = initialRankingCompetitionState, action: RankingCompetitionActions) => {
	switch (action.type) {
		case COMPETITION_RANKING_FETCH:
			return {
				...state,
				loading: true,
			};
		case COMPETITION_RANKING_DATA:
			const data = action.payload;
			return {
				...state,
				payload: data,
				loading: false,
				error: undefined,
			};
		case COMPETITION_RANKING_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
