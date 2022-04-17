import format from 'date-fns/format';
import { formatNumber } from 'helpers';
import { toUpper } from 'lodash';
import Empty from 'mobile/assets/icons/empty.svg';
import { LoadingMobile, PaginationMobile } from 'mobile/components';
import { fetchBuyersHistory, selectBuyersHistory } from 'modules';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
interface BuyersHistoryProps {
	ieoID: number;
}

const PAGE_SIZE = 5;

export const BuyersHistory: React.FC<BuyersHistoryProps> = (props: BuyersHistoryProps) => {
	const intl = useIntl();
	const [numberPage, setNumberPage] = React.useState<number>(1);
	const listHistory = useSelector(selectBuyersHistory);

	const dispatch = useDispatch();
	React.useEffect(() => {
		dispatch(
			fetchBuyersHistory({
				ieo_id: Number(props.ieoID),
				page: numberPage - 1,
				pageSize: PAGE_SIZE,
			}),
		);
	}, [numberPage]);

	const loadingHistory = () => {
		return (
			<div className="loading d-flex justify-content-center">
				<LoadingMobile />
			</div>
		);
	};

	const EmptyComponent = () => {
		return (
			<div className="col-12">
				<div className="d-flex justify-content-center mb-5 mt-5">
					<img src={Empty} alt="empty" />
				</div>
			</div>
		);
	};
	const renderBuyersHistory = () => {
		return listHistory.payload.map((item, index) => {
			return (
				<React.Fragment key={index}>
					<tr className="text-center" style={{ color: '#ffff', border: '1px solid #848e9' }}>
						<td>{item.uid}</td>
						<td>
							{`${formatNumber(Number(item.quantity).toString())}`} <br /> {`(${toUpper(item.base_currency)})	`}
						</td>
						<td>
							{`${Number(item.total)}`} <br /> {`(${toUpper(item.quote_currency)})`}
						</td>
						<td>
							{format(new Date(item.created_at), 'HH:mm:ss')} <br />
							{format(new Date(item.created_at), 'dd/MM/yyyy')}
						</td>
					</tr>
				</React.Fragment>
			);
		});
	};
	return (
		<>
			<div id="buyers-ieo-desktop-history">
				<h2 className="p-3 text-white">
					{intl.formatMessage({ id: 'page.ieo.detail.buyerHistory.allPurchases.title' })}
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
								<th>{intl.formatMessage({ id: 'page.ieo.detail.buyerHistory.allPurchases.uid' })}</th>
								<th>{intl.formatMessage({ id: 'page.ieo.detail.buyerHistory.allPurchases.quantity' })}</th>
								<th>{intl.formatMessage({ id: 'page.ieo.detail.buyerHistory.allPurchases.totalPurchase' })}</th>
								<th>{intl.formatMessage({ id: 'page.ieo.detail.buyerHistory.allPurchases.buyDate' })}</th>
							</tr>
							<tr></tr>
						</thead>
						<tbody>{listHistory.loading ? <></> : renderBuyersHistory()}</tbody>
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
		</>
	);
};
