import { takeLatest } from 'redux-saga/effects';
import { AIRDROP_COIN_CLAIM_FETCH, AIRDROP_COIN_CLAIM_ITEM_ACTIVE, AIRDROP_COIN_FETCH } from '../constants';
import { airdropCoinClaimFetchSaga, airdropCoinClaimItemActiveSaga, airdropCoinFetchSaga } from './airdropCoinSaga';

export function* rootAirdropCoinSaga() {
	yield takeLatest(AIRDROP_COIN_FETCH, airdropCoinFetchSaga);
	yield takeLatest(AIRDROP_COIN_CLAIM_FETCH, airdropCoinClaimFetchSaga);
	yield takeLatest(AIRDROP_COIN_CLAIM_ITEM_ACTIVE, airdropCoinClaimItemActiveSaga);
}
