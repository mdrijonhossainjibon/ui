import { takeLatest } from 'redux-saga/effects';
import { VOTE_DONATE_CREATE, VOTE_DONATE_FREE_FETCH, VOTE_HISTORY_FETCH, VOTE_LIST_FETCH } from '../constants';
import { voteDonateCreateSaga, voteDonateFreeFetchSaga, voteHistoryFetchSaga, voteListFetchSaga } from './voteSaga';

export function* rootVoteSaga() {
	yield takeLatest(VOTE_LIST_FETCH, voteListFetchSaga);
	yield takeLatest(VOTE_HISTORY_FETCH, voteHistoryFetchSaga);
	yield takeLatest(VOTE_DONATE_CREATE, voteDonateCreateSaga);
	yield takeLatest(VOTE_DONATE_FREE_FETCH, voteDonateFreeFetchSaga);
}
