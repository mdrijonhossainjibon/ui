import * as Constants from './constants';
import { IEOCautionState } from './types';
export interface FetchIEOCaution {
	type: typeof Constants.FETCH_IEO_CAUTION;
	payload: {
		ieo_id: number;
	};
}

export interface FetchIEOCautionData {
	type: typeof Constants.IEO_CAUTION_DATA;
	payload: IEOCautionState;
}

export interface FetchIEOCautionError {
	type: typeof Constants.IEO_CAUTION_ERROR;
	error: string;
}

export type IEOCautionActions = FetchIEOCaution | FetchIEOCautionData | FetchIEOCautionError;

export const fetchIEOCaution = (payload: FetchIEOCaution['payload']): FetchIEOCaution => ({
	type: Constants.FETCH_IEO_CAUTION,
	payload,
});

export const fetchIEOCautionData = (payload: FetchIEOCautionData['payload']): FetchIEOCautionData => ({
	type: Constants.IEO_CAUTION_DATA,
	payload,
});
export const fetchIEOCautionError = (error: FetchIEOCautionError['error']): FetchIEOCautionError => ({
	type: Constants.IEO_CAUTION_ERROR,
	error,
});
