import { WalletsWithdrawLimitState } from 'modules';
import { CommonError } from '../../types';
import {
	ALL_CHILD_CURRENCIES_DATA,
	ALL_CHILD_CURRENCIES_ERROR,
	ALL_CHILD_CURRENCIES_FETCH,
	SET_MOBILE_WALLET_UI,
	WALLETS_ADDRESS_DATA,
	WALLETS_ADDRESS_DATA_WS,
	WALLETS_ADDRESS_ERROR,
	WALLETS_ADDRESS_FETCH,
	WALLETS_CHILD_CURRENCIES_DATA,
	WALLETS_CHILD_CURRENCIES_ERROR,
	WALLETS_CHILD_CURRENCIES_FETCH,
	WALLETS_DATA,
	WALLETS_DATA_WS,
	WALLETS_ERROR,
	WALLETS_FETCH,
	WALLETS_RESET,
	WALLETS_WITHDRAW_CCY_DATA,
	WALLETS_WITHDRAW_CCY_ERROR,
	WALLETS_WITHDRAW_CCY_FETCH,
	WALLETS_WITHDRAW_CCY_PROCESS_FETCH as WALLETS_WITHDRAW_CCY_PROCESS_FETCH,
	WALLETS_WITHDRAW_LIMIT_FETCH,
	WALLETS_WITHDRAW_LIMIT_DATA,
} from './constants';
import { ChildCurrenciesState, Wallet, WalletAddress, WalletWithdrawCCY } from './types';

export interface WalletsFetch {
	type: typeof WALLETS_FETCH;
}

export interface WalletsData {
	type: typeof WALLETS_DATA;
	payload: Wallet[];
}

export interface WalletsDataByRanger {
	type: typeof WALLETS_DATA_WS;
	payload: {
		ws: boolean;
		balances;
	};
}

export interface WalletsError {
	type: typeof WALLETS_ERROR;
	payload: CommonError;
}

export interface WalletsReset {
	type: typeof WALLETS_RESET;
}

export interface WalletsAddressFetch {
	type: typeof WALLETS_ADDRESS_FETCH;
	payload: {
		currency: string;
	};
}

export interface WalletsAddressData {
	type: typeof WALLETS_ADDRESS_DATA;
	payload: WalletAddress;
}

export interface WalletsAddressDataWS {
	type: typeof WALLETS_ADDRESS_DATA_WS;
	payload: WalletAddress;
}

export interface WalletsAddressError {
	type: typeof WALLETS_ADDRESS_ERROR;
	payload: CommonError;
}

export interface WalletsWithdrawCcyFetch {
	type: typeof WALLETS_WITHDRAW_CCY_FETCH;
	payload: WalletWithdrawCCY;
}

export interface WalletsWithdrawCcyData {
	type: typeof WALLETS_WITHDRAW_CCY_DATA;
	payload: {
		withdrawProcess: number;
		showProcessPopup: boolean;
		status?: 'fail' | 'success';
		isFinish: boolean;
		reason?: string;
	};
}

export interface WalletsWithdrawCcyError {
	type: typeof WALLETS_WITHDRAW_CCY_ERROR;
	payload: CommonError;
}

export interface WalletWithdrawCcyProccessFetch {
	type: typeof WALLETS_WITHDRAW_CCY_PROCESS_FETCH;
	payload: number;
}

export interface SetMobileWalletUi {
	type: typeof SET_MOBILE_WALLET_UI;
	payload: string;
}

export interface WalletsChildCurrenciesFetch {
	type: typeof WALLETS_CHILD_CURRENCIES_FETCH;
	payload: {
		currency: string;
	};
}

export interface WalletsChildCurrenciesData {
	type: typeof WALLETS_CHILD_CURRENCIES_DATA;
	payload: ChildCurrenciesState;
}

export interface WalletsChildCurrenciesError {
	type: typeof WALLETS_CHILD_CURRENCIES_ERROR;
	error: CommonError;
}

export interface AllChildCurrenciesFetch {
	type: typeof ALL_CHILD_CURRENCIES_FETCH;
}

export interface AllChildCurrenciesData {
	type: typeof ALL_CHILD_CURRENCIES_DATA;
	payload: ChildCurrenciesState;
}

export interface AllChildCurrenciesError {
	type: typeof ALL_CHILD_CURRENCIES_ERROR;
	error: CommonError;
}

export interface WalletsWithdrawLimitFetch {
	type: typeof WALLETS_WITHDRAW_LIMIT_FETCH;
}

export interface WalletsWithdrawLimitData {
	type: typeof WALLETS_WITHDRAW_LIMIT_DATA;
	payload: WalletsWithdrawLimitState;
}

