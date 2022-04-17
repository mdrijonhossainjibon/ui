import produce from 'immer';
import { AirdropCoinActions, AirdropCoinClaimActions } from './actions';
import {
	AIRDROP_COIN_CLAIM_DATA,
	AIRDROP_COIN_CLAIM_FETCH,
	AIRDROP_COIN_CLAIM_ITEM_DATA,
	AIRDROP_COIN_DATA,
	AIRDROP_COIN_ERROR,
	AIRDROP_COIN_FETCH,
} from './constants';
import { AirdropCoinClaimState, AirdropCoinState } from './types';

export const initialAirdropCoin: AirdropCoinState = {
	data: [],
	loading: false,
};

export const airdropCoinListReducer = (state = initialAirdropCoin, action: AirdropCoinActions): AirdropCoinState =>
	produce(state, draft => {
		switch (action.type) {
			case AIRDROP_COIN_FETCH:
				draft.loading = true;
				break;
			case AIRDROP_COIN_DATA:
				draft.loading = false;
				draft.data = action.payload;
				break;
			case AIRDROP_COIN_ERROR:
				draft.loading = false;
				draft.error = action.error;
				break;
			default:
				break;
		}
	});

export const initialAirdropCoinClaim: AirdropCoinClaimState = {
	data: [],
	loading: false,
};

export const airdropCoinClaimReducer = (
	state = initialAirdropCoinClaim,
	action: AirdropCoinClaimActions,
): AirdropCoinClaimState =>
	produce(state, draft => {
		let index: number;
		switch (action.type) {
			case AIRDROP_COIN_CLAIM_FETCH:
				draft.loading = true;
				break;
			case AIRDROP_COIN_CLAIM_DATA:
				draft.loading = false;
				draft.data = action.payload;
				break;
			case AIRDROP_COIN_CLAIM_ITEM_DATA:
				index = draft.data.findIndex(item => item.airdrop_id === action.payload.airdrop_id);
				draft.data[index] = action.payload;
				break;
			case AIRDROP_COIN_ERROR:
				draft.loading = false;
				draft.error = action.error;
				break;
			default:
				break;
		}
	});
