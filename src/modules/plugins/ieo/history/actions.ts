import * as Constants from './constanst';
import { BuyHistoryListState, BuyersHistoryState } from './types';
export interface FetchBuyHistory {
	type: typeof Constants.FETCH_BUY_HISTORY;
	payload: {
		ieo_id: number;
		page: number;
		pageSize: number;
	};
}
export interface FetchBuyersHistory {
	type: typeof Constants.FETCH_BUYERS_HISTORY;
	payload: {
		ieo_id: number;
		page: number;
		pageSize: number;
	};
}
export interface FetchBuyHistoryData {
	type: typeof Constants.FETCH_BUY_HISTORY_DATA;
	payload: BuyHistoryListState;
}

export interface FetchBuyersHistoryData {
	type: typeof Constants.FETCH_BUYERS_HISTORY_DATA;
	payload: BuyersHistoryState;
}
export interface FetchHistoryError {
	type: typeof Constants.FETCH_HISTORY_ERROR;
	error: string;
}

export type HistoryBuyActions =
	| FetchBuyHistory
	| FetchHistoryError
	| FetchBuyersHistory
	| FetchBuyHistoryData
	| FetchBuyersHistoryData;

export const fetchBuyHistory = (payload: FetchBuyHistory['payload']): FetchBuyHistory => ({
	type: Constants.FETCH_BUY_HISTORY,
	payload,
});

export const fetchBuyersHistory = (payload: FetchBuyersHistory['payload']): FetchBuyersHistory => ({
	type: Constants.FETCH_BUYERS_HISTORY,
	payload,
});

export const fetchBuyersHistoryData = (payload: FetchBuyersHistoryData['payload']): FetchBuyersHistoryData => ({
	type: Constants.FETCH_BUYERS_HISTORY_DATA,
	payload,
});
export const fetchHistoryError = (error: FetchHistoryError['error']): FetchHistoryError => ({
	type: Constants.FETCH_HISTORY_ERROR,
	error,
});
export const fetchBuyHistoryData = (payload: FetchBuyHistoryData['payload']): FetchBuyHistoryData => ({
	type: Constants.FETCH_BUY_HISTORY_DATA,
	payload,
});
