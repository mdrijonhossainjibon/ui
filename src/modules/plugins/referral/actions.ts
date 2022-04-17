import {
	FRIENDS_LIST_FETCH,
	FRIENDS_LIST_DATA,
	COMMISION_HISTORY_FETCH,
	COMMISION_HISTORY_DATA,
	REFERRAL_RANKS_FETCH,
	REFERRAL_RANKS_DATA,
	ESTIMATED_COMMISION_FETCH,
	ESTIMATED_COMMISION_DATA,
	COMMISION_INFO_FETCH,
	COMMISION_INFO_DATA,
} from './constants';
import { CommisionHistoryState, CommisionInfoState, EstimatedCommisionState, FriendsListState, ReferralRankState } from './types';

export interface FriendsListFetch {
	type: typeof FRIENDS_LIST_FETCH;
	payload: {
		page: number;
		limit: number;
	};
}
export interface FriendsListData {
	type: typeof FRIENDS_LIST_DATA;
	payload: FriendsListState;
}

export interface CommisionHistoryFetch {
	type: typeof COMMISION_HISTORY_FETCH;
	payload: {
		page: number;
		limit: number;
	};
}
export interface CommisionHistoryData {
	type: typeof COMMISION_HISTORY_DATA;
	payload: CommisionHistoryState;
}

export interface ReferralRanksFetch {
	type: typeof REFERRAL_RANKS_FETCH;
}
export interface ReferralRanksData {
	type: typeof REFERRAL_RANKS_DATA;
	payload: ReferralRankState;
}

export interface EstimatedCommisionFetch {
	type: typeof ESTIMATED_COMMISION_FETCH;
}
export interface EstimatedCommisionData {
	type: typeof ESTIMATED_COMMISION_DATA;
	payload: EstimatedCommisionState;
}

export interface CommisionInfoFetch {
	type: typeof COMMISION_INFO_FETCH;
}
export interface CommisionInfoData {
	type: typeof COMMISION_INFO_DATA;
	payload: CommisionInfoState;
}

export type FriendsActions = FriendsListFetch | FriendsListData;
export type CommisionHistoryActions = CommisionHistoryFetch | CommisionHistoryData;
export type ReferralRanksActions = ReferralRanksFetch | ReferralRanksData;
export type EstimatedCommisionActions = EstimatedCommisionFetch | EstimatedCommisionData;
export type CommisionInfoActions = CommisionInfoFetch | CommisionInfoData;

export const friendsListFetch = (payload: FriendsListFetch['payload']): FriendsListFetch => ({
	type: FRIENDS_LIST_FETCH,
	payload,
});

export const friendsListData = (payload: FriendsListData['payload']): FriendsListData => ({
	type: FRIENDS_LIST_DATA,
	payload,
});

export const commisionHistoryFetch = (payload: CommisionHistoryFetch['payload']): CommisionHistoryFetch => ({
	type: COMMISION_HISTORY_FETCH,
	payload,
});

export const commisionHistoryData = (payload: CommisionHistoryData['payload']): CommisionHistoryData => ({
	type: COMMISION_HISTORY_DATA,
	payload,
});

export const referralRanksFetch = (): ReferralRanksFetch => ({
	type: REFERRAL_RANKS_FETCH,
});

export const referralRanksData = (payload: ReferralRanksData['payload']): ReferralRanksData => ({
	type: REFERRAL_RANKS_DATA,
	payload,
});

export const estimatedCommisionFetch = (): EstimatedCommisionFetch => ({
	type: ESTIMATED_COMMISION_FETCH,
});

export const estimatedCommisionData = (payload: EstimatedCommisionData['payload']): EstimatedCommisionData => ({
	type: ESTIMATED_COMMISION_DATA,
	payload,
});

export const commisionInfoFetch = (): CommisionInfoFetch => ({
	type: COMMISION_INFO_FETCH,
});

export const commisionInfoData = (payload: CommisionInfoData['payload']): CommisionInfoData => ({
	type: COMMISION_INFO_DATA,
	payload,
});
