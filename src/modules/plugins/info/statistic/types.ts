import { CommonState } from '../../../../modules/types';
export interface Statistic {
	currencies: number;
	markets: number;
	members: number;
}
export interface StatisticState extends CommonState {
	payload: Statistic;
	loading: boolean;
}
