import { takeLatest } from 'redux-saga/effects';
import { WITHDRAW_LIMIT_FETCH_REMAINS, WITHDRAW_LIMIT_CHECKING } from '../constants';
import { withdrawLimitCheckingSaga, withdrawLimitRemainsSaga } from './withdrawLimitSaga';

export function* rootNewWithdrawLimitSaga() {
	yield takeLatest(WITHDRAW_LIMIT_CHECKING, withdrawLimitCheckingSaga);
	yield takeLatest(WITHDRAW_LIMIT_FETCH_REMAINS, withdrawLimitRemainsSaga);
}
