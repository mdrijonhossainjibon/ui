import { COMMISION_INFO_FETCH } from './../constants';
import { takeLatest } from 'redux-saga/effects';
import { COMMISION_HISTORY_FETCH, ESTIMATED_COMMISION_FETCH, FRIENDS_LIST_FETCH, REFERRAL_RANKS_FETCH } from '../constants';
import { friendsFetchSaga } from './friends';
import { commisionHistoryFetch } from './history';
import { referralRanksFetch } from './ranks';
import { estimatedCommisionSaga, getCommisionInfoSaga } from './commision';

export function* rootReferralSaga() {
	yield takeLatest(FRIENDS_LIST_FETCH, friendsFetchSaga);
	yield takeLatest(COMMISION_HISTORY_FETCH, commisionHistoryFetch);
	yield takeLatest(REFERRAL_RANKS_FETCH, referralRanksFetch);
	yield takeLatest(ESTIMATED_COMMISION_FETCH, estimatedCommisionSaga);
	yield takeLatest(COMMISION_INFO_FETCH, getCommisionInfoSaga);
}
