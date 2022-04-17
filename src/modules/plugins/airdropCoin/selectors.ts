import { RootState } from '../../index';

export const selectAirdropCoin = (state: RootState) => state.plugins.airdropCoin.list.data;
export const selectAirdropCoinLoading = (state: RootState) => state.plugins.airdropCoin.list.loading;
export const selectAirdropCoinClaims = (state: RootState) => state.plugins.airdropCoin.claims.data;
export const selectAirdropCoinClaimsLoading = (state: RootState) => state.plugins.airdropCoin.claims.loading;
