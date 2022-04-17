import { CommonState } from '../../../types';

export interface ETHFee {
	currency_id: string;
	fee: number;
}

export interface ETHFeeState extends CommonState {
	payload: ETHFee[];
	loading: boolean;
}
