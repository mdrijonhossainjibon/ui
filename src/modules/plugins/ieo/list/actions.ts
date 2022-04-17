import { CommonError } from '../../../types';
import { IEO_LIST_DATA, IEO_LIST_ERROR, IEO_LIST_FETCH } from './constants';
import { IEOListState } from './types';

export interface IEOListData {
	type: typeof IEO_LIST_DATA;
	payload: IEOListState;
}
export interface IEOListError {
	type: typeof IEO_LIST_ERROR;
	error: CommonError;
}

export interface IEOListDataFetch {
	type: typeof IEO_LIST_FETCH;
}
export type IEOListActions = IEOListData | IEOListDataFetch | IEOListError;
export const IEOListDataFetch = (): IEOListDataFetch => ({
	type: IEO_LIST_FETCH,
});

export const IEOListData = (payload: IEOListData['payload']): IEOListData => ({
	type: IEO_LIST_DATA,
	payload,
});

export const IEOListError = (error: IEOListError['error']): IEOListError => ({
	type: IEO_LIST_ERROR,
	error,
});
