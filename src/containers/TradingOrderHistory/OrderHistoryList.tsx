import { CloseIcon } from 'assets/images/CloseIcon';
import { Decimal } from 'components';
import { localeDate, setTradeColor } from 'helpers';
import {
	ordersHistoryCancelFetch,
	resetOrdersHistory,
	selectCancelAllFetching,
	selectCancelFetching,
	selectCurrentMarket,
	selectOrdersHistory,
	selectUserLoggedIn,
	userOrdersHistoryFetch,
} from 'modules';
import { OrderCommon } from 'modules/types';
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { OrderHistoryListStyle } from './styles';
import { TableOrder } from './TableOrder';

// tslint:disable-next-line: no-empty-interface
interface OrderHistoryListProps {}

export const OrderHistoryList: React.FC<OrderHistoryListProps> = ({}) => {
	const dispatch = useDispatch();
	const intl = useIntl();

	const userLoggedIn = useSelector(selectUserLoggedIn);
	const currentMarket = useSelector(selectCurrentMarket);
	const list = useSelector(selectOrdersHistory);
	const cancelAllFetching = useSelector(selectCancelAllFetching);
	const cancelFetching = useSelector(selectCancelFetching);

	React.useEffect(() => {
		if (userLoggedIn && currentMarket) {
			dispatch(userOrdersHistoryFetch({ pageIndex: 0, type: 'all', limit: 25, market: currentMarket.id }));
		}

		return () => {
			dispatch(resetOrdersHistory());
		};
	}, [currentMarket]);

	const renderOrdersHistoryRow = (item: OrderCommon) => {
		if (!currentMarket) {
			return [];
		}

		const {
			id,
			executed_volume,
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

		const orderType = getType(side, ord_type ? ord_type : '');
		const costRemaining = +remaining_volume * +price; // price or avg_price ???
		const date = localeDate(updated_at ? updated_at : created_at, 'fullDate');
		const status = setOrderStatus(state);
		const actualPrice = ord_type === 'market' || status === 'done' ? avg_price : price;

		const { price_precision, amount_precision } = currentMarket;

		return [
			date,
			<span style={{ color: setTradeColor(side).color }} key={id}>
				{orderType}
			</span>,
			<span style={{ color: setTradeColor(side).color }} key={id}>
				{Decimal.formatRemoveZero(actualPrice, price_precision)}
			</span>,
			<span style={{ color: setTradeColor(side).color }} key={id}>
				{Decimal.formatRemoveZero(origin_volume, amount_precision)}
			</span>,
			<span style={{ color: setTradeColor(side).color }} key={id}>
				{Decimal.formatRemoveZero(executed_volume, amount_precision)}
			</span>,
			<span style={{ color: setTradeColor(side).color }} key={id}>
				{Decimal.formatRemoveZero(remaining_volume, amount_precision)}
			</span>,
			<span style={{ color: setTradeColor(side).color }} key={id}>
				{Decimal.formatRemoveZero(costRemaining, amount_precision)}
			</span>,
			status,
			state === 'wait' && <CloseIcon key={id} onClick={() => id && handleCancel(id)} />,
		];
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
					<span className="td-order-history-list-executed">
						<FormattedMessage id={`page.body.openOrders.content.status.done`} />
					</span>
				);
			case 'cancel':
				return (
					<span className="td-order-history-list-canceled">
						<FormattedMessage id={`page.body.openOrders.content.status.cancel`} />
					</span>
				);
			case 'wait':
				return (
					<span className="td-order-history-list-elem-opened">
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
		dispatch(ordersHistoryCancelFetch({ id, type: 'all', list }));
	};

	const retrieveData = (listParam: OrderCommon[]) => {
		return listParam.map(renderOrdersHistoryRow);
	};

	const renderHeaders = () => {
		return [
			intl.formatMessage({ id: 'page.body.history.deposit.header.date' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.pair' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.price' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.amount' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.executed' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.remaining' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.costRemaining' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.status' }),
			'',
		];
	};

	return (
		<OrderHistoryListStyle>
			<TableOrder headersKeys={renderHeaders()} data={retrieveData(list)} />
		</OrderHistoryListStyle>
	);
};
