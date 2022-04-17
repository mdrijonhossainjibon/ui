import { RootState } from '../../../index';
import { ListCompetitionState } from './types';

export const selectCompetitionList = (state: RootState): ListCompetitionState => state.plugins.competition.competitionList;
