import { CompetitionListAction } from './actions';

import { COMPETITION_LIST_DATA, COMPETITION_LIST_ERROR, COMPETITION_LIST_FETCH } from './constants';
import { ListCompetitionState } from './types';

export const initialCompetitionList: ListCompetitionState = {
	payload: [],
	loading: true,
};

export const CompetitionListReducer = (state = initialCompetitionList, action: CompetitionListAction) => {
	switch (action.type) {
		case COMPETITION_LIST_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case COMPETITION_LIST_DATA:
			const data = action.payload;
			return {
				...state,
				payload: data,
				loading: false,
				error: undefined,
			};
		case COMPETITION_LIST_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
