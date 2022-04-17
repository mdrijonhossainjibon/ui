import { takeLatest } from 'redux-saga/effects';
import { ETH_FEE_FETCH } from '../constants';
import { ethFeeSaga } from './ethFeeSaga';

export function* rootETHFeeSaga() {
	yield takeLatest(ETH_FEE_FETCH, ethFeeSaga);
}
