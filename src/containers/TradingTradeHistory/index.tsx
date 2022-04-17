import { NewTabPanel } from 'components';
import { resetHistory, selectUserLoggedIn } from 'modules';
import { TabPane, TabsProps } from 'rc-tabs';
import * as React from 'react';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { RecentTradesMarket } from './Market';
import { MarketHistory } from './styles';
import { RecentTradesYours } from './Yours';

const TradingTradeHistoryContainer: React.FC = () => {
	const intl = useIntl();
	const dispatch = useDispatch();
	const userLoggedIn = useSelector(selectUserLoggedIn, isEqual);

	const [tabKeyActiveState, setTabKeyActiveState] = React.useState<string>(
		intl.formatMessage({ id: 'page.body.trade.tab.marketTrades' }),
	);

	React.useEffect(() => {
		return () => {
			dispatch(resetHistory());
		};
	}, []);

	const getTabListInfo = () => {
		const result = [
			{
				label: intl.formatMessage({ id: 'page.body.trade.tab.marketTrades' }),
				content:
					tabKeyActiveState === intl.formatMessage({ id: 'page.body.trade.tab.marketTrades' }) ? (
						<RecentTradesMarket />
					) : null,
			},
		];

		if (userLoggedIn) {
			result.push({
				label: intl.formatMessage({ id: 'page.body.trade.tab.myTrades' }),
				content:
					tabKeyActiveState === intl.formatMessage({ id: 'page.body.trade.tab.myTrades' }) ? (
						<RecentTradesYours />
					) : null,
			});
		}

		return result;
	};

	const handleOnchangeTab: TabsProps['onChange'] = key => {
		setTabKeyActiveState(key);
	};

	const renderTabs = (tabsInfo: ReturnType<typeof getTabListInfo>) => {
		return (
			<NewTabPanel defaultActiveKey="1" onChange={handleOnchangeTab}>
				{tabsInfo.map(item => (
					<TabPane tab={item.label} key={item.label}>
						{item.content}
					</TabPane>
				))}
			</NewTabPanel>
		);
	};

	return <MarketHistory className="td-markets-history-list-container">{renderTabs(getTabListInfo())}</MarketHistory>;
};

export const TradingTradeHistory = TradingTradeHistoryContainer;
