import { CommonState } from 'modules/types';
import { NewCompetition } from '../item/types';

export interface ListCompetitionState extends CommonState {
	payload: NewCompetition[];
	loading: boolean;
}
