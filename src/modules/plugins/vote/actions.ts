import { CommonError } from '../../../modules/types';
import {
	VOTE_DONATE_CREATE,
	VOTE_DONATE_DATA,
	VOTE_DONATE_ERROR,
	VOTE_DONATE_FREE_DATA,
	VOTE_DONATE_FREE_FETCH,
	VOTE_HISTORY_DATA,
	VOTE_HISTORY_ERROR,
	VOTE_HISTORY_FETCH,
	VOTE_LIST_DATA,
	VOTE_LIST_ERROR,
	VOTE_LIST_FETCH,
} from './constants';
import { FreeVote, VoteCoin, VoteFilter, VoteHistory, VoteListState } from './types';

export interface VoteListFetch {
	type: typeof VOTE_LIST_FETCH;
	payload: VoteFilter;
}
export interface VoteListData {
	type: typeof VOTE_LIST_DATA;
	payload: {
		data: VoteListState['info']['data'];
		total: VoteListState['info']['total'];
		infoRound: VoteListState['infoRound'];
	};
}

export interface VoteListError {
	type: typeof VOTE_LIST_ERROR;
	error: CommonError;
}

export interface VoteDonateCreate {
	type: typeof VOTE_DONATE_CREATE;
	payload: {
		id: string;
		amount: number;
	};
}
export interface VoteDonateData {
	type: typeof VOTE_DONATE_DATA;
	payload: {
		donate: VoteHistory;
		coin: VoteCoin;
	};
}

export interface VoteDonateFreeFetch {
	type: typeof VOTE_DONATE_FREE_FETCH;
}
export interface VoteDonateFreeData {
	type: typeof VOTE_DONATE_FREE_DATA;
	payload: FreeVote;
}

export interface VoteDonateError {
	type: typeof VOTE_DONATE_ERROR;
	error: CommonError;
}

export interface VoteHistoryFetch {
	type: typeof VOTE_HISTORY_FETCH;
	payload: VoteFilter;
}
export interface VoteHistoryData {
	type: typeof VOTE_HISTORY_DATA;
	payload: {
		data: VoteHistory[];
		total: number;
	};
}

export interface VoteHistoryError {
	type: typeof VOTE_HISTORY_ERROR;
	error: CommonError;
}

export type VoteListActions = VoteListFetch | VoteListData | VoteDonateData | VoteListError;
export type VoteDonateActions = VoteDonateCreate | VoteDonateData | VoteDonateFreeFetch | VoteDonateFreeData | VoteDonateError;
export type VoteHistoryActions = VoteHistoryFetch | VoteDonateData | VoteHistoryData | VoteHistoryError;

export const voteListFetch = (payload: VoteListFetch['payload']): VoteListFetch => ({
	type: VOTE_LIST_FETCH,
	payload: payload,
});

export const voteListData = (payload: VoteListData['payload']): VoteListData => ({
	type: VOTE_LIST_DATA,
	payload,
});

export const voteDonateCreate = (payload: VoteDonateCreate['payload']): VoteDonateCreate => ({
	type: VOTE_DONATE_CREATE,
	payload,
});

export const voteDonateData = (payload: VoteDonateData['payload']): VoteDonateData => ({
	type: VOTE_DONATE_DATA,
	payload,
});

export const voteDonateFreeFetch = (): VoteDonateFreeFetch => ({
	type: VOTE_DONATE_FREE_FETCH,
});

export const voteDonateFreeData = (payload: VoteDonateFreeData['payload']): VoteDonateFreeData => ({
	type: VOTE_DONATE_FREE_DATA,
	payload,
});

export const voteHistoryFetch = (payload: VoteHistoryFetch['payload']): VoteHistoryFetch => ({
	type: VOTE_HISTORY_FETCH,
	payload: payload,
});

export const voteHistoryData = (payload: VoteHistoryData['payload']): VoteHistoryData => ({
	type: VOTE_HISTORY_DATA,
	payload,
});

export const voteListError = (error: VoteListError['error']): VoteListError => ({
	type: VOTE_LIST_ERROR,
	error,
});

export const voteHistoryError = (error: VoteHistoryError['error']): VoteHistoryError => ({
	type: VOTE_HISTORY_ERROR,
	error,
});

export const voteDonateError = (error: VoteDonateError['error']): VoteDonateError => ({
	type: VOTE_DONATE_ERROR,
	error,
});
