import { CommonError } from '../../../modules/types';
import {
	AIRDROP_COIN_CLAIM_DATA,
	AIRDROP_COIN_CLAIM_ERROR,
	AIRDROP_COIN_CLAIM_FETCH,
	AIRDROP_COIN_CLAIM_ITEM_ACTIVE,
	AIRDROP_COIN_CLAIM_ITEM_DATA,
	AIRDROP_COIN_DATA,
	AIRDROP_COIN_ERROR,
	AIRDROP_COIN_FETCH,
} from './constants';
import { AirdropCoin, AirdropCoinClaim } from './types';

export interface AirdropCoinData {
	type: typeof AIRDROP_COIN_DATA;
	payload: AirdropCoin[];
}

export interface AirdropCoinFetch {
	type: typeof AIRDROP_COIN_FETCH;
}

export interface AirdropCoinError {
	type: typeof AIRDROP_COIN_ERROR;
	error: CommonError;
}

export type AirdropCoinActions = AirdropCoinData | AirdropCoinFetch | AirdropCoinError;

export const airdropCoinFetch = (): AirdropCoinFetch => ({
	type: AIRDROP_COIN_FETCH,
});

export const airdropCoinData = (payload: AirdropCoin[]): AirdropCoinData => ({
	type: AIRDROP_COIN_DATA,
	payload,
});

export const airdropCoinError = (error: AirdropCoinError['error']): AirdropCoinError => ({
	type: AIRDROP_COIN_ERROR,
	error,
});

export interface AirdropCoinClaimData {
	type: typeof AIRDROP_COIN_CLAIM_DATA;
	payload: AirdropCoinClaim[];
}

export interface AirdropCoinClaimFetch {
	type: typeof AIRDROP_COIN_CLAIM_FETCH;
}

export interface AirdropCoinClaimItemData {
	type: typeof AIRDROP_COIN_CLAIM_ITEM_DATA;
	payload: AirdropCoinClaim;
}

export interface AirdropCoinClaimItemActive {
	type: typeof AIRDROP_COIN_CLAIM_ITEM_ACTIVE;
	payload: {
		airdropId: string;
	};
	cb: () => void;
}

export interface AirdropCoinClaimError {
	type: typeof AIRDROP_COIN_CLAIM_ERROR;
	error: CommonError;
}

export type AirdropCoinClaimActions =
	| AirdropCoinClaimItemActive
	| AirdropCoinClaimItemData
	| AirdropCoinClaimData
	| AirdropCoinClaimFetch
	| AirdropCoinError;

export const airdropCoinClaimFetch = (): AirdropCoinClaimFetch => ({
	type: AIRDROP_COIN_CLAIM_FETCH,
});

export const airdropCoinClaimData = (payload: AirdropCoinClaimData['payload']): AirdropCoinClaimData => ({
	type: AIRDROP_COIN_CLAIM_DATA,
	payload,
});

export const airdropCoinClaimItemActive = (
	payload: AirdropCoinClaimItemActive['payload'],
	cb: AirdropCoinClaimItemActive['cb'],
): AirdropCoinClaimItemActive => ({
	type: AIRDROP_COIN_CLAIM_ITEM_ACTIVE,
	payload,
	cb,
});

export const airdropCoinClaimItemData = (payload: AirdropCoinClaim): AirdropCoinClaimItemData => ({
	type: AIRDROP_COIN_CLAIM_ITEM_DATA,
	payload,
});

export const airdropCoinClaimError = (error: AirdropCoinClaimError['error']): AirdropCoinClaimError => ({
	type: AIRDROP_COIN_CLAIM_ERROR,
	error,
});
