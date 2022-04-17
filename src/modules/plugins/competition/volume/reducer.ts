import { CompetitionVolumeState } from '.';
import { CompetitionVolumeActions } from './actions';
import { COMPETITION_VOLUME_DATA, COMPETITION_VOLUME_ERROR, COMPETITION_VOLUME_FETCH } from './constants';
import { CompetitionVolume } from './types';

const initialCompetitionVolumeState: CompetitionVolumeState = {
	payload: {
		volume: 0,
		rank: -1,
	},
	loading: true,
};

export const CompetitionVolumeReducer = (state = initialCompetitionVolumeState, action: CompetitionVolumeActions) => {
	switch (action.type) {
		case COMPETITION_VOLUME_FETCH:
			return {
				...state,
				loading: true,
				error: undefined,
			};
		case COMPETITION_VOLUME_DATA:
			const data = action.payload as CompetitionVolume;

			return {
				...state,
				payload: data,
				loading: false,
				error: undefined,
			};
		case COMPETITION_VOLUME_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};
		default:
			return state;
	}
};
