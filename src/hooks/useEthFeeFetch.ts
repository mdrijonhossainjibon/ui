import * as React from 'react';
import { useDispatch } from 'react-redux';
import { ethFeeFetch } from '../modules';

export const useEthFeeFetch = () => {
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(ethFeeFetch());
	}, [dispatch]);
};
