import { IEOCautionState } from '.';
import { IEOCautionActions } from './actions';
import { FETCH_IEO_CAUTION, IEO_CAUTION_DATA, IEO_CAUTION_ERROR } from './constants';

export const initialDetailIEO: IEOCautionState = {
	payload: {
		ieo_id: '',
		name: '',
		notices: [],
	},
	loading: false,
};

export const IEOCautionReducer = (state = initialDetailIEO, action: IEOCautionActions) => {
	switch (action.type) {
		case FETCH_IEO_CAUTION:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case IEO_CAUTION_DATA:
			const { payload } = action.payload;
			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};
		case IEO_CAUTION_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
