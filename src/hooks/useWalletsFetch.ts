import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectShouldFetchWallets, selectUserLoggedIn, walletsFetch } from '../modules';

export const useWalletsFetch = () => {
	const shouldDispatch = useSelector(selectShouldFetchWallets);
	const userLoggedIn = useSelector(selectUserLoggedIn);
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (shouldDispatch && userLoggedIn) {
			dispatch(walletsFetch());
		}
	}, [dispatch, shouldDispatch, userLoggedIn]);
};
