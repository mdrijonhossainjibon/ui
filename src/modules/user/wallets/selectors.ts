import { RootState } from '../../';
import { CommonError } from '../../types';
import { ChildCurrenciesState, Wallet } from './types';

export const selectWallets = (state: RootState): Wallet[] => state.user.wallets.wallets.list;

export const selectWalletsLoading = (state: RootState): boolean => state.user.wallets.wallets.loading;

export const selectWithdrawSuccess = (state: RootState): boolean => state.user.wallets.wallets.withdrawSuccess;
export const selectWithdrawProcess = (state: RootState) => state.user.wallets.wallets.process;

export const selectWalletsTimestamp = (state: RootState): number | undefined => state.user.wallets.wallets.timestamp;

export const selectWalletsAddressError = (state: RootState): CommonError | undefined => state.user.wallets.wallets.error;

export const selectMobileWalletUi = (state: RootState): string => state.user.wallets.wallets.mobileWalletChosen;

export const selectWalletCurrency = (state: RootState): string => state.user.wallets.wallets.selectedWalletCurrency;

export const selectWalletAddress = (state: RootState): string => state.user.wallets.wallets.selectedWalletAddress;

export const selectShouldFetchWallets = (state: RootState): boolean =>
	!selectWalletsTimestamp(state) && !selectWalletsLoading(state);

export const selectChildCurrencies = (state: RootState): ChildCurrenciesState['payload'] => state.user.childCurrencies.payload;
export const selectChildCurrenciesLoading = (state: RootState): boolean => state.user.childCurrencies.loading;

export const selectAllChildCurrencies = (state: RootState): ChildCurrenciesState['payload'] =>
	state.user.allChildCurrencies.payload;
export const selectWalletsWithdrawLimit = (state: RootState): boolean => state.user.walletsWithdrawLimit.payload.isLimitWithdraw;
