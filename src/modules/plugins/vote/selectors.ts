import { RootState } from '../../index';

export const selectVoteListLoading = (state: RootState) => state.plugins.vote.list.loading;
export const selectVoteListInfo = (state: RootState) => state.plugins.vote.list.info;
export const selectVoteListInfoRound = (state: RootState) => state.plugins.vote.list.infoRound;
export const selectVoteHistoryLoading = (state: RootState) => state.plugins.vote.history.loading;
export const selectVoteHistoryInfo = (state: RootState) => state.plugins.vote.history.info;
export const selectVoteDonateLoading = (state: RootState) => state.plugins.vote.donate.loading;
export const selectVoteDonateData = (state: RootState) => state.plugins.vote.donate.data;
export const selectVoteDonateFreeData = (state: RootState) => state.plugins.vote.donate.freeVote;
