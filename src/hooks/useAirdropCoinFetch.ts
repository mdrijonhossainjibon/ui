import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { airdropCoinFetch, selectAirdropCoin, selectAirdropCoinLoading } from '../modules';

export const useAirdropCoinFetch = () => {
	const airdrops = useSelector(selectAirdropCoin);
	const isLoading = useSelector(selectAirdropCoinLoading);
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (!isLoading) {
			dispatch(airdropCoinFetch());
		}
	}, []);

	return airdrops;
};
