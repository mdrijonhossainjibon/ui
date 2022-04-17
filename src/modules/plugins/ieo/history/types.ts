// import { CommonState } from '../../../types';

export interface BuyHistory {
	quantity: number;
	base_currency: string;
	total: number;
	quote_currency: string;
	status: string;
	created_at: Date;
}

export interface BuyersHistory {
	uid: string;
	quantity: number;
	base_currency: string;
	total: number;
	quote_currency: string;
	status: string;
	created_at: Date;
}
export interface BuyersHistoryState {
	payload: BuyersHistory[];
	loading: boolean;
	total: number;
}

export interface BuyHistoryListState {
	payload: BuyHistory[];
	loading: boolean;
	total: number;
}
