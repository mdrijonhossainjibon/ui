import * as Constants from './constants';
import { DetailIEOState } from './types';
export interface FetchIEODetail {
	type: typeof Constants.FETCH_IEO_DETAIL;
	payload: {
		ieo_id: number;
	};
}

export interface FetchIEODetailData {
	type: typeof Constants.IEO_DETAIL;
	payload: DetailIEOState;
}

export interface FetchIEODetailError {
	type: typeof Constants.IEO_DETAIL_ERROR;
	error: string;
}

export type IEODetailActions = FetchIEODetail | FetchIEODetailData | FetchIEODetailError;

export const fetchIEODetail = (payload: FetchIEODetail['payload']): FetchIEODetail => ({
	type: Constants.FETCH_IEO_DETAIL,
	payload,
});

export const fetchIEODetailData = (payload: FetchIEODetailData['payload']): FetchIEODetailData => ({
	type: Constants.IEO_DETAIL,
	payload,
});
export const fetchIEODetailError = (error: FetchIEODetailError['error']): FetchIEODetailError => ({
	type: Constants.IEO_DETAIL_ERROR,
	error,
});
