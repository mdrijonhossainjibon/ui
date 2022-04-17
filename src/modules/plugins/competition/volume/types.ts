export interface CompetitionVolume {
	volume: number;
	rank: number;
}

export interface CompetitionVolumeState {
	payload: CompetitionVolume;
	loading: boolean;
}
