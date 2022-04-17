import { RootState } from '../../../index';
import { IEOCautionState } from './types';

export const selectIEOCaution = (state: RootState): IEOCautionState => state.plugins.ieo.ieoCaution;
