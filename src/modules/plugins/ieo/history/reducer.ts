import { HistoryBuyActions } from './actions';
import * as Constants from './constanst';
import { BuyHistoryListState, BuyersHistoryState } from './types';

export const initialBuyHistoryList: BuyHistoryListState = {
	total: 0,
	payload: [],
	loading: false,
};

export const BuyHistoryReducer = (state = initialBuyHistoryList, action: HistoryBuyActions) => {
	switch (action.type) {
		case Constants.FETCH_BUY_HISTORY:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case Constants.FETCH_BUY_HISTORY_DATA:
			const { payload, total } = action.payload;
			return {
				...state,
				payload: payload,
				loading: false,
				total: total,
				error: undefined,
			};
		case Constants.FETCH_HISTORY_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};

export const initialBuyersHistory: BuyersHistoryState = {
	total: 0,
	payload: [],
	loading: false,
};

export const BuyersHistoryReducer = (state = initialBuyersHistory, action: HistoryBuyActions) => {
	switch (action.type) {
		case Constants.FETCH_BUYERS_HISTORY:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case Constants.FETCH_BUYERS_HISTORY_DATA:
			const { payload, total } = action.payload;
			return {
				...state,
				payload: payload,
				loading: false,
				total: total,
				error: undefined,
			};
		case Constants.FETCH_HISTORY_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
