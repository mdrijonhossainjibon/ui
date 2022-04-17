import { FetchIEOCaution, fetchIEOCautionData, fetchIEOCautionError } from '../actions';
import { put, call } from 'redux-saga/effects';
import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'ieo', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* fetchIEOCautionSaga(action: FetchIEOCaution) {
	try {
		const { ieo_id } = action.payload;
		const response = yield call(API.get(createOptions(getCsrfToken())), `public/ieo/caution/${ieo_id}`);
		yield put(
			fetchIEOCautionData({
				payload: response,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(fetchIEOCautionError(JSON.stringify(error.message)));
	}
}