export type WalletsAction =
	| WalletsFetch
	| WalletsData
	| WalletsDataByRanger
	| WalletsError
	| WalletsAddressFetch
	| WalletsAddressData
	| WalletsAddressDataWS
	| WalletsAddressError
	| WalletsWithdrawCcyFetch
	| WalletsWithdrawCcyData
	| WalletsWithdrawCcyError
	| WalletWithdrawCcyProccessFetch
	| WalletsReset
	| SetMobileWalletUi
	| WalletsChildCurrenciesFetch
	| WalletsChildCurrenciesData
	| WalletsChildCurrenciesError
	| AllChildCurrenciesFetch
	| AllChildCurrenciesData
	| AllChildCurrenciesError
	| WalletsWithdrawLimitFetch
	| WalletsWithdrawLimitData;

export const walletsFetch = (): WalletsFetch => ({
	type: WALLETS_FETCH,
});

export const walletsData = (payload: WalletsData['payload']): WalletsData => ({
	type: WALLETS_DATA,
	payload,
});

export const updateWalletsDataByRanger = (payload: WalletsDataByRanger['payload']): WalletsDataByRanger => ({
	type: WALLETS_DATA_WS,
	payload,
});

export const walletsError = (payload: WalletsError['payload']): WalletsError => ({
	type: WALLETS_ERROR,
	payload,
});

export const walletsAddressFetch = (payload: WalletsAddressFetch['payload']): WalletsAddressFetch => ({
	type: WALLETS_ADDRESS_FETCH,
	payload,
});

export const walletsAddressData = (payload: WalletsAddressData['payload']): WalletsAddressData => ({
	type: WALLETS_ADDRESS_DATA,
	payload,
});

export const walletsAddressError = (payload: WalletsAddressError['payload']): WalletsAddressError => ({
	type: WALLETS_ADDRESS_ERROR,
	payload,
});

export const walletsAddressDataWS = (payload: WalletsAddressDataWS['payload']): WalletsAddressDataWS => ({
	type: WALLETS_ADDRESS_DATA_WS,
	payload,
});

export const walletsWithdrawCcyFetch = (payload: WalletsWithdrawCcyFetch['payload']): WalletsWithdrawCcyFetch => ({
	type: WALLETS_WITHDRAW_CCY_FETCH,
	payload,
});

export const walletsWithdrawCcyData = (payload: WalletsWithdrawCcyData['payload']): WalletsWithdrawCcyData => ({
	type: WALLETS_WITHDRAW_CCY_DATA,
	payload,
});

export const walletsWithdrawCcyError = (payload: WalletsWithdrawCcyError['payload']): WalletsWithdrawCcyError => ({
	type: WALLETS_WITHDRAW_CCY_ERROR,
	payload,
});

export const walletsWithdrawCcyProcessFetch = (
	payload: WalletWithdrawCcyProccessFetch['payload'],
): WalletWithdrawCcyProccessFetch => ({
	type: WALLETS_WITHDRAW_CCY_PROCESS_FETCH,
	payload,
});

export const walletsReset = (): WalletsReset => ({
	type: WALLETS_RESET,
});

export const setMobileWalletUi = (payload: SetMobileWalletUi['payload']): SetMobileWalletUi => ({
	type: SET_MOBILE_WALLET_UI,
	payload,
});

export const walletsChildCurrenciesFetch = (payload: WalletsChildCurrenciesFetch['payload']): WalletsChildCurrenciesFetch => ({
	type: WALLETS_CHILD_CURRENCIES_FETCH,
	payload,
});

export const walletsChildCurrenciesData = (payload: WalletsChildCurrenciesData['payload']): WalletsChildCurrenciesData => ({
	type: WALLETS_CHILD_CURRENCIES_DATA,
	payload,
});

export const walletsChildCurrenciesError = (error: WalletsChildCurrenciesError['error']): WalletsChildCurrenciesError => ({
	type: WALLETS_CHILD_CURRENCIES_ERROR,
	error,
});

export const allChildCurrenciesFetch = (): AllChildCurrenciesFetch => ({
	type: ALL_CHILD_CURRENCIES_FETCH,
});

export const allChildCurrenciesData = (payload: AllChildCurrenciesData['payload']): AllChildCurrenciesData => ({
	type: ALL_CHILD_CURRENCIES_DATA,
	payload,
});

export const allChildCurrenciesError = (error: AllChildCurrenciesError['error']): AllChildCurrenciesError => ({
	type: ALL_CHILD_CURRENCIES_ERROR,
	error,
});

export const walletsWithdrawLimitFetch = (): WalletsWithdrawLimitFetch => ({
	type: WALLETS_WITHDRAW_LIMIT_FETCH,
});

export const walletsWithdrawLimitData = (payload: WalletsWithdrawLimitData['payload']): WalletsWithdrawLimitData => ({
	type: WALLETS_WITHDRAW_LIMIT_DATA,
	payload,
});
