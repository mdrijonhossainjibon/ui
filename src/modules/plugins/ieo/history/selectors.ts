import { RootState } from '../../../index';
import { BuyHistoryListState, BuyersHistoryState } from './types';

export const selectBuyHistoryList = (state: RootState): BuyHistoryListState => state.plugins.ieo.buyHistory;
export const selectBuyersHistory = (state: RootState): BuyersHistoryState => state.plugins.ieo.buyersHistory;
