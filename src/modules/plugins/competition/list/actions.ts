import { ListCompetitionState } from './types';
import { COMPETITION_LIST_DATA, COMPETITION_LIST_ERROR, COMPETITION_LIST_FETCH } from './';
import { CommonError } from 'modules/types';

export interface FetchListCompetition {
	type: typeof COMPETITION_LIST_FETCH;
}

export interface ListCompetitionData {
	type: typeof COMPETITION_LIST_DATA;
	payload: ListCompetitionState;
}

export interface ListCompetitionError {
	type: typeof COMPETITION_LIST_ERROR;
	error: CommonError;
}

export type CompetitionListAction = FetchListCompetition | ListCompetitionData | ListCompetitionError;

export const fetchListCompetition = (): FetchListCompetition => {
	return {
		type: COMPETITION_LIST_FETCH,
	};
};

export const listCompetitionData = (payload: ListCompetitionData['payload']): ListCompetitionData => ({
	payload,
	type: COMPETITION_LIST_DATA,
});

export const listCompetitionError = (error: ListCompetitionError['error']): ListCompetitionError => ({
	error,
	type: COMPETITION_LIST_ERROR,
});
