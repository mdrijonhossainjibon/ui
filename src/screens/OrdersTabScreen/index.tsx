import { FilterElement } from 'components/FilterElementOrdersHistory';
import {
	marketsFetch,
	ordersCancelAllFetch,
	ordersHistoryCancelFetch,
	resetOrdersHistory,
	selectCancelAllFetching,
	selectCancelFetching,
	selectMarkets,
	selectOrdersHistory,
	selectOrdersHistoryLoading,
	selectUserLoggedIn,
	userOrdersHistoryAllFetch,
} from 'modules';
import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Decimal } from '../../components/Decimal';
import { localeDate, setDocumentTitle, setTradeColor } from '../../helpers';
import { rangerConnectFetch } from '../../modules/public/ranger';
import { selectRanger } from '../../modules/public/ranger/selectors';
import { OrderCommon } from '../../modules/types';
import ReactPaginate from 'react-paginate';

const NUMBER_ITEM_DISPLAY = 20;

export const OrdersTabScreen = () => {
	const [paginationState, setPaginationState] = useState(0);

	const intl = useIntl();
	const [tab, setTab] = useState('open');
	const [pageIndex, setPageIndex] = useState(1);

	const marketsData = useSelector(selectMarkets);
	const list = useSelector(selectOrdersHistory);
	const fetching = useSelector(selectOrdersHistoryLoading);
	const cancelAllFetching = useSelector(selectCancelAllFetching);
	const cancelFetching = useSelector(selectCancelFetching);
	const rangerState = useSelector(selectRanger);
	const userLoggedIn = useSelector(selectUserLoggedIn);

	const [listData, setListData] = useState(list);

	const dispatch = useDispatch();
	const handlePageClick = (selectedItem: { selected: number }) => {
		setPaginationState(selectedItem.selected);
	};
	useEffect(() => {
		dispatch(userOrdersHistoryAllFetch({ pageIndex: 1, type: tab, limit: 25 }));
		setDocumentTitle('Orders');
		dispatch(marketsFetch());

		if (!rangerState.connected) {
			dispatch(rangerConnectFetch({ withAuth: userLoggedIn }));
		}

		return () => {
			dispatch(resetOrdersHistory());
		};
	}, [dispatch, rangerState.connected, tab, userLoggedIn]);

	useEffect(() => {
		setListData(list);
		// const newMaxPage = Math.ceil(list.length / NUMBER_ITEM_DISPLAY) === 0 ? 1 : Math.ceil(list.length / NUMBER_ITEM_DISPLAY);
	}, [list]);

	const tabMapping = ['open', 'all'];

	const onCurrentTabChange = (index: number) => {
		if (tabMapping[index] !== tab) {
			dispatch(userOrdersHistoryAllFetch({ pageIndex: 1, type: tabMapping[index], limit: 25 }));
			setPageIndex(1);
			setTab(tabMapping[index]);
		}
	};

	const renderTabsLabel = () => {
		const labelTabs = [
			{
				className:
					tab === 'open'
						? 'history-screen__tabs__label__item history-screen__tabs__label__item--active'
						: 'history-screen__tabs__label__item',
				label: intl.formatMessage({ id: 'page.body.openOrders.tab.open' }),
			},
			{
				className:
					tab === 'all'
						? 'history-screen__tabs__label__item history-screen__tabs__label__item--active'
						: 'history-screen__tabs__label__item',
				label: intl.formatMessage({ id: 'page.body.openOrders.tab.all' }),
			},
		];

		return (
			<React.Fragment>
				{labelTabs.map((label, index) => {
					return (
						<div className={label.className} onClick={() => onCurrentTabChange(index)} key={index}>
							{label.label}
						</div>
					);
				})}
			</React.Fragment>
		);
	};

	const renderHeadersTable = () => {
		const headersTable = [
			intl.formatMessage({ id: 'page.body.history.deposit.header.date' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.orderType' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.pair' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.price' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.amount' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.executed' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.remaining' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.costRemaining' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.status' }),
			<div className="history-screen__tabs__content__table__header__item--icon">
				<span onClick={() => dispatch(ordersCancelAllFetch())}>
					{intl.formatMessage({ id: 'page.body.openOrders.header.button.cancelAll' })}
					{/* <FaTimes className="ml-2" /> */}
				</span>
			</div>,
		];

		return headersTable.map((headerTable, index: number) => {
			return (
				<th scope="col" key={index}>
					{headerTable}
				</th>
			);
		});
	};

	const getType = (side: string, orderType: string) => {
		if (!side || !orderType) {
			return '';
		}

		return intl.formatMessage({ id: `page.body.openOrders.header.orderType.${side}.${orderType}` });
	};

	const setOrderStatus = (status: string) => {
		switch (status) {
			case 'done':
				return (
					<span className="history-screen__tabs__content__table__body__item-table--wait">
						<FormattedMessage id={`page.body.openOrders.content.status.done`} />
					</span>
				);
			case 'cancel':
				return (
					<span className="history-screen__tabs__content__table__body__item-table--failed">
						<FormattedMessage id={`page.body.openOrders.content.status.cancel`} />
					</span>
				);
			case 'wait':
				return (
					<span className="history-screen__tabs__content__table__body__item-table--succeed">
						<FormattedMessage id={`page.body.openOrders.content.status.wait`} />
					</span>
				);
			default:
				return status;
		}
	};

	const handleCancel = (id: number) => () => {
		if (cancelAllFetching || cancelFetching) {
			return;
		}
		dispatch(ordersHistoryCancelFetch({ id, type: tab, list }));
	};

	const renderTableRow = (item, index) => {
		const {
			id,
			executed_volume,
			market,
			ord_type,
			price,
			avg_price,
			remaining_volume,
			origin_volume,
			side,
			state,
			updated_at,
			created_at,
		} = item;
		const currentMarket = marketsData.find(m => m.id === market) || {
			name: '',
			price_precision: 0,
			amount_precision: 0,
		};
		const orderType = getType(side, ord_type);
		const marketName = currentMarket ? currentMarket.name : market;
		const costRemaining = remaining_volume * price; // price or avg_price ???
		const date = localeDate(updated_at ? updated_at : created_at, 'fullDate');
		const status = setOrderStatus(state);
		const actualPrice = ord_type === 'market' || status === 'done' ? avg_price : price;

		return (
			<tr key={index}>
				<td>{date}</td>
				<td style={{ color: setTradeColor(side).color }}>{orderType}</td>
				<td>{marketName}</td>
				<td>
					<Decimal key={id} fixed={currentMarket.price_precision}>
						{actualPrice}
					</Decimal>
				</td>
				<td>
					<Decimal key={id} fixed={currentMarket.amount_precision}>
						{origin_volume}
					</Decimal>
				</td>
				<td>
					<Decimal key={id} fixed={currentMarket.amount_precision}>
						{executed_volume}
					</Decimal>
				</td>
				<td>
					<Decimal key={id} fixed={currentMarket.amount_precision}>
						{remaining_volume}
					</Decimal>
				</td>
				<td>
					<Decimal key={id} fixed={currentMarket.amount_precision}>
						{costRemaining.toString()}
					</Decimal>
				</td>
				<td>{status}</td>
				<td className="text-right history-screen__tabs__content__table__body__item-table--icon">
					{state === 'wait' && <FaTimes key={id} onClick={handleCancel(id)} />}
				</td>
			</tr>
		);
	};

	const renderTable = () => {
		const indexElemStart = (pageIndex - 1) * NUMBER_ITEM_DISPLAY;
		const indexElemStop = (pageIndex - 1) * NUMBER_ITEM_DISPLAY + NUMBER_ITEM_DISPLAY;

		const bodyTable = () =>
			listData.slice(indexElemStart, indexElemStop).map((item, index) => {
				return renderTableRow(item, index);
			});
		const emptyData = () => {
			return listData.length === 0 ? (
				<div className="text-center history-screen__tabs__content__table pt-5 pb-5">
					Empty data . Please next page or prev page{' '}
				</div>
			) : (
				''
			);
		};

		return fetching ? (
			<div className="d-flex justify-content-center mt-5 mb-5">
				<div className="spinner-border text-success spinner-loadding" role="status"></div>
			</div>
		) : (
			<div>
				<table className="history-screen__tabs__content__table">
					<thead className=" history-screen__tabs__content__table__header">
						<tr>{renderHeadersTable()}</tr>
					</thead>
					<tbody className=" history-screen__tabs__content__table__body">{bodyTable()}</tbody>
				</table>
				{emptyData()}
			</div>
		);
	};

	//--------------------------render pagination--------------------------//

	const renderPagination = () => {
		return (
			<ReactPaginate
				previousLabel={'<'}
				nextLabel={'>'}
				breakLabel={'...'}
				breakClassName={'break-me'}
				pageCount={list.length / NUMBER_ITEM_DISPLAY}
				marginPagesDisplayed={2}
				pageRangeDisplayed={5}
				onPageChange={handlePageClick}
				containerClassName={'pagination'}
				activeClassName={'active'}
				forcePage={paginationState}
			/>
		);
	};

	const renderFilterBar = () => {
		const onFilter = (dataFilter: OrderCommon[]) => {
			setPageIndex(1);
			setListData(dataFilter);
			// const newMaxPage = Math.ceil(dataFilter.length / limitElem) === 0 ? 1 : Math.ceil(dataFilter.length / limitElem);
			// setMaxPage(newMaxPage);
		};

		const onRestFilter = () => {
			setListData(list);
			setPageIndex(1);
			// const newMaxPage = Math.ceil(list.length / limitElem) === 0 ? 1 : Math.ceil(list.length / limitElem);
			// setMaxPage(newMaxPage);
		};

		return tab === 'all' ? <FilterElement onFilter={onFilter} onRestFilter={onRestFilter} data={list} /> : '';
	};

	return (
		<div className="history-screen history-screen-container">
			<div className="history-screen__title">Orders</div>
			{renderFilterBar()}
			<div className="history-screen__tabs ">
				<div className="history-screen__tabs__label   d-flex">{renderTabsLabel()}</div>
				<div className="history-screen__tabs__content">{renderTable()}</div>
				<div className="history-screen__tabs__content__pagination w-100 d-flex justify-content-center">
					{renderPagination()}
				</div>
			</div>
		</div>
	);
};
