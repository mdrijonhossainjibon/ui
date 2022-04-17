import { CommonError } from '../../../types';
import { ETH_FEE_DATA, ETH_FEE_ERROR, ETH_FEE_FETCH } from './constants';
import { ETHFee } from './types';

export interface ETHFeeFetch {
	type: typeof ETH_FEE_FETCH;
}

export interface ETHFeeData {
	type: typeof ETH_FEE_DATA;
	payload: ETHFee[];
}

export interface ETHFeeError {
	type: typeof ETH_FEE_ERROR;
	error: CommonError;
}

export type ETHFeeActions = ETHFeeFetch | ETHFeeData | ETHFeeError;

export const ethFeeFetch = (): ETHFeeFetch => ({
	type: ETH_FEE_FETCH,
});

export const ethFeeData = (payload: ETHFeeData['payload']): ETHFeeData => ({
	type: ETH_FEE_DATA,
	payload,
});

export const ethFeeError = (error: ETHFeeError['error']): ETHFeeError => ({
	type: ETH_FEE_ERROR,
	error,
});
