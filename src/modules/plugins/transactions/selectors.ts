import { RootState } from '../../index';
import { TransactionPriceListState, TransactionsListState } from './types';

export const selectTransactionPriceList = (state: RootState): TransactionPriceListState['payload'] =>
	state.plugins.transactions.prices.payload;
export const selectTransactionPriceLoading = (state: RootState): boolean => state.plugins.transactions.prices.loading;
export const selectTransactionList = (state: RootState): TransactionsListState['payload'] =>
	state.plugins.transactions.list.payload;
export const selectTransactionListLoading = (state: RootState): boolean => state.plugins.transactions.list.loading;
