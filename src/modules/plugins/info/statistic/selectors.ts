import { RootState } from 'modules';
import { StatisticState } from './types';

export const selectStatistics = (state: RootState): StatisticState['payload'] => state.plugins.info.statistic.payload;
