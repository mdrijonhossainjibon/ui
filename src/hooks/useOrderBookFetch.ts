import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { orderBookFetch, selectCurrentMarket } from '../modules';

export const useOrderBookFetch = () => {
	const dispatch = useDispatch();
	const currentMarket = useSelector(selectCurrentMarket);

	React.useEffect(() => {
		if (currentMarket) {
			dispatch(orderBookFetch(currentMarket));
		}
	}, [currentMarket, dispatch]);
};
