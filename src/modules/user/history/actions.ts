import {
	DEPOSIT_HISTORY_DATA,
	DEPOSIT_HISTORY_FETCH,
	HISTORY_ALL_DATA,
	HISTORY_ALL_FETCH,
	HISTORY_DATA,
	HISTORY_ERROR,
	HISTORY_FETCH,
	HISTORY_PUSH_EMIT,
	HISTORY_PUSH_FINISH,
	HISTORY_RESET,
	WITHDRAW_HISTORY_DATA,
	WITHDRAW_HISTORY_FETCH,
} from './constants';
import { DepositHistoryState, PrivateTradeEvent, WalletHistoryList, WithdrawHistoryState } from './types';

export interface HistoryFetchPayload {
	currency?: string;
	page: number;
	type: string;
	limit?: number;
	market?: string;
	time_from?: string;
	time_to?: string;
}

interface HistorySuccessPayload {
	list: WalletHistoryList;
	page: number;
	nextPageExists: boolean;
}
interface HistorySuccessAllPayload {
	list: WalletHistoryList;
}

export interface HistoryFetch {
	type: typeof HISTORY_FETCH;
	payload: HistoryFetchPayload;
}

export interface HistoryData {
	type: typeof HISTORY_DATA;
	payload: HistorySuccessPayload;
}

export interface HistoryAllFetch {
	type: typeof HISTORY_ALL_FETCH;
	payload: HistoryFetchPayload;
}

export interface HistoryAllData {
	type: typeof HISTORY_ALL_DATA;
	payload: HistorySuccessAllPayload;
}

export interface HistoryError {
	type: typeof HISTORY_ERROR;
	payload: WalletHistoryList;
}

export interface HistoryPushFinish {
	type: typeof HISTORY_PUSH_FINISH;
	payload: WalletHistoryList;
}

export interface HistoryReset {
	type: typeof HISTORY_RESET;
}

export interface HistoryPush {
	type: typeof HISTORY_PUSH_EMIT;
	payload: PrivateTradeEvent;
}

export interface WithdrawHistoryFetch {
	type: typeof WITHDRAW_HISTORY_FETCH;
	payload: {
		currency: string;
	};
}

export interface WithdrawHistoryData {
	type: typeof WITHDRAW_HISTORY_DATA;
	payload: WithdrawHistoryState;
}

export interface DepositHistoryFetch {
	type: typeof DEPOSIT_HISTORY_FETCH;
	payload: {
		currency: string;
	};
}

export interface DepositHistoryData {
	type: typeof DEPOSIT_HISTORY_DATA;
	payload: DepositHistoryState;
}

export type HistoryActions =
	| HistoryFetch
	| HistoryData
	| HistoryError
	| HistoryReset
	| HistoryPush
	| HistoryAllFetch
	| HistoryAllData
	| HistoryPushFinish
	| WithdrawHistoryFetch
	| WithdrawHistoryData
	| DepositHistoryFetch
	| DepositHistoryData;

export type WithdrawHistoryActions = WithdrawHistoryFetch | WithdrawHistoryData;
export type DepositHistoryActions = DepositHistoryFetch | DepositHistoryData;

export const fetchHistory = (payload: HistoryFetchPayload): HistoryFetch => ({
	type: HISTORY_FETCH,
	payload,
});

export const successHistory = (payload: HistorySuccessPayload): HistoryData => ({
	type: HISTORY_DATA,
	payload,
});

export const historyAllFetch = (payload: HistoryFetchPayload): HistoryAllFetch => ({
	type: HISTORY_ALL_FETCH,
	payload,
});

export const historyAllData = (payload: HistorySuccessAllPayload): HistoryAllData => ({
	type: HISTORY_ALL_DATA,
	payload,
});

export const failHistory = (payload: WalletHistoryList): HistoryError => ({
	type: HISTORY_ERROR,
	payload,
});

export const resetHistory = (): HistoryReset => ({
	type: HISTORY_RESET,
});

export const pushHistoryEmit = (payload: PrivateTradeEvent): HistoryPush => ({
	type: HISTORY_PUSH_EMIT,
	payload,
});

export const pushHistoryFinish = (payload: WalletHistoryList): HistoryPushFinish => ({
	type: HISTORY_PUSH_FINISH,
	payload,
});

export const withdrawHistoryFetch = (payload: { currency: string }): WithdrawHistoryFetch => ({
	type: WITHDRAW_HISTORY_FETCH,
	payload,
});

export const withdrawHistoryData = (payload: WithdrawHistoryData['payload']): WithdrawHistoryData => ({
	type: WITHDRAW_HISTORY_DATA,
	payload,
});

export const depositHistoryFetch = (payload: { currency: string }): DepositHistoryFetch => ({
	type: DEPOSIT_HISTORY_FETCH,
	payload,
});

export const depositHistoryData = (payload: DepositHistoryData['payload']): DepositHistoryData => ({
	type: DEPOSIT_HISTORY_DATA,
	payload,
});
