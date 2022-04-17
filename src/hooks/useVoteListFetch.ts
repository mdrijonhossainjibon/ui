import debounce from 'lodash/debounce';
import identity from 'lodash/identity';
import pickBy from 'lodash/pickBy';
import { selectVoteListLoading, VoteFilter, voteListFetch } from 'modules';
import * as React from 'react';
import isEqual from 'react-fast-compare';
import { useDispatch, useSelector } from 'react-redux';

export const useVoteListFetch = (voteFilter: VoteFilter = {}) => {
	const dispatch = useDispatch();
	const isLoading = useSelector(selectVoteListLoading);
	const filter = React.useRef<VoteFilter | null>(null);

	const fetchVoteList = () => {
		if (!isLoading && !isEqual(filter.current, voteFilter)) {
			dispatch(voteListFetch(pickBy(voteFilter, identity)));
			filter.current = voteFilter;
		}
	};

	const delayedFetch = React.useCallback(debounce(fetchVoteList, 500), [voteFilter]);

	React.useEffect(() => {
		delayedFetch();

		return delayedFetch.cancel;
	}, [dispatch, voteFilter]);
};
