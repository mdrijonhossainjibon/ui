import { StatisticState } from './types';
import { STATISTIC_DATA, STATISTIC_FETCH } from './constants';

export interface StatisticFetch {
	type: typeof STATISTIC_FETCH;
}

export interface StatisticData {
	type: typeof STATISTIC_DATA;
	payload: StatisticState;
}

export type StatisticActions = StatisticFetch | StatisticData;
export const statisticFetch = (): StatisticFetch => ({
	type: STATISTIC_FETCH,
});

export const statisticData = (payload: StatisticData['payload']): StatisticData => ({
	type: STATISTIC_DATA,
	payload,
});
