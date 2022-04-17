// import { sliceArray } from '../../../../helpers';
import { ETHFeeActions } from './actions';
import { ETH_FEE_DATA, ETH_FEE_ERROR, ETH_FEE_FETCH } from './constants';
import { ETHFeeState } from './types';

export const initialETHFee: ETHFeeState = {
	payload: [],
	loading: false,
};

export const ethFeeReducer = (state = initialETHFee, action: ETHFeeActions): ETHFeeState => {
	switch (action.type) {
		case ETH_FEE_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case ETH_FEE_DATA:
			return {
				...state,
				payload: action.payload,
				loading: false,
				error: undefined,
			};
		case ETH_FEE_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
