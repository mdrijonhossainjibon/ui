import { selectUserLoggedIn, selectVoteDonateData, selectVoteDonateFreeData, voteDonateFreeFetch } from 'modules';
import * as React from 'react';
import isEqual from 'react-fast-compare';
import { useDispatch, useSelector } from 'react-redux';

export const useVoteDonateFreeFetch = () => {
	const dispatch = useDispatch();
	const freeVote = useSelector(selectVoteDonateFreeData, isEqual);
	const donateData = useSelector(selectVoteDonateData, isEqual);
	const userLoggedIn = useSelector(selectUserLoggedIn);

	React.useEffect(() => {
		if (userLoggedIn) {
			dispatch(voteDonateFreeFetch());
		}
	}, [dispatch, userLoggedIn]);

	React.useEffect(() => {
		if (donateData) {
			dispatch(voteDonateFreeFetch());
		}
	}, [dispatch, donateData]);

	return freeVote;
};
