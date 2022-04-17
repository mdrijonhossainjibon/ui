import { IEOListActions } from './actions';
import { IEO_LIST_ERROR, IEO_LIST_DATA, IEO_LIST_FETCH } from './constants';
import { IEOListState } from './types';

export const initialIEOList: IEOListState = {
	payload: [],
	loading: false,
};

export const IEOListReducer = (state = initialIEOList, action: IEOListActions) => {
	switch (action.type) {
		case IEO_LIST_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case IEO_LIST_DATA:
			const data = action.payload as IEOListState;
			return {
				...state,
				payload: data,
				loading: false,
				error: undefined,
			};
		case IEO_LIST_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
