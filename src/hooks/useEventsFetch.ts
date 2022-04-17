import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { eventFetch, selectEvents } from '../modules';

export const useEventsFetch = () => {
	const dispatch = useDispatch();
	const events = useSelector(selectEvents);

	React.useEffect(() => {
		if (!events.payload.length) {
			dispatch(eventFetch());
		}
	}, [dispatch]);
};
