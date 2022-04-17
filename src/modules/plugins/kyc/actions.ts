import { VERIFY_ACCOUNT_CREATE, VERIFY_ACCOUNT_DATA, KYC_STATUS_DATA, KYC_STATUS_GET } from './constants';
import { KycStatusState, VerifyAccount, VerifyAccountState } from './types';

export interface VerifyAccountCreate {
	type: typeof VERIFY_ACCOUNT_CREATE;
	payload: VerifyAccount;
}

export interface VerifyAccountData {
	type: typeof VERIFY_ACCOUNT_DATA;
	payload: VerifyAccountState;
}

export type VerifyAccountAction = VerifyAccountCreate | VerifyAccountData;

export const verifyAccountUser = (payload: VerifyAccountCreate['payload']): VerifyAccountCreate => ({
	type: VERIFY_ACCOUNT_CREATE,
	payload,
});

export const verifyAccountSuccess = (payload: VerifyAccountData['payload']): VerifyAccountData => ({
	type: VERIFY_ACCOUNT_DATA,
	payload,
});

// KYC Status
export interface KYCStatus {
	type: typeof KYC_STATUS_GET;
}

export interface KYCStatusData {
	type: typeof KYC_STATUS_DATA;
	payload: KycStatusState;
}

export type KycStatusAction = KYCStatus | KYCStatusData;

export const getKycStatus = (): KYCStatus => ({
	type: KYC_STATUS_GET,
});

export const getKycStatusData = (payload: KYCStatusData['payload']): KYCStatusData => ({
	type: KYC_STATUS_DATA,
	payload,
});
