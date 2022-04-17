export interface NewCompetition {
	id: number;
	status: 'ended' | 'ongoing' | 'upcoming';
	currency_id: string;
	type: 'trade' | 'stake' | 'deposit';
	currency_image?: string;
	total_prize?: string;
	market_ids: string;
	next_update: string;
	start_date: string;
	end_date: string;
	limit_display?: number;
}
export interface NewCompetitionState {
	payload: NewCompetition;
	loading: boolean;
}
