export interface CompetitionAward {
	competition_id: number;
	rank: number;
	prize: string;
}

export interface CompetitionAwardState {
	payload: CompetitionAward[];
	loading: boolean;
}
