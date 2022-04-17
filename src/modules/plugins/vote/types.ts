import { CommonState } from '../../../modules/types';

export interface VoteCoin {
	id: string;
	name: string;
	website: string;
	active: boolean;
	created_at: string;
	total: number;
}

export interface VoteHistory {
	id: number;
	coin_id: string;
	amount: string;
	name: string;
	created_at: string;
	updated_at: string;
}

export interface VoteFilter {
	pageIndex?: number;
	limit?: number;
	keyword?: string;
}

export interface FreeVote {
	total: number;
	used: number;
}
export interface VoteListState extends CommonState {
	info: {
		data: VoteCoin[];
		total: number;
	};
	infoRound?: {
		id: number;
		coin_id?: any;
		active: boolean;
		started_at: string;
		ended_at: string;
		current_time: string;
		infoCoin: VoteCoin;
		created_at: string;
	};
}

export interface VoteHistoryState extends CommonState {
	info: {
		data: VoteHistory[];
		total: number;
	};
}
export interface VoteDonateState extends CommonState {
	data?: VoteHistory;
	freeVote: FreeVote;
}
