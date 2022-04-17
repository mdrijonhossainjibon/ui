import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
import { alertPush } from 'modules/public/alert';
import { stringify } from 'querystring';
import { call, put } from 'redux-saga/effects';
import {
	VoteDonateCreate,
	VoteDonateData,
	voteDonateData,
	voteDonateError,
	VoteDonateFreeData,
	voteDonateFreeData,
	voteHistoryData,
	VoteHistoryData,
	voteHistoryError,
	VoteListData,
	voteListData,
	voteListError,
	VoteListFetch,
} from '../actions';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'sunshine', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* voteListFetchSaga(actions: VoteListFetch) {
	try {
		const voteList = yield call(API.get(createOptions()), `/public/vote/list?${stringify(actions.payload)}`);
		yield put(voteListData(voteList as VoteListData['payload']));
	} catch (error) {
		yield put(voteListError(error));
		yield put(alertPush({ message: [], code: error.code, type: 'error' }));
	}
}

export function* voteHistoryFetchSaga(actions: VoteListFetch) {
	try {
		const voteHistory = yield call(
			API.get(createOptions(getCsrfToken())),
			`/private/vote/history?${stringify(actions.payload)}`,
		);
		yield put(voteHistoryData(voteHistory as VoteHistoryData['payload']));
	} catch (error) {
		yield put(voteHistoryError(error));
		yield put(alertPush({ message: [], code: error.code, type: 'error' }));
	}
}

export function* voteDonateCreateSaga(actions: VoteDonateCreate) {
	try {
		const data = yield call(API.post(createOptions(getCsrfToken())), `private/vote/donate`, actions.payload);
		yield put(voteDonateData(data as VoteDonateData['payload']));
		yield put(alertPush({ message: ['page.body.vote.msg.success'], type: 'success' }));
	} catch (error) {
		yield put(voteDonateError(error));
		yield put(alertPush({ message: ['page.body.vote.msg.fail'], code: error.code, type: 'error' }));
	}
}

export function* voteDonateFreeFetchSaga() {
	try {
		const data = yield call(API.get(createOptions(getCsrfToken())), `private/vote/get-free-vote`);
		yield put(voteDonateFreeData(data as VoteDonateFreeData['payload']));
	} catch (error) {
		yield put(voteDonateError(error));
	}
}
