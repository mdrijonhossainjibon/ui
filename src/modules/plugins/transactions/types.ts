import { CommonState } from '../../../modules/types';
export interface TransactionPrice {
	id: string;
	base_currency: string;
	quote_currency: string;
	price: number;
}
export interface TransactionPriceListState extends CommonState {
	payload: TransactionPrice[];
	loading: boolean;
}

export interface Transaction {
	timeStamp: string;
	hash: string;
	from: string;
	amount: string;
	value: string;
	usdPrice: string;
	uTotal: string;
	success: boolean;
	currency: string;
}

export interface TransactionsListState extends CommonState {
	payload: [
		{
			totalPage: number;
			page: number;
			limit: number;
		},
		Transaction[],
		{
			udonTotal: number;
		},
	];
	loading: boolean;
}
