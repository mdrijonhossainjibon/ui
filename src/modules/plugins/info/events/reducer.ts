// import { sliceArray } from '../../../../helpers';
import { EventActions } from './actions';
import { EVENT_DATA, EVENT_ERROR, EVENT_FETCH } from './constants';
import { EventsState } from './types';

export const initialEvent: EventsState = {
	payload: [],
	loading: false,
};

export const eventReducer = (state = initialEvent, action: EventActions): EventsState => {
	switch (action.type) {
		case EVENT_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case EVENT_DATA:
			const { payload } = action.payload;

			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};
		case EVENT_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
