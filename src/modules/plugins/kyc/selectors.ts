import { RootState } from '../../index';
export const selectVerifyLoading = (state: RootState) => state.plugins.kyc.verifyAccount.loading;
export const selectVerifySubmitted = (state: RootState) => state.plugins.kyc.verifyAccount.isSubmitted;
export const selectVerifyData = (state: RootState) => state.plugins.kyc.verifyAccount.payload;

export const selectKycStatus = (state: RootState) => state.plugins.kyc.kycStatus.payload;
export const selectKycStatusLoading = (state: RootState) => state.plugins.kyc.kycStatus.loading;
