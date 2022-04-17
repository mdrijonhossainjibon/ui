import * as React from 'react';
import { IEODetail, BuyIEOComponent, CautionsDetail, InformationIEO, BuyersHistory, BuyHistory } from './../../containers';
import { useHistory } from 'react-router';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectIEOItem, selectUserInfo, findIEOById } from '../../../../modules';
import Countdown from 'react-countdown';
import { setDocumentTitle } from 'helpers';
// import { isNumber } from 'lodash';
import { useIntl } from 'react-intl';

export const IEODetailScreen = () => {
	const intl = useIntl();

	setDocumentTitle(intl.formatMessage({ id: 'page.ieo.detail.setDocument' }));

	const history = useHistory();
	const { ieoID } = useParams<{ ieoID: string }>();
	const { loading, payload: IEOItem } = useSelector(selectIEOItem);
	const user = useSelector(selectUserInfo);
	const dispatch = useDispatch();

	const convertTimeStandard = (time: string) => {
		const arr = time.split('');
		if (arr.length === 1) {
			arr.unshift('0');
		}
		return arr.map((item, index) => (
			<div key={index} className="time d-flex justify-content-center align-items-center">
				<span>{item}</span>
			</div>
		));
	};

	const renderTime = (numberOfTime: string, type: string) => {
		return (
			<div className="p-1">
				<div className="w-100 d-flex">{convertTimeStandard(String(numberOfTime))}</div>
				<div className="text-center text-white"> {type.toUpperCase()}</div>
			</div>
		);
	};

	const renderer = ({ days, hours, minutes, seconds, completed }) => {
		if (completed || isNaN(seconds)) {
			return (
				<div className="d-flex justify-content-center" id="countdown-renderer">
					{renderTime(String(0), intl.formatMessage({ id: 'page.ieo.detail.countdown.days' }))}
					{renderTime(String(0), intl.formatMessage({ id: 'page.ieo.detail.countdown.hours' }))}
					{renderTime(String(0), intl.formatMessage({ id: 'page.ieo.detail.countdown.minutes' }))}
					{renderTime(String(0), intl.formatMessage({ id: 'page.ieo.detail.countdown.seconds' }))}
				</div>
			);
		}
		return (
			<div className="d-flex justify-content-center" id="countdown-renderer">
				{renderTime(String(days), intl.formatMessage({ id: 'page.ieo.detail.countdown.days' }))}
				{renderTime(String(hours), intl.formatMessage({ id: 'page.ieo.detail.countdown.hours' }))}
				{renderTime(String(minutes), intl.formatMessage({ id: 'page.ieo.detail.countdown.minutes' }))}
				{renderTime(String(seconds), intl.formatMessage({ id: 'page.ieo.detail.countdown.seconds' }))}
			</div>
		);
	};
	const dispatchFetchIEOItemByID = (ieoIdParam: string) =>
		dispatch(
			findIEOById({
				id: ieoIdParam,
			}),
		);

	React.useEffect(() => {
		dispatchFetchIEOItemByID(ieoID);
	}, []);

	const LoadingSpinner = () => {
		return (
			<div className="loading-detail-ieo w-100 d-flex justify-content-center">
				<div className="spinner-border text-primary" role="status">
					<span className="sr-only">{intl.formatMessage({ id: 'page.ieo.body.loading' })}</span>
				</div>
			</div>
		);
	};
	const renderBuyHistoryView = () => {
		if (user.uid) {
			return (
				<div className="ieo-detail-screen__buy-history">
					<div className="buy-history-title w-100 text-center">
						<h3>{intl.formatMessage({ id: 'page.ieo.detail.btn.buyHistory' })}</h3>
					</div>
					<div className="col-12 d-flex flex-wrap justify-content-center">
						<div className="col-md-12 col-xl-6 mt-3">
							<BuyHistory ieoID={Number(ieoID)} uid={user.uid} />
						</div>
						<div className="col-md-12 col-xl-6 mt-3">
							<BuyersHistory ieoID={Number(ieoID)} />
						</div>
					</div>
				</div>
			);
		}
		return (
			<div className="ieo-detail-screen__buy-history col-12 d-flex flex-wrap justify-content-center">
				<div className="buy-history-title col-12 text-center">
					<h3>{intl.formatMessage({ id: 'page.ieo.detail.btn.buyHistory' })}</h3>
				</div>
				<div className="col-md-10 mt-3">
					<BuyersHistory ieoID={Number(ieoID)} />
				</div>
			</div>
		);
	};
	return (
		<div className="ieo-detail-screen">
			<div className="container-fluid ieo-detail-screen__header">
				<div className="row">
					<div className="col-6">
						<h3 className="ieo-detail-screen__header__title">
							{intl.formatMessage({ id: 'page.ieo.detail.btn.ieo' })}
						</h3>
						<button
							className="ieo-detail-screen__header__return-btn"
							onClick={() => {
								history.goBack();
							}}
						>
							{intl.formatMessage({ id: 'page.ieo.detail.btn.backToList' })}
						</button>
					</div>
					<div className="col-lg-6 col-md-12 d-flex flex-wrap justify-content-center align-items-center">
						<Countdown
							date={IEOItem.type === 'upcoming' ? new Date(IEOItem.start_date) : new Date(IEOItem.end_date)}
							renderer={renderer}
						/>
					</div>
				</div>
			</div>

			<div className="container-fluid ieo-detail-screen__body">
				<div className="row">
					{loading ? (
						<LoadingSpinner />
					) : (
						<div className="d-flex flex-wrap justify-content-center w-100">
							<div className="col-sm-12 col-md-6 p-0" style={{ padding: '0 0.5rem 0 0' }}>
								<IEODetail
									endDate={IEOItem.end_date}
									startDate={IEOItem.start_date}
									bonus={IEOItem.bonus}
									currencyID={IEOItem.currency_id}
									remains={Number(IEOItem.remains)}
									total={Number(IEOItem.total_ieo)}
									progress={IEOItem.progress}
									min_buy={IEOItem.min_buy}
									start_price={IEOItem.price}
								/>
							</div>

							<div
								className="col-sm-12 col-md-6 ieo-detail-screen__body__buy p-0"
								style={{ backgroundColor: '#c', padding: '0 0.5rem 0 0' }}
							>
								<BuyIEOComponent
									currencies={IEOItem.currency_available.length ? IEOItem.currency_available : ['']}
									currencyID={IEOItem.currency_id}
									priceIEO={Number(IEOItem.price)}
									type={IEOItem.type}
									minBuy={IEOItem.min_buy}
									uid={user.uid}
									id={ieoID}
									allBonus={IEOItem.allBonus}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="container-fluid">
				<div className="row">
					<div className="col-12 p-0">
						{renderBuyHistoryView()}
						<CautionsDetail ieoID={Number(ieoID)} />
						<InformationIEO />
					</div>
				</div>
			</div>
		</div>
	);
};
