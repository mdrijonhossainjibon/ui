import { CommonError } from 'modules/types';
import { COMPETITION_AWARDS_DATA, COMPETITION_AWARDS_ERROR, COMPETITION_AWARDS_FETCH } from './constants';
import { CompetitionAward } from './types';

export interface FetchCompetitionAward {
	type: typeof COMPETITION_AWARDS_FETCH;
	payload: {
		competition_id: number;
	};
}

export interface GetDataCompetitionAward {
	type: typeof COMPETITION_AWARDS_DATA;
	payload: CompetitionAward[];
	loading: boolean;
}

export interface CatchErrorCompetitionAward {
	type: typeof COMPETITION_AWARDS_ERROR;
	error: CommonError;
}

export type CompetitionAwardActions = FetchCompetitionAward | GetDataCompetitionAward | CatchErrorCompetitionAward;

export const fetchCompetitionAward = (payload: FetchCompetitionAward['payload']): FetchCompetitionAward => ({
	type: COMPETITION_AWARDS_FETCH,
	payload,
});

export const getDataCompetitionAward = (
	payload: GetDataCompetitionAward['payload'],
	loading: GetDataCompetitionAward['loading'],
): GetDataCompetitionAward => ({
	type: COMPETITION_AWARDS_DATA,
	loading,
	payload,
});
export const catchErrorCompetitionAward = (error: CatchErrorCompetitionAward['error']): CatchErrorCompetitionAward => ({
	type: COMPETITION_AWARDS_ERROR,
	error,
});
