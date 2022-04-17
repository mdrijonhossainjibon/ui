import { CommonState } from '../../../types';

export interface IEOCaution {
	ieo_id: number | '';
	name: string;
	notices: Array<string>;
}

export interface IEOCautionState extends CommonState {
	loading: boolean;
	payload: IEOCaution;
}
