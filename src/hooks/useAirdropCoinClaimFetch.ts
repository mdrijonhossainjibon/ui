import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { airdropCoinClaimFetch, selectAirdropCoinClaims, selectAirdropCoinClaimsLoading, selectUserLoggedIn } from '../modules';

export const useAirdropCoinClaimFetch = () => {
	const claims = useSelector(selectAirdropCoinClaims);
	const isLoading = useSelector(selectAirdropCoinClaimsLoading);
	const userLoggedIn = useSelector(selectUserLoggedIn);
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (!isLoading && userLoggedIn) {
			dispatch(airdropCoinClaimFetch());
		}
	}, [userLoggedIn]);

	return claims;
};
