import { takeLatest } from 'redux-saga/effects';
import { GET_PRICE } from '../constants';
import { getPrice } from './priceSaga';

export function* rootPriceSaga() {
	yield takeLatest(GET_PRICE, getPrice);
}
