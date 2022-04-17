// import { sliceArray } from '../../../../helpers';
import { IEOItemActions } from './actions';
import { IEO_FIND_BY_ID, IEO_ITEM_DATA, IEO_ITEM_ERROR } from './constants';
import { IEOItemState } from './types';

export const initialIEOItem: IEOItemState = {
	payload: {
		id: '',
		host_uid: '',
		currency_id: '',
		image_link: '',
		currency_available: [],
		total_ieo: 0,
		remains: 0,
		price: 0,
		min_buy: 0,
		start_date: '',
		end_date: '',
		bonus: '',
		social: {},
		allBonus: [],
		type: 'upcoming',
		progress: 0,
	},
	loading: false,
};

export const IEOItemReducer = (state = initialIEOItem, action: IEOItemActions): IEOItemState => {
	switch (action.type) {
		case IEO_FIND_BY_ID:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case IEO_ITEM_DATA:
			const { payload } = action;
			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};
		case IEO_ITEM_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
