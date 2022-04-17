import { CommonError } from '../../../types';
import { IEO_FIND_BY_ID, IEO_ITEM_DATA, IEO_ITEM_ERROR } from './constants';
import { IEOItem } from './types';

export interface findIEOById {
	type: typeof IEO_FIND_BY_ID;
	payload: {
		id: number | string;
	};
}

export interface IEOItemData {
	type: typeof IEO_ITEM_DATA;
	payload: IEOItem;
}

export interface IEOItemError {
	type: typeof IEO_ITEM_ERROR;
	error: CommonError;
}

export type IEOItemActions = findIEOById | IEOItemData | IEOItemError;

export const findIEOById = (payload: findIEOById['payload']): findIEOById => ({
	type: IEO_FIND_BY_ID,
	payload,
});

export const IEOItemData = (payload: IEOItemData['payload']): IEOItemData => ({
	type: IEO_ITEM_DATA,
	payload,
});

export const IEOItemError = (error: IEOItemError['error']): IEOItemError => ({
	type: IEO_ITEM_ERROR,
	error,
});
