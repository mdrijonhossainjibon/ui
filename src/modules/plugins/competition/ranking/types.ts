export interface RankingCompetition {
	id: number;
	competition_id: number;
	uid: string;
	email: string;
	member_id: number;
	rank: number;
	volume?: number;
	award: string;
	total_amount?: number;
	created_at?: Date;
	updated_at?: Date;
}

export interface RankingCompetitionState {
	payload: RankingCompetition[];
	loading: boolean;
}
