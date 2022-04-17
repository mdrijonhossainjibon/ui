import { RootState } from '../../../index';
import { CompetitionAwardState } from './types';

export const selectCompetitionAward = (state: RootState): CompetitionAwardState => state.plugins.competition.competitionAward;
