import { CommonState } from '../../../types';

export interface IEOItem {
	id: string;
	host_uid?: string;
	currency_id: string;
	description?: string;
	image_link: string;
	currency_available: string[];
	total_ieo: number;
	remains: number;
	price: number;
	min_buy: number;
	start_date: string;
	end_date: string;
	bonus: any;
	progress: number;
	allBonus: Array<any>;
	social: {
		website?: string;
		whitepaper?: string;
		ico?: string;
		facebook?: string;
		twitter?: string;
		telegram?: string;
		instagram?: string;
		linkedin?: string;
	} | null;
	type: 'ongoing' | 'upcoming' | 'ended';
}

export interface IEOItemState extends CommonState {
	payload: IEOItem;
	loading: boolean;
}
