import { CommonError } from '../../../types';
import { EVENT_DATA, EVENT_ERROR, EVENT_FETCH } from './constants';
import { EventsState } from './types';

export interface EventFetch {
	type: typeof EVENT_FETCH;
}

export interface EventData {
	type: typeof EVENT_DATA;
	payload: EventsState;
}

export interface EventError {
	type: typeof EVENT_ERROR;
	error: CommonError;
}

export type EventActions = EventFetch | EventData | EventError;

export const eventFetch = (): EventFetch => ({
	type: EVENT_FETCH,
});

export const eventData = (payload: EventData['payload']): EventData => ({
	type: EVENT_DATA,
	payload,
});

export const eventError = (error: EventError['error']): EventError => ({
	type: EVENT_ERROR,
	error,
});
