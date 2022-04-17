import { CommonState } from '../../../types';

export interface BuyIEO {
	ieo_id: string;
	quantity: number;
	quote_currency: string;
	success?: boolean;
}

export interface BuyIEOLoadingState extends CommonState {
	loading: boolean;
	success: boolean;
}

export interface TotalIEOBuyers {
	totalBuyers: number;
}

export interface TotalIEOBuyersState extends CommonState {
	payload: TotalIEOBuyers;
	loading: boolean;
}
