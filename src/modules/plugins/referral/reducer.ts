import {
	FriendsActions,
	CommisionHistoryActions,
	ReferralRanksActions,
	EstimatedCommisionActions,
	CommisionInfoActions,
} from './actions';
import {
	FRIENDS_LIST_FETCH,
	FRIENDS_LIST_DATA,
	COMMISION_HISTORY_FETCH,
	COMMISION_HISTORY_DATA,
	REFERRAL_RANKS_FETCH,
	REFERRAL_RANKS_DATA,
	ESTIMATED_COMMISION_DATA,
	ESTIMATED_COMMISION_FETCH,
	COMMISION_INFO_FETCH,
	COMMISION_INFO_DATA,
} from './constants';
import { FriendsListState, CommisionHistoryState, ReferralRankState, EstimatedCommisionState, CommisionInfoState } from './types';

const initialFriendsListState: FriendsListState = {
	payload: [0, []],
	loading: false,
};

export const friendsListReducer = (state = initialFriendsListState, action: FriendsActions): FriendsListState => {
	switch (action.type) {
		case FRIENDS_LIST_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case FRIENDS_LIST_DATA:
			const { payload, loading } = action.payload;
			return {
				...state,
				payload: payload,
				loading: loading,
				error: undefined,
			};
		default:
			return state;
	}
};

const initialCommisionHistoryState: CommisionHistoryState = {
	payload: [0, []],
	loading: false,
};

export const commsionHistoryReducer = (
	state = initialCommisionHistoryState,
	action: CommisionHistoryActions,
): CommisionHistoryState => {
	switch (action.type) {
		case COMMISION_HISTORY_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case COMMISION_HISTORY_DATA:
			const { payload, loading } = action.payload;
			return {
				...state,
				payload: payload,
				loading: loading,
				error: undefined,
			};
		default:
			return state;
	}
};

const initialReferralRanksState: ReferralRankState = {
	payload: [],
	loading: false,
};

export const referralRanksReducer = (state = initialReferralRanksState, action: ReferralRanksActions): ReferralRankState => {
	switch (action.type) {
		case REFERRAL_RANKS_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case REFERRAL_RANKS_DATA:
			const { payload, loading } = action.payload;
			return {
				...state,
				payload: payload,
				loading: loading,
				error: undefined,
			};
		default:
			return state;
	}
};

const initialEstimatedCommisionState: EstimatedCommisionState = {
	payload: {
		total: '0.0000 USDT',
	},
	loading: false,
};

export const estimatedCommisionReducer = (
	state = initialEstimatedCommisionState,
	action: EstimatedCommisionActions,
): EstimatedCommisionState => {
	switch (action.type) {
		case ESTIMATED_COMMISION_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case ESTIMATED_COMMISION_DATA:
			const { payload, loading } = action.payload;
			return {
				...state,
				payload: payload,
				loading: loading,
				error: undefined,
			};
		default:
			return state;
	}
};

const initialCommisionInfoState: CommisionInfoState = {
	payload: {
		dekstop_image: '',
		mobile_image: '',
	},
	loading: false,
};

export const commisionInfoReducer = (state = initialCommisionInfoState, action: CommisionInfoActions): CommisionInfoState => {
	switch (action.type) {
		case COMMISION_INFO_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case COMMISION_INFO_DATA:
			const { payload, loading } = action.payload;
			return {
				...state,
				payload: payload,
				loading: loading,
				error: undefined,
			};
		default:
			return state;
	}
};
