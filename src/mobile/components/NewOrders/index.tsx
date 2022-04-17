import { CloseIcon } from 'assets/images/CloseIcon';
import { NewTabPanel } from 'components';
import { useUserOrdersHistoryFetch } from 'hooks';
import {
	ordersCancelAllFetch,
	ordersHistoryCancelFetch,
	selectOrdersHistory,
	selectShouldFetchCancelAll,
	selectShouldFetchCancelSingle,
} from 'modules';
import { TabPane } from 'rc-tabs';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { OrdersItem } from './OrdersItem';

const userOrdersHistoryTabs = ['open', 'all'];

const OrdersComponent: React.FC = () => {
	const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
	const dispatch = useDispatch();
	const intl = useIntl();
	const orders = useSelector(selectOrdersHistory);
	const shouldFetchCancelAll = useSelector(selectShouldFetchCancelAll);
	const shouldFetchCancelSingle = useSelector(selectShouldFetchCancelSingle);
	const filteredOrders = currentTabIndex === 0 ? orders.filter(o => ['wait', 'pending'].includes(o.state)) : orders;
	useUserOrdersHistoryFetch(0, userOrdersHistoryTabs[currentTabIndex], 25);

	const handleCancelAllOrders = () => {
		if (shouldFetchCancelAll) {
			dispatch(ordersCancelAllFetch());
		}
	};

	const handleCancelSingleOrder = (id: number) => () => {
		if (shouldFetchCancelAll && shouldFetchCancelSingle) {
			dispatch(
				ordersHistoryCancelFetch({
					id,
					type: userOrdersHistoryTabs[currentTabIndex],
					list: filteredOrders,
				}),
			);
		}
	};

	const renderOptionalHead = () => (
		<div className="td-mobile-cpn-orders__optional-head" onClick={handleCancelAllOrders}>
			<span>{intl.formatMessage({ id: 'page.mobile.orders.cancelAll' })}</span>
			<CloseIcon />
		</div>
	);

	const renderTab = (tabIndex: number) => (
		<div key={tabIndex} className="td-mobile-cpn-orders__content">
			{filteredOrders.length ? (
				filteredOrders.map((order, index) => (
					<OrdersItem key={index} order={order} handleCancel={handleCancelSingleOrder} />
				))
			) : (
				<span className="no-data">{intl.formatMessage({ id: 'page.noDataToShow' })}</span>
			)}
		</div>
	);

	const TAB_LIST_INFO = [
		{
			content: currentTabIndex === 0 ? renderTab(currentTabIndex) : null,
			label: intl.formatMessage({ id: 'page.mobile.orders.tabs.open' }),
		},
		{
			content: currentTabIndex === 1 ? renderTab(currentTabIndex) : null,
			label: intl.formatMessage({ id: 'page.mobile.orders.tabs.all' }),
		},
	];

	return (
		<div className="td-mobile-cpn-orders">
			<NewTabPanel
				tabBarExtraContent={renderOptionalHead()}
				defaultActiveKey="0"
				onChange={key => setCurrentTabIndex(Number(key))}
			>
				{TAB_LIST_INFO.map((tabInfo, i) => (
					<TabPane key={i.toString()} tab={tabInfo.label}>
						{tabInfo.content}
					</TabPane>
				))}
			</NewTabPanel>
		</div>
	);
};

export const NewOrders = React.memo(OrdersComponent);
