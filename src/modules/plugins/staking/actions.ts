import { CommonError } from '../../../modules/types';
import {
	CREATE_STAKE,
	CREATE_STAKE_DATA,
	STAKE_HISTORY_DATA,
	STAKE_HISTORY_FETCH,
	STAKE_WALLET_DATA,
	STAKE_WALLET_FETCH,
	STAKING_LIST_DATA,
	STAKING_LIST_ERROR,
	STAKING_LIST_FETCH,
	UNSTAKE_DATA,
	UNSTAKE_HISTORY_DATA,
	UNSTAKE_HISTORY_FETCH,
	UNSTAKE_POST,
} from './constants';
import {
	CreateStakeState,
	StakeHistoryState,
	StakeWalletState,
	StakingListState,
	UnStakeHistoryState,
	UnstakeState,
} from './types';

export interface StakingListFetch {
	type: typeof STAKING_LIST_FETCH;
}

export interface CreateStake {
	type: typeof CREATE_STAKE;
	payload: {
		uid: string;
		stake_id: string;
		reward_id: string;
		amount: string;
		lockup_date: string;
		release_date: string;
	};
}

export interface CreateStakeData {
	type: typeof CREATE_STAKE_DATA;
	payload: CreateStakeState;
}

export interface StakingListData {
	type: typeof STAKING_LIST_DATA;
	payload: StakingListState;
}

export interface StakingListError {
	type: typeof STAKING_LIST_ERROR;
	error: CommonError;
}

export interface StakeWalletFetch {
	type: typeof STAKE_WALLET_FETCH;
	payload: {
		uid: string;
	};
}

export interface StakeWalletData {
	type: typeof STAKE_WALLET_DATA;
	payload: StakeWalletState;
}

export interface StakeHistoryFetch {
	type: typeof STAKE_HISTORY_FETCH;
	payload: {
		uid: string;
		stake_id: string;
	};
}

export interface StakeHistoryData {
	type: typeof STAKE_HISTORY_DATA;
	payload: StakeHistoryState;
}
export interface UnStakeHistoryFetch {
	type: typeof UNSTAKE_HISTORY_FETCH;
	payload: {
		uid: string;
		currency_id: string;
	};
}

export interface UnStakeHistoryData {
	type: typeof UNSTAKE_HISTORY_DATA;
	payload: UnStakeHistoryState;
}

export interface UnstakePost {
	type: typeof UNSTAKE_POST;
	payload: {
		uid: string;
		currency_id: string;
		amount: string;
	};
}

export interface UnstakeData {
	type: typeof UNSTAKE_DATA;
	payload: UnstakeState;
}

export type StakingActions =
	| StakingListFetch
	| StakingListData
	| StakingListError
	| CreateStake
	| CreateStakeData
	| StakeWalletFetch
	| StakeWalletData
	| StakeHistoryFetch
	| StakeHistoryData
	| UnstakePost
	| UnstakeData
	| UnStakeHistoryFetch
	| UnStakeHistoryData;

export const stakingListFetch = (): StakingListFetch => ({
	type: STAKING_LIST_FETCH,
});

export const stakingListData = (payload: StakingListData['payload']): StakingListData => ({
	type: STAKING_LIST_DATA,
	payload,
});

export const stakingListError = (error: StakingListError['error']): StakingListError => ({
	type: STAKING_LIST_ERROR,
	error,
});

export const createStake = (payload: CreateStake['payload']): CreateStake => ({
	type: CREATE_STAKE,
	payload,
});

export const createStakeData = (payload: CreateStakeData['payload']): CreateStakeData => ({
	type: CREATE_STAKE_DATA,
	payload,
});

export const stakeWalletFetch = (payload: StakeWalletFetch['payload']): StakeWalletFetch => ({
	type: STAKE_WALLET_FETCH,
	payload,
});

export const stakeWalletData = (payload: StakeWalletData['payload']): StakeWalletData => ({
	type: STAKE_WALLET_DATA,
	payload,
});

export const stakeHistoryFetch = (payload: StakeHistoryFetch['payload']): StakeHistoryFetch => ({
	type: STAKE_HISTORY_FETCH,
	payload,
});

export const stakeHistoryData = (payload: StakeHistoryData['payload']): StakeHistoryData => ({
	type: STAKE_HISTORY_DATA,
	payload,
});

export const unStakeHistoryFetch = (payload: UnStakeHistoryFetch['payload']): UnStakeHistoryFetch => ({
	type: UNSTAKE_HISTORY_FETCH,
	payload,
});

export const unStakeHistoryData = (payload: UnStakeHistoryData['payload']): UnStakeHistoryData => ({
	type: UNSTAKE_HISTORY_DATA,
	payload,
});

export const unStakePost = (payload: UnstakePost['payload']): UnstakePost => ({
	type: UNSTAKE_POST,
	payload,
});

export const unStakeData = (payload: UnstakeData['payload']): UnstakeData => ({
	type: UNSTAKE_DATA,
	payload,
});
