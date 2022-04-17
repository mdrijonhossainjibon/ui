import { BuyIEOActions } from './actions';
import {
	BUY_IEO_ERROR,
	BUY_IEO_LOADING,
	BUY_IEO_ITEM,
	GET_TOTAL_IEO_BUYERS,
	RESET_BUY_IEO_RESPONSE,
	TOTAL_IEO_BUYERS_DATA,
	TOTAL_IEO_BUYERS_ERROR,
} from './constants';
import { BuyIEOLoadingState, TotalIEOBuyersState } from './types';

export const initialBuyIEO: BuyIEOLoadingState = {
	loading: false,
	success: false,
};

export const buyIEOReducer = (state = initialBuyIEO, action: BuyIEOActions): BuyIEOLoadingState => {
	switch (action.type) {
		case BUY_IEO_ITEM:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case BUY_IEO_LOADING:
			const { success } = action.payload;
			return {
				...state,
				loading: false,
				success: success,
				error: undefined,
			};
		case BUY_IEO_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		case RESET_BUY_IEO_RESPONSE:
			return {
				...state,
				loading: false,
				success: false,
			};
		default:
			return state;
	}
};

export const initialTotalBuyersIEO: TotalIEOBuyersState = {
	payload: {
		totalBuyers: 0,
	},
	loading: false,
};

export const totalIEOBuyersReducer = (state = initialTotalBuyersIEO, action: BuyIEOActions): TotalIEOBuyersState => {
	switch (action.type) {
		case GET_TOTAL_IEO_BUYERS:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case TOTAL_IEO_BUYERS_DATA:
			const { payload } = action.payload;

			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};
		case TOTAL_IEO_BUYERS_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
