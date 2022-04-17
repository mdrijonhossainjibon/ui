import { CommonState } from '../../../modules/types';

export enum TypeOfKycDocument {
	Passport = 'passport',
	Driver = 'driver',
	IdentifyCard = 'identify card',
}

export interface VerifyAccount {
	nationality: string;
	fullname: string;
	date_of_birth: string;
	residential_address: string;
	postal_code: string;
	city: string;
	country: string;
	document_number: string;
	document: TypeOfKycDocument;
	photo_document: string;
	user_photo: string;
}

export interface VerifyAccountState extends CommonState {
	payload: VerifyAccount;
	loading: boolean;
	isSubmitted: boolean;
}

// KYC Status
export interface KycStatus {
	status?: 'unsent' | 'verify' | 'process' | 'failed' | 'unavailable' | 'blocked';
	reason?: string;
}

export interface KycStatusState extends CommonState {
	payload: KycStatus;
	loading: boolean;
}
