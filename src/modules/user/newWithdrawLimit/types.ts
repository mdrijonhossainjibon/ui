export interface NewWithdrawLimitRemainsState {
	payload: {
		remains: number;
		limit: number;
	};
	loading: boolean;
}

export interface NewWithdrawLimitCheckingState {
	payload: {
		isEnough: boolean;
		message: string;
	};
	loading: boolean;
}
