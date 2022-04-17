import { NewWithdrawLimitCheckingState, NewWithdrawLimitRemainsState, WithdrawLimitCheckingActions } from '.';
import { WithdrawLimitFetchRemainsActions } from './actions';
import {
	WITHDRAW_LIMIT_CHECKING,
	WITHDRAW_LIMIT_CHECKING_RESPONSE,
	WITHDRAW_LIMIT_FETCH_REMAINS,
	WITHDRAW_LIMIT_FETCH_REMAINS_DATA,
} from './constants';

const initStateRemain = {
	payload: {
		remains: 0,
		limit: 0,
	},
	loading: true,
};

const initStateCheckingRemain = {
	payload: {
		isEnough: false,
		message: '',
	},
	loading: true,
};

export const withdrawLimitRemainReducer = (
	state = initStateRemain,
	action: WithdrawLimitFetchRemainsActions,
): NewWithdrawLimitRemainsState => {
	switch (action.type) {
		case WITHDRAW_LIMIT_FETCH_REMAINS:
			return {
				...state,
				loading: true,
			};
		case WITHDRAW_LIMIT_FETCH_REMAINS_DATA:
			return {
				...state,
				payload: action.payload,
				loading: false,
			};
		default:
			return {
				...state,
				loading: false,
			};
	}
};

export const withdrawLimitCheckingReducer = (
	state = initStateCheckingRemain,
	action: WithdrawLimitCheckingActions,
): NewWithdrawLimitCheckingState => {
	switch (action.type) {
		case WITHDRAW_LIMIT_CHECKING: {
			return {
				...initStateCheckingRemain,
				loading: true,
			};
		}
		case WITHDRAW_LIMIT_CHECKING_RESPONSE: {
			return {
				...state,
				payload: action.payload,
				loading: false,
			};
		}
		default:
			return {
				...state,
				loading: false,
			};
	}
};
