import { defaultStorageLimit } from '../../../api';
import { sliceArray } from '../../../helpers';
import { getUnique } from '../../../helpers/getUnique';
import { DepositHistoryActions, HistoryActions, WithdrawHistoryActions } from './actions';
import {
	DEPOSIT_HISTORY_DATA,
	DEPOSIT_HISTORY_FETCH,
	HISTORY_ALL_DATA,
	HISTORY_ALL_FETCH,
	HISTORY_DATA,
	HISTORY_ERROR,
	HISTORY_FETCH,
	HISTORY_PUSH_FINISH,
	HISTORY_RESET,
	WITHDRAW_HISTORY_DATA,
	WITHDRAW_HISTORY_FETCH,
} from './constants';
import { DepositHistoryState, WalletHistoryList, WithdrawHistoryState } from './types';

export interface HistoryState {
	list: WalletHistoryList;
	fetching: boolean;
	page: number;
	nextPageExists: boolean;
	max_page: number;
}

const initialState: HistoryState = {
	list: [],
	fetching: false,
	page: 0,
	nextPageExists: false,
	max_page: 1,
};

export const historyReducer = (state = initialState, action: HistoryActions) => {
	switch (action.type) {
		case HISTORY_FETCH:
			return { ...state, fetching: true };
		case HISTORY_DATA:
			return {
				...state,
				list: sliceArray(action.payload.list, defaultStorageLimit()),
				fetching: false,
				page: action.payload.page,
				nextPageExists: action.payload.nextPageExists,
			};
		case HISTORY_ALL_FETCH:
			return { ...state, fetching: true };
		case HISTORY_ALL_DATA:
			return {
				...state,
				fetching: false,
				list: action.payload.list,
			};
		case HISTORY_ERROR: {
			return { ...state, list: [], fetching: false, nextPageExists: false, page: 0 };
		}
		case HISTORY_RESET: {
			return { ...state, list: [], page: 0, nextPageExists: false };
		}
		case HISTORY_PUSH_FINISH: {
			let list = action.payload;
			list = getUnique(list, 'id');

			return { ...state, list: sliceArray(list, defaultStorageLimit()) };
		}

		default:
			return state;
	}
};

const initialWithdrawHistory: WithdrawHistoryState = {
	payload: [],
	loading: false,
};

export const withdrawHistoryReducer = (state = initialWithdrawHistory, action: WithdrawHistoryActions): WithdrawHistoryState => {
	switch (action.type) {
		case WITHDRAW_HISTORY_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case WITHDRAW_HISTORY_DATA:
			const { payload } = action.payload;

			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};
		default:
			return state;
	}
};

const initialDepositHistory: DepositHistoryState = {
	payload: [],
	loading: false,
};
export const depositHistoryReducer = (state = initialDepositHistory, action: DepositHistoryActions): DepositHistoryState => {
	switch (action.type) {
		case DEPOSIT_HISTORY_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case DEPOSIT_HISTORY_DATA:
			const { payload } = action.payload;

			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};
		default:
			return state;
	}
};
