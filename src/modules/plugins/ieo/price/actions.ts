import { CommonError } from '../../../types';
import { GET_PRICE, PRICE_DATA, PRICE_ERROR } from './constants';
import { PriceState } from './types';

export interface GetPrice {
	type: typeof GET_PRICE;
	payload: {
		fsym: string;
		tsyms: string[];
	};
}

export interface PriceData {
	type: typeof PRICE_DATA;
	payload: PriceState;
}

export interface PriceError {
	type: typeof PRICE_ERROR;
	error: CommonError;
}

export type PriceActions = GetPrice | PriceData | PriceError;

export const getPrice = (payload: GetPrice['payload']): GetPrice => ({
	type: GET_PRICE,
	payload,
});

export const priceData = (payload: PriceData['payload']): PriceData => ({
	type: PRICE_DATA,
	payload,
});

export const priceError = (error: PriceError['error']): PriceError => ({
	type: PRICE_ERROR,
	error,
});
