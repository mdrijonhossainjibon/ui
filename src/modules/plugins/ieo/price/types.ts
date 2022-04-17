import { CommonState } from '../../../types';

export interface PriceState extends CommonState {
	payload: any;
	loading: boolean;
}
