import { takeLatest } from 'redux-saga/effects';
import { KYC_STATUS_GET, VERIFY_ACCOUNT_CREATE as VERIFY_KYC_CREATE } from '../constants';

import { verifyKycSaga, getKycStatusSaga } from './verifyAccountSaga';

export function* rootKycSaga() {
	yield takeLatest(KYC_STATUS_GET, getKycStatusSaga);
	yield takeLatest(VERIFY_KYC_CREATE, verifyKycSaga);
}
