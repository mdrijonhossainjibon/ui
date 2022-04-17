import { WalletsWithdrawLimitState } from 'modules';
import { CommonError } from '../../types';
import { WalletsAction } from './actions';
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
	WALLETS_WITHDRAW_CCY_PROCESS_FETCH,
	WALLETS_WITHDRAW_LIMIT_FETCH,
	WALLETS_WITHDRAW_LIMIT_DATA,
} from './constants';
import { ChildCurrenciesState, Wallet } from './types';

export interface WalletsState {
	wallets: {
		list: Wallet[];
		loading: boolean;
		withdrawSuccess: boolean;
		error?: CommonError;
		mobileWalletChosen: string;
		selectedWalletCurrency: string;
		selectedWalletAddress: string;
		timestamp?: number;
		process: {
			percent: number;
			showWithdrawProcess: boolean;
			isFinishWithdraw: boolean;
			status?: 'success' | 'fail';
			reason?: string;
		};
	};
}

export const initialWalletsState: WalletsState = {
	wallets: {
		list: [],
		loading: false,
		withdrawSuccess: false,
		mobileWalletChosen: '',
		selectedWalletCurrency: '',
		selectedWalletAddress: '',
		process: {
			percent: 10,
			showWithdrawProcess: false,
			isFinishWithdraw: false,
			reason: '',
		},
	},
};

const walletsListReducer = (state: WalletsState['wallets'], action: WalletsAction): WalletsState['wallets'] => {
	switch (action.type) {
		case WALLETS_ADDRESS_FETCH:
		case WALLETS_FETCH:
			return {
				...state,
				loading: true,
				timestamp: Math.floor(Date.now() / 1000),
			};
		case WALLETS_WITHDRAW_CCY_FETCH:
			return {
				...state,
				loading: true,
				withdrawSuccess: false,
			};

		case WALLETS_DATA: {
			return {
				...state,
				loading: false,
				list: action.payload,
			};
		}
		case WALLETS_DATA_WS: {
			let updatedList = state.list;

			if (state.list.length) {
				updatedList = state.list.map(wallet => {
					let updatedWallet = wallet;
					const payloadCurrencies = Object.keys(action.payload.balances);

					if (payloadCurrencies.length) {
						payloadCurrencies.some(value => {
							const targetWallet = action.payload.balances[value];

							if (value === wallet.currency) {
								updatedWallet = {
									...updatedWallet,
									balance: targetWallet && targetWallet[0] ? targetWallet[0] : updatedWallet.balance,
									locked: targetWallet && targetWallet[1] ? targetWallet[1] : updatedWallet.locked,
								};

								return true;
							}

							return false;
						});
					}

					return updatedWallet;
				});
			}

			return {
				...state,
				loading: false,
				list: updatedList,
			};
		}
		case WALLETS_ADDRESS_DATA: {
			// const walletIndex = state.list.findIndex(
			// 	wallet => wallet.currency.toLowerCase() === action.payload.currency.toLowerCase(),
			// );

			// if (walletIndex !== -1) {
			// 	return {
			// 		...state,
			// 		loading: false,
			// 		selectedWalletCurrency: action.payload.currency,
			// 		selectedWalletAddress: action.payload.address,
			// 	};
			// }

			return {
				...state,
				loading: false,
				selectedWalletCurrency: action.payload.currency,
				selectedWalletAddress: action.payload.address,
			};
		}
		case WALLETS_WITHDRAW_CCY_DATA:
			return {
				...state,
				loading: false,
				withdrawSuccess: true,
				process: {
					percent: action.payload.withdrawProcess,
					showWithdrawProcess: action.payload.showProcessPopup,
					isFinishWithdraw: action.payload.isFinish,
					status: action.payload.status,
					reason: action.payload.reason,
				},
			};
		case WALLETS_WITHDRAW_CCY_PROCESS_FETCH:
			return {
				...state,
				loading: false,
				withdrawSuccess: true,
			};
		case WALLETS_ADDRESS_DATA_WS: {
			if (state.selectedWalletCurrency === action.payload.currency) {
				return {
					...state,
					loading: false,
					selectedWalletAddress: action.payload.address,
				};
			}

			return {
				...state,
				loading: false,
			};
		}
		case WALLETS_WITHDRAW_CCY_ERROR:
			return {
				...state,
				loading: false,
				withdrawSuccess: false,
				error: action.payload,
			};
		case WALLETS_ADDRESS_ERROR:
		case WALLETS_ERROR:
			return {
				...state,
				loading: false,
				error: action.payload,
			};

		case SET_MOBILE_WALLET_UI:
			return { ...state, mobileWalletChosen: action.payload };
		default:
			return {
				...state,
				loading: false,
			};
	}
};

export const walletsReducer = (state = initialWalletsState, action: WalletsAction): WalletsState => {
	switch (action.type) {
		case WALLETS_FETCH:
		case WALLETS_DATA:
		case WALLETS_DATA_WS:
		case WALLETS_ERROR:
		case WALLETS_ADDRESS_FETCH:
		case WALLETS_ADDRESS_DATA:
		case WALLETS_ADDRESS_DATA_WS:
		case WALLETS_ADDRESS_ERROR:
		case WALLETS_WITHDRAW_CCY_FETCH:
		case WALLETS_WITHDRAW_CCY_DATA:
		case SET_MOBILE_WALLET_UI:
		case WALLETS_WITHDRAW_CCY_ERROR:
			const walletsListState = { ...state.wallets };
			return {
				...state,
				wallets: walletsListReducer(walletsListState, action),
			};
		case WALLETS_RESET:
			return {
				...state,
				wallets: {
					list: [],
					loading: false,
					withdrawSuccess: false,
					mobileWalletChosen: '',
					selectedWalletCurrency: '',
					selectedWalletAddress: '',
					process: {
						percent: 10,
						showWithdrawProcess: false,
						isFinishWithdraw: false,
					},
				},
			};
		default:
			return state;
	}
};

export const initialChildCurrencies: ChildCurrenciesState = {
	payload: [],
	loading: false,
};

export const childCurrenciesReducer = (state = initialChildCurrencies, action: WalletsAction): ChildCurrenciesState => {
	switch (action.type) {
		case WALLETS_CHILD_CURRENCIES_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case WALLETS_CHILD_CURRENCIES_DATA:
			const { payload } = action.payload;

			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};
		case WALLETS_CHILD_CURRENCIES_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};

export const allChildCurrenciesReducer = (state = initialChildCurrencies, action: WalletsAction): ChildCurrenciesState => {
	switch (action.type) {
		case ALL_CHILD_CURRENCIES_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case ALL_CHILD_CURRENCIES_DATA:
			const { payload } = action.payload;

			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};
		case ALL_CHILD_CURRENCIES_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};

export const initialWalletsWithdrawLimit: WalletsWithdrawLimitState = {
	payload: {
		isLimitWithdraw: false,
	},
	loading: false,
};

export const walletsWithdrawLimitReducer = (
	state = initialWalletsWithdrawLimit,
	action: WalletsAction,
): WalletsWithdrawLimitState => {
	switch (action.type) {
		case WALLETS_WITHDRAW_LIMIT_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case WALLETS_WITHDRAW_LIMIT_DATA:
			const { payload } = action.payload;

			return {
				...state,
				payload: payload,
				loading: false,
				error: undefined,
			};
		case ALL_CHILD_CURRENCIES_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
