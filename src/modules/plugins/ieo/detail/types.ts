import { CommonState } from '../../../types';

export interface DetailIEO {
	ieo_id: number | '';
	name: string;
	price: string;
	bonus: string;
	softcap: string;
	usage: string;
	tech: string;
	date: string;
	homepage: string;
	bonus_lockup: string;
	whitepaper: string;
	bottom_banner: string;
	hardcap: string;
	sns: Array<{
		[social:string]: string;
	}>;
}

export interface DetailIEOState extends CommonState {
	loading: boolean;
	payload: DetailIEO;
}
