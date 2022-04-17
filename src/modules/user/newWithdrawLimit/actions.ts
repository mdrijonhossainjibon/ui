import { NewWithdrawLimitCheckingState, NewWithdrawLimitRemainsState } from '.';
import {
	WITHDRAW_LIMIT_CHECKING,
	WITHDRAW_LIMIT_CHECKING_RESPONSE,
	WITHDRAW_LIMIT_FETCH_REMAINS,
	WITHDRAW_LIMIT_FETCH_REMAINS_DATA,
} from './constants';

export interface WithdrawLimitFetchRemains {
	type: typeof WITHDRAW_LIMIT_FETCH_REMAINS;
	payload: {
		currency_id: string;
	};
}

export interface WithdrawLimitFetchRemainsData extends NewWithdrawLimitRemainsState {
	type: typeof WITHDRAW_LIMIT_FETCH_REMAINS_DATA;
}

export interface WithdrawLimitChecking {
	type: typeof WITHDRAW_LIMIT_CHECKING;
	payload: {
		currency_id: string;
		total_withdraw: number;
	};
}

export interface WithdrawLimitCheckingResponse extends NewWithdrawLimitCheckingState {
	type: typeof WITHDRAW_LIMIT_CHECKING_RESPONSE;
}
export type WithdrawLimitFetchRemainsActions = WithdrawLimitFetchRemains | WithdrawLimitFetchRemainsData;
export type WithdrawLimitCheckingActions = WithdrawLimitChecking | WithdrawLimitCheckingResponse;
export const withdrawLimitFetchRemains = (payload: WithdrawLimitFetchRemains['payload']): WithdrawLimitFetchRemains => ({
	type: WITHDRAW_LIMIT_FETCH_REMAINS,
	payload,
});

export const withdrawLimitRemainsData = (payload: WithdrawLimitFetchRemainsData['payload']): WithdrawLimitFetchRemainsData => ({
	type: WITHDRAW_LIMIT_FETCH_REMAINS_DATA,
	payload,
	loading: false,
});

export const withdrawLimitChecking = (payload: WithdrawLimitChecking['payload']): WithdrawLimitChecking => ({
	type: WITHDRAW_LIMIT_CHECKING,
	payload,
});

export const withdrawLimitCheckingResponse = (
	payload: WithdrawLimitCheckingResponse['payload'],
): WithdrawLimitCheckingResponse => ({
	type: WITHDRAW_LIMIT_CHECKING_RESPONSE,
	payload,
	loading: false,
});
