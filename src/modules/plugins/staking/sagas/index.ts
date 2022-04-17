import { takeLatest } from 'redux-saga/effects';
import {
	CREATE_STAKE,
	STAKE_HISTORY_FETCH,
	STAKE_WALLET_FETCH,
	STAKING_LIST_FETCH,
	UNSTAKE_HISTORY_FETCH,
	UNSTAKE_POST,
} from '../constants';
import { createStakeSaga } from './createStake';
import { fetchStakeHistory } from './stakeHistory';
import { fetchStakeWallet } from './stakeWallet';
import { fetchStakingListSaga } from './stakingList';
import { unstakeSaga } from './unstake';
import { fetchUnStakeHistory } from './unstakeHistory';
export function* rootStakingSaga() {
	yield takeLatest(STAKING_LIST_FETCH, fetchStakingListSaga);
	yield takeLatest(CREATE_STAKE, createStakeSaga);
	yield takeLatest(STAKE_WALLET_FETCH, fetchStakeWallet);
	yield takeLatest(STAKE_HISTORY_FETCH, fetchStakeHistory);
	yield takeLatest(UNSTAKE_POST, unstakeSaga);
	yield takeLatest(UNSTAKE_HISTORY_FETCH, fetchUnStakeHistory);
}
