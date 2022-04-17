import { DetailIEOState } from '.';
import { IEODetailActions } from './actions';
import { FETCH_IEO_DETAIL, IEO_DETAIL, IEO_DETAIL_ERROR } from './constants';

export const initialDetailIEO: DetailIEOState = {
	payload: {
		ieo_id: '',
		name: '',
		price: '',
		bonus: '',
		softcap: '',
		usage: '',
		tech: '',
		date: '',
		homepage: '',
		bonus_lockup: '',
		whitepaper: '',
		bottom_banner: '',
		hardcap: '',
		sns: [],
	},
	loading: false,
};

export const IEODetailReducer = (state = initialDetailIEO, action: IEODetailActions) => {
	switch (action.type) {
		case FETCH_IEO_DETAIL:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case IEO_DETAIL:
			const { payload } = action.payload;
			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};
		case IEO_DETAIL_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
