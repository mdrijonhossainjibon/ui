import { TransactionPriceListState, TransactionsListState } from './types';
import {
	TRANSACTIONS_LIST_DATA,
	TRANSACTIONS_LIST_FETCH,
	TRANSACTION_PRICE_LIST_DATA,
	TRANSACTION_PRICE_LIST_FETCH,
} from './constants';

export interface TransactionPriceListFetch {
	type: typeof TRANSACTION_PRICE_LIST_FETCH;
	payload: {
		currencies: string[];
	};
}

export interface TransactionPriceListData {
	type: typeof TRANSACTION_PRICE_LIST_DATA;
	payload: TransactionPriceListState;
}

export interface TransactionsListFetch {
	type: typeof TRANSACTIONS_LIST_FETCH;
	payload: {
		limit: number;
		page: number;
	};
}

export interface TransactionsListData {
	type: typeof TRANSACTIONS_LIST_DATA;
	payload: TransactionsListState;
}

export type TransctionPriceActions = TransactionPriceListFetch | TransactionPriceListData;
export type TransactionListActions = TransactionsListFetch | TransactionsListData;
export const transactionPriceListFetch = (payload: TransactionPriceListFetch['payload']): TransactionPriceListFetch => ({
	type: TRANSACTION_PRICE_LIST_FETCH,
	payload,
});

export const transactionPriceListData = (payload: TransactionPriceListData['payload']): TransactionPriceListData => ({
	type: TRANSACTION_PRICE_LIST_DATA,
	payload,
});

export const transactionsListFetch = (payload: TransactionsListFetch['payload']): TransactionsListFetch => ({
	type: TRANSACTIONS_LIST_FETCH,
	payload,
});

export const transactionsListData = (payload: TransactionsListData['payload']): TransactionsListData => ({
	type: TRANSACTIONS_LIST_DATA,
	payload,
});
