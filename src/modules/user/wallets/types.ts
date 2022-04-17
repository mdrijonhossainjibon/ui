import { CommonState } from '../../types';

export interface Wallet {
	total?: string;
	balance?: string;
	currency: string;
	name: string;
	type: 'fiat' | 'coin';
	fee: number;
	address?: string;
	locked?: string;
	explorerTransaction: string;
	explorerAddress: string;
	fixed: number;
	iconUrl?: string;
}

export interface WalletAddress {
	address: string;
	currency: string;
}

export interface WalletWithdrawCCY {
	uid: string;
	fee: string;
	amount: string;
	currency: string;
	otp: string;
	beneficiary_id: string;
}

export interface WalletWithdrawFiat {
	amount: string;
	currency: string;
	currency_type: string;
	otp: string;
	beneficiary_id: string;
}

export interface AccountInterface {
	currency: string;
	balance?: string;
	locked?: string;
}

export interface ChildCurrency {
	id: string;
	parent_id: string;
	name: string;
	blockchain_key: string;
	type: string;
	deposit_enabled: boolean;
	withdrawal_enabled: boolean;
}

export interface ChildCurrenciesState extends CommonState {
	payload: ChildCurrency[];
	loading: boolean;
}

export interface WithdrawLimit {
	isLimitWithdraw: boolean;
}

export interface WalletsWithdrawLimitState extends CommonState {
	payload: WithdrawLimit;
	loading: boolean;
}
