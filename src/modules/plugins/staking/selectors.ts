import { RootState } from '../../index';
import { StakeHistoryState, StakeWalletState, StakingListState, UnStakeHistoryState } from './types';

export const selectCreateStakeLoading = (state: RootState): boolean => state.plugins.stake.createStake.loading;

export const selectStakingList = (state: RootState): StakingListState['payload'] => state.plugins.stake.stakeList.payload;
export const selectStakingListLoading = (state: RootState): boolean => state.plugins.stake.stakeList.loading;

export const selectStakeWallet = (state: RootState): StakeWalletState['payload'] => state.plugins.stake.stakeWallet.payload;
export const selectStakeWalletLoading = (state: RootState): boolean => state.plugins.stake.stakeWallet.loading;

export const selectStakeHistories = (state: RootState): StakeHistoryState['payload'] => state.plugins.stake.stakeHistory.payload;
export const selectStakeHistoriesLoading = (state: RootState): boolean => state.plugins.stake.stakeHistory.loading;

export const selectUnstakeLoading = (state: RootState): boolean => state.plugins.stake.unstake.loading;
export const selectUnstakeHistory = (state: RootState): UnStakeHistoryState['payload'] =>
	state.plugins.stake.unstakeHistory.payload;
export const selectUnstakeHistoryLoading = (state: RootState): boolean => state.plugins.stake.unstakeHistory.loading;
