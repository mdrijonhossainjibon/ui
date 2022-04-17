import { RootState } from '../../../index';
import { EventsState } from './types';

export const selectEvents = (state: RootState): EventsState => state.plugins.info.events;
