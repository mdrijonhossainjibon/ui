import { commisionInfoData, CommisionInfoFetch } from './../actions';
import { API, RequestOptions } from 'api';
import { call, put } from 'redux-saga/effects';
import { EstimatedCommisionFetch, estimatedCommisionData } from '../actions';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'referral', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* getCommisionInfoSaga(actions: CommisionInfoFetch) {
	try {
		const { dekstop_image, mobile_image } = yield call(API.get(createOptions()), `/public/referral/commision/info`);
		yield put(
			commisionInfoData({
				payload: {
					dekstop_image: dekstop_image,
					mobile_image: mobile_image,
				},
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			commisionInfoData({
				payload: {
					dekstop_image: '',
					mobile_image: '',
				},
				loading: false,
			}),
		);
	}
}

export function* estimatedCommisionSaga(actions: EstimatedCommisionFetch) {
	try {
		const { total } = yield call(API.get(createOptions()), `/private/referral/estimated/commision`);
		yield put(
			estimatedCommisionData({
				payload: {
					total: total,
				},
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			estimatedCommisionData({
				payload: {
					total: '0.0000 USDT',
				},
				loading: false,
			}),
		);
	}
}
