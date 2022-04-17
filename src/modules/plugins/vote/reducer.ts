import produce from 'immer';
import get from 'lodash/get';
import { VoteDonateActions, VoteHistoryActions, VoteListActions } from './actions';
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
import { VoteDonateState, VoteHistoryState, VoteListState } from './types';

const initialVoteListState: VoteListState = {
	info: {
		data: [],
		total: 1,
	},
	loading: false,
};

export const voteListReducer = (state = initialVoteListState, action: VoteListActions): VoteListState =>
	produce(state, draft => {
		let index: number;
		switch (action.type) {
			case VOTE_LIST_FETCH:
				draft.loading = true;
				break;
			case VOTE_LIST_DATA:
				const { data, infoRound, total } = action.payload;
				draft.info.data = data;
				draft.info.total = total;
				const isUpdateInfoRound =
					(get(draft.infoRound, 'started_at') !== get(infoRound, 'started_at') &&
						get(draft.infoRound, 'ended_at') !== get(infoRound, 'ended_at')) ||
					infoRound;
				if (isUpdateInfoRound) {
					draft.infoRound = action.payload.infoRound;
				}
				draft.loading = false;
				break;
			case VOTE_DONATE_DATA:
				index = draft.info.data.findIndex(item => item.id === action.payload.coin.id);
				if (index !== -1) {
					draft.info.data[index].total = action.payload.coin.total || 0;
					draft.info.data = draft.info.data.sort((a, b) => b.total - a.total);
				}
				break;
			case VOTE_LIST_ERROR:
				draft.loading = false;
				draft.error = action.error;
				break;
			default:
				break;
		}
	});

const initialVoteHistoryState: VoteHistoryState = {
	info: {
		data: [],
		total: 1,
	},
	loading: false,
};

export const voteHistoryReducer = (state = initialVoteHistoryState, action: VoteHistoryActions): VoteHistoryState =>
	produce(state, draft => {
		switch (action.type) {
			case VOTE_HISTORY_FETCH:
				draft.loading = true;
				break;
			case VOTE_HISTORY_DATA:
				draft.info = action.payload;
				draft.loading = false;
				break;
			case VOTE_DONATE_DATA:
				draft.info.data.unshift(action.payload.donate);
				break;
			case VOTE_HISTORY_ERROR:
				draft.loading = false;
				draft.error = action.error;
				break;
			default:
				break;
		}
	});

const initialVoteDonateState: VoteDonateState = {
	loading: false,
	freeVote: {
		total: 0,
		used: 0,
	},
};

export const voteDonateReducer = (state = initialVoteDonateState, action: VoteDonateActions): VoteDonateState =>
	produce(state, draft => {
		switch (action.type) {
			case VOTE_DONATE_CREATE:
				draft.loading = true;
				break;
			case VOTE_DONATE_DATA:
				draft.data = action.payload.donate;
				draft.loading = false;
				break;
			case VOTE_DONATE_FREE_FETCH:
				break;
			case VOTE_DONATE_FREE_DATA:
				draft.freeVote = action.payload;
				break;
			case VOTE_DONATE_ERROR:
				draft.loading = false;
				draft.error = action.error;
				break;
			default:
				break;
		}
	});
