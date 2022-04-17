import { CloseIcon } from 'assets/images/CloseIcon';
import { ordersCancelAllFetch, selectCurrentMarket } from 'modules';
import Tabs, { TabPane, TabsProps } from 'rc-tabs';
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { OpenOrders } from './OpenOrders';
import { OrderHistoryList } from './OrderHistoryList';
import { OrderHistoryStyle } from './styles';

// tslint:disable-next-line: no-empty-interface
interface OrderHistoryProps {}

export const TradingOrderHistory: React.FC<OrderHistoryProps> = ({}) => {
	const dispatch = useDispatch();
	const intl = useIntl();

	const currentMarket = useSelector(selectCurrentMarket);

	const [tabKeyActiveState, setTabKeyActiveState] = React.useState<string>(
		intl.formatMessage({ id: 'page.body.trade.header.openOrders' }),
	);

	const tabsInfo = [
		{
			label: intl.formatMessage({ id: 'page.body.trade.header.openOrders' }),
			render: () => {
				return tabKeyActiveState === intl.formatMessage({ id: 'page.body.trade.header.openOrders' }) ? (
					<OpenOrders />
				) : null;
			},
		},
		{
			label: intl.formatMessage({ id: 'page.body.trade.header.orderHistory' }),
			render: () => {
				return tabKeyActiveState === intl.formatMessage({ id: 'page.body.trade.header.orderHistory' }) ? (
					<OrderHistoryList />
				) : null;
			},
		},
	];

	const handleOnchangeTab: TabsProps['onChange'] = key => {
		setTabKeyActiveState(key);
	};

	const handleCancelAll = () => {
		currentMarket && dispatch(ordersCancelAllFetch({ market: currentMarket.id }));
	};

	return (
		<OrderHistoryStyle>
			<Tabs
				defaultActiveKey="1"
				onChange={handleOnchangeTab}
				tabBarExtraContent={
					<span className="td-open-orders-tabs__cancel" onClick={handleCancelAll}>
						<FormattedMessage id="page.body.openOrders.header.button.cancelAll" />
						<CloseIcon className="td-open-orders-tabs__close" />
					</span>
				}
			>
				{tabsInfo.map(item => (
					<TabPane tab={item.label} key={item.label}>
						{item.render()}
					</TabPane>
				))}
			</Tabs>
		</OrderHistoryStyle>
	);
};
