import { CommonState } from '../../../modules/types';

export interface StakingReward {
	reward_id: string;
	stake_id: string;
	period: string;
	annual_rate: string;
}

export interface Stake {
	stake_id: string;
	currency_id: string;
	total_amount: string;
	cap_amount: string;
	min_amount: string;
	cap_amount_per_user: string;
	staking_name: string;
	description?: string;
	start_time: string;
	end_time: string;
	active: boolean;
	rewards: StakingReward[];
	ref_link?: string;
	status: 'upcoming' | 'running' | 'ended' | '';
}

export interface StakeWallet {
	balance: string;
	locked: string;
	currency_id: string;
}

export interface StakeHistory {
	currency_id: string;
	period: number;
	rate: number;
	amount: string;
	distributed_amount: string;
	lockup_date: string;
	release_date: string;
	status: string;
}

export interface StakeHistoryState extends CommonState {
	payload: StakeHistory[];
	loading: boolean;
}

export interface UnStakeHistory {
	currency_id: string;
	amount: string;
	completed_at: string;
}

export interface UnStakeHistoryState {
	payload: UnStakeHistory[];
	loading: boolean;
}

export interface StakeWalletState extends CommonState {
	payload: StakeWallet[];
	loading: boolean;
}

export interface StakingListState extends CommonState {
	payload: Stake[];
	loading: boolean;
}

export interface CreateStakeState extends CommonState {
	loading: boolean;
}

export interface UnstakeState extends CommonState {
	loading: boolean;
}
