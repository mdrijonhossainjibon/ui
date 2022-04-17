import { CompetitionAwardState } from '.';
import { CompetitionAwardActions } from './actions';
import { COMPETITION_AWARDS_DATA, COMPETITION_AWARDS_ERROR, COMPETITION_AWARDS_FETCH } from './constants';

const initialCompetitionAwardState: CompetitionAwardState = {
	payload: [],
	loading: true,
};

export const competitionAwardReducer = (state = initialCompetitionAwardState, action: CompetitionAwardActions) => {
	switch (action.type) {
		case COMPETITION_AWARDS_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case COMPETITION_AWARDS_DATA:
			const data = action.payload;
			return {
				...state,
				payload: data,
				loading: false,
				error: undefined,
			};
		case COMPETITION_AWARDS_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
