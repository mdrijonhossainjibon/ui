import { allChildCurrenciesFetch } from 'modules';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useAllChildCurrenciesFetch = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(allChildCurrenciesFetch());
	}, [dispatch]);
};
