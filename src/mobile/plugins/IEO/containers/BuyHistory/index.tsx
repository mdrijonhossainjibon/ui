import format from 'date-fns/format';
import { formatNumber } from 'helpers';
import { toUpper } from 'lodash';
import Empty from 'mobile/assets/icons/empty.svg';
import { LoadingMobile, PaginationMobile } from 'mobile/components';
import { fetchBuyHistory, selectBuyHistoryList } from 'modules';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

interface BuyHistoryProps {
	ieoID: number;
	uid: string;
}

const PAGE_SIZE = 5;

export const BuyHistory: React.FC<BuyHistoryProps> = (props: BuyHistoryProps) => {
	const [numberPage, setNumberPage] = React.useState<number>(1);
	const listHistory = useSelector(selectBuyHistoryList);
	const dispatch = useDispatch();
	const intl = useIntl();

	React.useEffect(() => {
		dispatch(
			fetchBuyHistory({
				ieo_id: props.ieoID,
				page: numberPage - 1,
				pageSize: PAGE_SIZE,
			}),
		);
	}, [numberPage]);
	const EmptyComponent = () => {
		return (
			<div className="col-12">
				<div className="d-flex justify-content-center mb-5 mt-5">
					<img src={Empty} alt="empty" />
				</div>
			</div>
		);
	};
	const loadingHistory = () => {
		return (
			<div className="loading d-flex justify-content-center">
				<LoadingMobile />
			</div>
		);
	};

	const renderHistory = () => {
		if (listHistory.loading && !listHistory.payload.length) {
			return null;
		}
		return listHistory.payload.map((item, index) => {
			return (
				<React.Fragment key={index}>
					<tr className="text-center" style={{ color: '#ffff' }}>
						<td>
							{formatNumber(Number(item.quantity).toString())} <br /> {`(${toUpper(item.base_currency)})`}
						</td>
						<td>
							{Number(item.total)} <br /> {`(${toUpper(item.quote_currency)})`}
						</td>
						<td>
							{format(new Date(item.created_at), 'HH:mm:ss')} <br />{' '}
							{format(new Date(item.created_at), 'dd/MM/yyyy')}
						</td>
					</tr>
				</React.Fragment>
			);
		});
	};

	return (
		<React.Fragment>
			<div id="buy-ieo-mobile-history">
				<h2 className="p-3 text-white buy-ieo-mobile-history__title">
					{intl.formatMessage({ id: 'page.ieo.detail.yourPurchases.title' })}
				</h2>
				<div className="table-responsive-sm table-responsive-md mb-4">
					<table className="table">
						<thead
							style={{
								background: '#0C1A32',
								borderRadius: '3px',
								boxSizing: 'border-box',
								color: '#ffff',
							}}
						>
							<tr className="text-center">
								<th>{intl.formatMessage({ id: 'page.ieo.detail.yourPurchases.quantity' })}</th>
								<th>{intl.formatMessage({ id: 'page.ieo.detail.yourPurchases.totalPurchase' })}</th>
								<th>{intl.formatMessage({ id: 'page.ieo.detail.yourPurchases.buyDate' })}</th>
							</tr>
						</thead>
						<tbody>{listHistory.loading ? <></> : renderHistory()}</tbody>
					</table>
					{listHistory.loading ? loadingHistory() : !listHistory.payload.length ? EmptyComponent() : <></>}
				</div>
				<PaginationMobile
					forcePage={numberPage - 1}
					toPage={(index: number) => {
						setNumberPage(index);
					}}
					pageCount={Math.ceil(listHistory.total / PAGE_SIZE) || 1}
				/>
			</div>
		</React.Fragment>
	);
};
