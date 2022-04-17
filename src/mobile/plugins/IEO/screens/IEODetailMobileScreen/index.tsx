import { findIEOById, getIEOTotalBuyers, selectIEOItem, selectTotalIEOBuyers, selectUserInfo } from 'modules';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { BuyersHistory, BuyHistory, BuyIEOComponent, CautionsDetail, IEOInfo, InformationIEO } from './../../containers';
import MaskGroup from './assets/MaskGroup.png';

export const IEODetailMobileScreen = () => {
	const { ieo_id } = useParams<{ ieo_id: string }>();
	const { loading: loadingItem, payload: IEOItem } = useSelector(selectIEOItem);
	const { loading: loadingTotalBuyer, payload: payloadTotalBuyer } = useSelector(selectTotalIEOBuyers);
	const user = useSelector(selectUserInfo);
	const dispatch = useDispatch();
	const intl = useIntl();

	// Fetch detail ieo buy currency
	const dispatchFetchIEOItemByID = (ieoIdParam: string) =>
		dispatch(
			findIEOById({
				id: ieoIdParam,
			}),
		);

	React.useEffect(() => {
		dispatchFetchIEOItemByID(ieo_id);
	}, []);
	React.useEffect(() => {
		dispatch(
			getIEOTotalBuyers({
				ieo_id: ieo_id,
			}),
		);
	}, [IEOItem.remains, IEOItem.total_ieo]);
	const renderBuyHistoryView = () => {
		if (user.uid) {
			return (
				<div className="ieo-detail-mobile-screen__buy-history d-flex flex-wrap justify-content-center">
					<div className="w-100">
						<BuyHistory ieoID={Number(ieo_id)} uid={user.uid} />
					</div>
					<div className="w-100 mt-5">
						<BuyersHistory ieoID={Number(ieo_id)} />
					</div>
				</div>
			);
		}
		return (
			<div className="ieo-detail-mobile-screen__buy-history d-flex flex-wrap justify-content-center">
				<div className="buy-history-title col-12 text-center">
					<h3>{intl.formatMessage({ id: 'page.ieo.detail.btn.buyHistory' })}</h3>
				</div>
				<div className="w-100 mt-3">
					<BuyersHistory ieoID={Number(ieo_id)} />
				</div>
			</div>
		);
	};
	return (
		<div className="ieo-detail-mobile-screen">
			<div
				className="d-flex justify-content-center"
				style={{
					backgroundImage: `url(${MaskGroup})`,
					backgroundSize: 'cover',
					backgroundRepeat: 'no-repeat',
					objectFit: 'cover',
				}}
			>
				<IEOInfo
					loading={loadingItem || loadingTotalBuyer}
					endDate={IEOItem.end_date}
					startDate={IEOItem.start_date}
					bonus={IEOItem.bonus}
					currencyID={IEOItem.currency_id}
					remains={Number(IEOItem.remains)}
					total={Number(IEOItem.total_ieo)}
					progress={IEOItem.progress}
					totalBuyer={payloadTotalBuyer.totalBuyers}
					type={IEOItem.type}
					price={Number(IEOItem.price)}
					min_buy={Number(IEOItem.min_buy)}
					currencyAvailable={IEOItem.currency_available}
				/>
			</div>
			<div className="d-flex justify-content-center container mt-3">
				<BuyIEOComponent
					currencies={IEOItem.currency_available.length ? IEOItem.currency_available : ['']}
					currencyID={IEOItem.currency_id}
					priceIEO={Number(IEOItem.price)}
					type={IEOItem.type}
					minBuy={IEOItem.min_buy}
					uid={user.uid}
					id={ieo_id}
					allBonus={IEOItem.allBonus}
				/>
			</div>
			<div className="container">
				<div className="w-100 mt-3">
					{renderBuyHistoryView()}
					<CautionsDetail ieoID={Number(ieo_id)} />
					<InformationIEO />
				</div>
			</div>
		</div>
	);
};
