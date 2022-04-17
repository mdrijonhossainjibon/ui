import { RootState } from '../../../index';
import { IEOListState } from './types';

export const selectIEOList = (state: RootState): IEOListState['payload'] => state.plugins.ieo.IEOList.payload;
export const selectIEOListLoading = (state: RootState): IEOListState['loading'] => state.plugins.ieo.IEOList.loading;
