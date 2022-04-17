import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
import { alertPush } from 'modules';
import { call, put } from 'redux-saga/effects';
import {
	airdropCoinClaimData,
	AirdropCoinClaimItemActive,
	airdropCoinClaimItemData,
	airdropCoinData,
	airdropCoinError,
} from '../actions';
import { AirdropCoin, AirdropCoinClaim } from '../types';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'airdrop', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* airdropCoinFetchSaga() {
	try {
		const list = yield call(API.get(createOptions()), '/public/list');
		yield put(airdropCoinData(list as AirdropCoin[]));
	} catch (error) {
		yield put(airdropCoinError(error));
	}
}

export function* airdropCoinClaimFetchSaga() {
	try {
		const list = yield call(API.get(createOptions(getCsrfToken())), '/private/claims');
		yield put(airdropCoinClaimData(list as AirdropCoinClaim[]));
	} catch (error) {
		yield put(airdropCoinError(error));
	}
}

export function* airdropCoinClaimItemActiveSaga(action: AirdropCoinClaimItemActive) {
	const {
		payload: { airdropId },
		cb,
	} = action;
	try {
		const item = yield call(API.get(createOptions(getCsrfToken())), `/private/claim/${airdropId}/active`);
		yield put(airdropCoinClaimItemData(item as AirdropCoinClaim));
		yield put(alertPush({ message: ['page.body.airdropCoin.claim.msg.success'], type: 'success' }));
	} catch (error) {
		yield put(airdropCoinError(error));
		yield put(alertPush({ message: ['page.body.airdropCoin.claim.msg.fail'], code: error.code, type: 'error' }));
	}
	cb();
}
