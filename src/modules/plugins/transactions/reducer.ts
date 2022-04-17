// import { sliceArray } from '../../../../helpers';
import { TransactionsListState } from '.';
import { TransactionListActions, TransctionPriceActions } from './actions';

import {
	TRANSACTIONS_LIST_DATA,
	TRANSACTIONS_LIST_FETCH,
	TRANSACTION_PRICE_LIST_DATA,
	TRANSACTION_PRICE_LIST_FETCH,
} from './constants';
import { TransactionPriceListState } from './types';

export const initialTransactionPriceList: TransactionPriceListState = {
	payload: [],
	loading: false,
};

export const transactionPriceListReducer = (
	state = initialTransactionPriceList,
	action: TransctionPriceActions,
): TransactionPriceListState => {
	switch (action.type) {
		case TRANSACTION_PRICE_LIST_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case TRANSACTION_PRICE_LIST_DATA:
			const { payload, loading } = action.payload;

			return {
				...state,
				payload: payload,
				loading: loading,
				error: undefined,
			};

		default:
			return state;
	}
};

export const initialTransactionList: TransactionsListState = {
	payload: [
		{
			totalPage: 0,
			page: 0,
			limit: 0,
		},
		[],
		{
			udonTotal: 0,
		},
	],
	loading: false,
};

export const transactionListReducer = (state = initialTransactionList, action: TransactionListActions): TransactionsListState => {
	switch (action.type) {
		case TRANSACTIONS_LIST_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case TRANSACTIONS_LIST_DATA:
			const { payload, loading } = action.payload;

			return {
				...state,
				payload: payload,
				loading: loading,
				error: undefined,
			};

		default:
			return state;
	}
};
