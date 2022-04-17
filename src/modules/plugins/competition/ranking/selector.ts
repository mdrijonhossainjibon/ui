import { RootState } from '../../../index';
import { RankingCompetitionState } from './types';

export const selectRankingCompetition = (state: RootState): RankingCompetitionState =>
	state.plugins.competition.competitionRanking;
