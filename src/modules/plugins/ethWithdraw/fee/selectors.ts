import { RootState } from '../../../index';
import { ETHFeeState } from './types';

export const selectETHFee = (state: RootState): ETHFeeState['payload'] => state.plugins.ethFee.ethFee.payload;
