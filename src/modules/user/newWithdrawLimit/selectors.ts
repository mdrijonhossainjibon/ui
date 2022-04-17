import { NewWithdrawLimitCheckingState, NewWithdrawLimitRemainsState, RootState } from '../../';

export const selectWithdrawLimitRemains = (state: RootState): NewWithdrawLimitRemainsState => state.user.newWithdrawLimit.remains;
export const selectWithdrawLimitChecking = (state: RootState): NewWithdrawLimitCheckingState =>
	state.user.newWithdrawLimit.checking;
