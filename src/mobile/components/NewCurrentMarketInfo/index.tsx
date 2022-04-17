import { Drawer } from 'antd';
import { MarketTradingSvg } from 'assets/images/trading/MarketTradingSvg';
import classnames from 'classnames';
import { NewTabPanel } from 'components';
import { TradingChart, TradingTradeHistory } from 'containers';
import threeDotSvg from 'mobile/assets/icons/Trading/threeDot.svg';
import toChartSvg from 'mobile/assets/icons/Trading/toChart.svg';
import toListSvg from 'mobile/assets/icons/Trading/toList.svg';
import { selectCurrentMarket, selectMarketTickers } from 'modules';
import { TabPane, TabsProps } from 'rc-tabs';
import React from 'react';
import { ListGroup } from 'react-bootstrap';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { NewAllMarketList } from '../NewAllMarketList';
import { NewCreateOrder } from '../NewCreateOrder';
import { NewOrderBook } from '../NewOrderBook';

const OptionList: React.FC = () => {
	const [isShow, setIsShow] = React.useState(false);
	const [favoriteKeyState, setFavoriteKeyState] = React.useState<string[]>([]);
	const currentMarket = useSelector(selectCurrentMarket, isEqual);
	const intl = useIntl();

	React.useEffect(() => {
		//load favourites_markets
		const listFavoriteKey = JSON.parse(localStorage.getItem('favourites_markets') || '[]') as string[];
		if (listFavoriteKey.length) {
			setFavoriteKeyState(listFavoriteKey);
		}
	}, []);

	React.useEffect(() => {
		localStorage.setItem('favourites_markets', JSON.stringify(favoriteKeyState));
	}, [favoriteKeyState.length]);

	const handleSelectFavorite = () => {
		if (currentMarket) {
			if (favoriteKeyState.includes(currentMarket.id)) {
				setFavoriteKeyState(favoriteKeyState.filter(item => item !== currentMarket.id));
			} else {
				setFavoriteKeyState([...favoriteKeyState].concat([currentMarket.id]));
			}
		}
		setIsShow(false);
	};

	const className = classnames({
		'd-block': isShow,
	});

	return (
		<div className="d-inline-block td-mobile-cpn-current-market-info__header__option">
			<img
				src={threeDotSvg}
				alt=""
				onClick={() => setIsShow(prev => !prev)}
				onMouseOut={() => {
					setTimeout(() => {
						setIsShow(false);
					}, 0);
				}}
			/>
			<ListGroup className={className}>
				<ListGroup.Item onClick={handleSelectFavorite}>
					<MarketTradingSvg active={currentMarket && favoriteKeyState.includes(currentMarket.id)} />
					{currentMarket && favoriteKeyState.includes(currentMarket.id)
						? intl.formatMessage({ id: 'page.body.trade.header.option.favorites.remove' })
						: intl.formatMessage({ id: 'page.body.trade.header.option.favorites.add' })}
				</ListGroup.Item>
			</ListGroup>
		</div>
	);
};

const ChartTab: React.FC = () => {
	const intl = useIntl();
	const [tabIndex, setTabIndex] = React.useState(0);

	const TAB_LIST_INFO = [
		{
			content: tabIndex === 0 ? <NewOrderBook horizontal /> : null,
			label: intl.formatMessage({ id: 'page.mobile.charts.label.orderBook' }),
		},
		{
			content: tabIndex === 1 ? <TradingTradeHistory /> : null,
			label: intl.formatMessage({ id: 'page.mobile.charts.label.trades' }),
		},
	];

	const onChangeTabIndex: TabsProps['onChange'] = index => {
		setTabIndex(Number(index));
	};

	return (
		<React.Fragment>
			<div className="td-mobile-cpn-current-market-info__chart mb-3">
				<TradingChart hideHeaderContent />
			</div>

			<div className="td-mobile-cpn-current-market-info__history">
				<NewTabPanel onChange={onChangeTabIndex}>
					{TAB_LIST_INFO.map((tabInfo, i) => (
						<TabPane key={i.toString()} tab={tabInfo.label}>
							{tabInfo.content}
						</TabPane>
					))}
				</NewTabPanel>
			</div>
		</React.Fragment>
	);
};

const defaultTicker = { amount: 0, low: 0, last: 0, high: 0, volume: 0, price_change_percent: '+0.00%' };

export const CurrentMarketInfoComponent: React.FC = () => {
	const [showDrawer, setShowDrawer] = React.useState(false);
	const [modeKey, setModeKey] = React.useState<'chart' | 'order'>('order');
	const currentMarket = useSelector(selectCurrentMarket, isEqual);
	const marketTickers = useSelector(selectMarketTickers);
	const intl = useIntl();

	React.useEffect(() => {
		if (showDrawer) {
			setShowDrawer(false);
		}
	}, [currentMarket]);

	const getTickerValue = (value: string) => {
		return currentMarket && (marketTickers[currentMarket.id] || defaultTicker)[value];
	};

	const onChangeMode = () => {
		modeKey === 'order' ? setModeKey('chart') : setModeKey('order');
	};

	const renderContent = () => {
		if (modeKey === 'chart') {
			return <ChartTab />;
		} else {
			return <NewCreateOrder />;
		}
	};

	const isPositive = currentMarket && /\+/.test(getTickerValue('price_change_percent'));
	const cls = isPositive ? 'positive' : 'negative';

	return (
		<div className="td-mobile-cpn-current-market-info">
			<Drawer
				className="td-mobile-cpn-current-market-info__drawer"
				visible={showDrawer}
				onClose={() => setShowDrawer(false)}
				placement="left"
				width="85%"
			>
				<div className="mt-5 mb-2 td-mobile-cpn-current-market-info__drawer__header">
					<h4>{intl.formatMessage({ id: 'page.body.trade.header.listMarkets.title' })}</h4>
				</div>
				<NewAllMarketList pagination={false} hideFavorite />
			</Drawer>
			<div className="td-mobile-cpn-current-market-info__header d-flex">
				<div className="td-mobile-cpn-current-market-info__header__left d-flex flex-fill align-items-center">
					<div onClick={() => setShowDrawer(true)}>
						<img className="mr-3" src={toListSvg} alt="" />
					</div>
					<span className="td-mobile-cpn-current-market-info__header__name mr-2">
						{currentMarket && currentMarket.name.toUpperCase()}
					</span>
					<span
						className={`td-mobile-cpn-current-market-info__header__percent td-mobile-cpn-current-market-info__header__percent--${cls}`}
					>
						{getTickerValue('price_change_percent')}
					</span>
				</div>
				<div className="td-mobile-cpn-current-market-info__header__right d-flex justify-content-end flex-fill align-items-center">
					<img
						className="td-mobile-cpn-current-market-info__header__change-tab mr-1 pr-2 pl-2"
						src={toChartSvg}
						alt=""
						onClick={onChangeMode}
					/>
					<OptionList />
				</div>
			</div>
			<div className="td-mobile-cpn-current-market-info__content">{renderContent()}</div>
		</div>
	);
};

export const NewCurrentMarketInfo = React.memo(CurrentMarketInfoComponent);
