import { API, RequestOptions } from 'api';
import { put, call } from 'redux-saga/effects';
import { getCsrfToken } from 'helpers';
import { getKycStatus, getKycStatusData, VerifyAccountCreate, verifyAccountSuccess } from '../actions';
const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'newKyc', headers: { 'X-CSRF-Token': csrfToken } };
};
export function* verifyKycSaga(action: VerifyAccountCreate) {
	try {
		const kycData: VerifyAccountCreate['payload'] = { ...action.payload, country: action.payload.nationality };
		yield call(API.patch(createOptions(getCsrfToken())), `/private/newKyc/submit`, kycData);

		yield put(
			verifyAccountSuccess({
				payload: kycData,
				loading: false,
				isSubmitted: true,
			}),
		);
		yield put(getKycStatus());
	} catch (error) {
		yield put(
			verifyAccountSuccess({
				payload: action.payload,
				loading: false,
				isSubmitted: false,
			}),
		);
	}
}

export function* getKycStatusSaga() {
	try {
		const kycStatus = yield call(API.get(createOptions(getCsrfToken())), `/private/newKyc/status`);
		yield put(
			getKycStatusData({
				payload: kycStatus,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			getKycStatusData({
				payload: {},
				loading: false,
			}),
		);
	}
}
