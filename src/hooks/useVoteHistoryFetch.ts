import identity from 'lodash/identity';
import pickBy from 'lodash/pickBy';
import { selectUserLoggedIn, selectVoteHistoryLoading, VoteFilter, voteHistoryFetch } from 'modules';
import * as React from 'react';
import isEqual from 'react-fast-compare';
import { useDispatch, useSelector } from 'react-redux';

export const useVoteHistoryFetch = (voteFilter: VoteFilter = {}) => {
	const dispatch = useDispatch();
	const isLoading = useSelector(selectVoteHistoryLoading);
	const userLoggedIn = useSelector(selectUserLoggedIn);
	const filter = React.useRef<VoteFilter | null>(null);

	React.useEffect(() => {
		if (userLoggedIn && !isLoading && !isEqual(filter.current, voteFilter)) {
			dispatch(voteHistoryFetch(pickBy(voteFilter, identity)));
			filter.current = voteFilter;
		}
	}, [dispatch, voteFilter, userLoggedIn]);
};
