import { CommonError } from '../../../types';
import {
	BUY_IEO_ERROR,
	BUY_IEO_LOADING,
	BUY_IEO_ITEM,
	GET_TOTAL_IEO_BUYERS,
	RESET_BUY_IEO_RESPONSE,
	TOTAL_IEO_BUYERS_DATA,
	TOTAL_IEO_BUYERS_ERROR,
} from './constants';
import { BuyIEO, BuyIEOLoadingState, TotalIEOBuyersState } from './types';

export interface BuyIEOItem {
	type: typeof BUY_IEO_ITEM;
	payload: BuyIEO;
}

export interface BuyIEOLoading {
	type: typeof BUY_IEO_LOADING;
	payload: BuyIEOLoadingState;
}

export interface BuyIEOError {
	type: typeof BUY_IEO_ERROR;
	error: CommonError;
}

export interface GetIEOTotalBuyers {
	type: typeof GET_TOTAL_IEO_BUYERS;
	payload: {
		ieo_id: string;
	};
}

export interface TotalIEOBuyersData {
	type: typeof TOTAL_IEO_BUYERS_DATA;
	payload: TotalIEOBuyersState;
}

export interface TotalIEOBuyersError {
	type: typeof TOTAL_IEO_BUYERS_ERROR;
	error: CommonError;
}

export interface ResetIEOBuyResponse {
	type: typeof RESET_BUY_IEO_RESPONSE;
}

export type BuyIEOActions =
	| BuyIEOItem
	| BuyIEOLoading
	| BuyIEOError
	| ResetIEOBuyResponse
	| GetIEOTotalBuyers
	| TotalIEOBuyersData
	| TotalIEOBuyersError;

export const buyIEOItem = (payload: BuyIEOItem['payload']): BuyIEOItem => ({
	type: BUY_IEO_ITEM,
	payload,
});

export const buyIEOLoading = (payload: BuyIEOLoading['payload']): BuyIEOLoading => ({
	type: BUY_IEO_LOADING,
	payload,
});

export const buyIEOError = (error: BuyIEOError['error']): BuyIEOError => ({
	type: BUY_IEO_ERROR,
	error,
});

export const resetBuyIEOResponse = (): ResetIEOBuyResponse => ({
	type: RESET_BUY_IEO_RESPONSE,
});

export const getIEOTotalBuyers = (payload: GetIEOTotalBuyers['payload']): GetIEOTotalBuyers => ({
	type: GET_TOTAL_IEO_BUYERS,
	payload,
});

export const totalIEOBuyersData = (payload: TotalIEOBuyersData['payload']): TotalIEOBuyersData => ({
	type: TOTAL_IEO_BUYERS_DATA,
	payload,
});

export const totalIEOBuyersError = (error: TotalIEOBuyersError['error']): TotalIEOBuyersError => ({
	type: TOTAL_IEO_BUYERS_ERROR,
	error,
});
