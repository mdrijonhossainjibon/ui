// import { sliceArray } from '../../../../helpers';
import { StatisticActions } from './actions';

import { STATISTIC_DATA, STATISTIC_FETCH } from './constants';
import { StatisticState } from './types';

export const initialStatistic: StatisticState = {
	payload: {
		currencies: 0,
		members: 0,
		markets: 0,
	},
	loading: false,
};

export const statisticReducer = (state = initialStatistic, action: StatisticActions): StatisticState => {
	switch (action.type) {
		case STATISTIC_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case STATISTIC_DATA:
			const { payload, loading } = action.payload;

			return {
				...state,
				payload: payload,
				loading: loading,
				error: undefined,
			};

		default:
			return state;
	}
};
