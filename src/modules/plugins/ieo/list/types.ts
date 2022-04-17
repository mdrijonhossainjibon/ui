import { CommonState } from '../../../types';
import { IEOItem } from './../';

export interface IEOListState extends CommonState {
	payload: IEOItem[];
	loading: boolean;
}
