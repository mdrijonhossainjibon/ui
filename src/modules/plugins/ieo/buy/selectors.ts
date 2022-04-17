import { RootState } from '../../../index';
import { BuyIEOLoadingState, TotalIEOBuyersState } from './types';

export const selectBuyIEO = (state: RootState): BuyIEOLoadingState => state.plugins.ieo.buyIEO;
export const selectTotalIEOBuyers = (state: RootState): TotalIEOBuyersState => state.plugins.ieo.totalIEOBuyers;
