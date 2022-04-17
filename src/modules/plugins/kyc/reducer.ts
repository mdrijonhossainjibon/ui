import { KycStatusAction, VerifyAccountAction } from './actions';

import { VERIFY_ACCOUNT_CREATE, KYC_STATUS_DATA, KYC_STATUS_GET, VERIFY_ACCOUNT_DATA } from './constants';
import { KycStatusState, TypeOfKycDocument, VerifyAccountState } from './types';

export const initialVerifyAaccount: VerifyAccountState = {
	payload: {
		nationality: '',
		fullname: '',
		date_of_birth: '',
		residential_address: '',
		postal_code: '',
		city: '',
		country: '',
		document: TypeOfKycDocument.Passport,
		document_number: '',
		photo_document: '',
		user_photo: '',
	},
	loading: false,
	isSubmitted: false,
};

export const verifyAccountReducer = (state = initialVerifyAaccount, action: VerifyAccountAction): VerifyAccountState => {
	switch (action.type) {
		case VERIFY_ACCOUNT_CREATE:
			return {
				...state,
				loading: true,
			};
		case VERIFY_ACCOUNT_DATA:
			const { payload, loading, isSubmitted } = action.payload;

			return {
				...state,
				payload: payload,
				loading: loading,
				isSubmitted: isSubmitted,
			};

		default:
			return state;
	}
};

// Kyc Status
export const initialUserAaccountStatus: KycStatusState = {
	payload: { status: 'unavailable' },
	loading: false,
};

export const kycStatusReducer = (state = initialUserAaccountStatus, action: KycStatusAction): KycStatusState => {
	switch (action.type) {
		case KYC_STATUS_GET:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case KYC_STATUS_DATA:
			const { payload, loading } = action.payload;

			return {
				...state,
				payload: payload,
				loading: loading,
			};

		default:
			return state;
	}
};
