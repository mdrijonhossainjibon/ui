import { RootState } from '../../index';

export const selectFriendsList = (state: RootState) => state.plugins.referral.friends.payload;
export const selectFriendsLoading = (state: RootState) => state.plugins.referral.friends.loading;

export const selectCommisionHistories = (state: RootState) => state.plugins.referral.history.payload;
export const selectCommisionHistoryLoading = (state: RootState) => state.plugins.referral.history.loading;

export const selectReferalRanksList = (state: RootState) => state.plugins.referral.ranks.payload;
export const selectReferalRanksLoading = (state: RootState) => state.plugins.referral.ranks.loading;

export const selectEstimatedCommision = (state: RootState) => state.plugins.referral.estimatedCommision.payload;
export const selectEstimatedCommisionLoading = (state: RootState) => state.plugins.referral.estimatedCommision.loading;

export const selectCommisionInfo = (state: RootState) => state.plugins.referral.commisionInfo.payload;
export const selectCommisionInfoLoading = (state: RootState) => state.plugins.referral.commisionInfo.loading;
