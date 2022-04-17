import downSvg from 'assets/images/trading/down.svg';
import { OrderBookBuySvg, OrderBookSellSvg, OrderBookSvg } from 'assets/images/trading/OrderBookSvg';
import upSvg from 'assets/images/trading/up.svg';
import classNames from 'classnames';
import { ConvertUsd, Decimal } from 'components';
import { accumulateVolume } from 'helpers';
import { useOrderBookFetch } from 'hooks';
import get from 'lodash/get';
import millify from 'millify';
import {
	Market,
	selectCurrentMarket,
	selectCurrentPrice,
	selectDepthAsks,
	selectDepthBids,
	selectMarketTickers,
	setCurrentAmount,
	setCurrentPrice,
	setOrderType,
	Ticker,
} from 'modules';
import * as React from 'react';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

const defaultTicker = { amount: 0, low: 0, last: 0, high: 0, volume: 0, price_change_percent: '+0.00%' };

const OrderBookContainer = props => {
	useOrderBookFetch();
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const [tabState, setTabState] = React.useState<'all' | 'buy' | 'sell'>('all');
	const [width, setWidth] = React.useState(0);
	const orderRef = React.useRef<HTMLDivElement>(null);

	const bids = useSelector(selectDepthBids);
	const asks = useSelector(selectDepthAsks);
	const currentMarket = useSelector(selectCurrentMarket, isEqual);
	const currentPrice = useSelector(selectCurrentPrice, isEqual);
	const marketTickers = useSelector(selectMarketTickers, isEqual);

	const getTickerValue = React.useCallback((cMarket: Market, tickers: { [key: string]: Ticker }) => {
		return tickers[cMarket.id] || defaultTicker;
	}, []);

	// eslint-disable-next-line
	React.useEffect(() => {
		const { current } = orderRef;
		if (current && current.clientWidth !== width) {
			setWidth(current.clientWidth);
		}
	});

	const currentTicker = currentMarket && getTickerValue(currentMarket, marketTickers);
	const quoteUnit = get(currentMarket, 'quote_unit', '').toUpperCase();
	const baseUnit = get(currentMarket, 'base_unit', '').toUpperCase();

	const renderOrderBook = React.useCallback((array: string[][], side: string, currentM?: Market) => {
		// tslint:disable-next-line: no-shadowed-variable
		const maxVolume = Math.max(...array.map(a => Number(a[1])));
		const priceFixed = currentM ? currentM.price_precision : 0;
		const amountFixed = currentM ? currentM.amount_precision : 0;

		return array.map((item, i) => {
			const [price, volume] = item;

			const volumnCustom =
				+volume > 10000000
					? millify(+volume, {
							precision: 2,
					  })
					: Decimal.formatRemoveZero(volume, amountFixed);

			return [
				Decimal.formatRemoveZero(price, priceFixed),
				volumnCustom,
				Decimal.formatRemoveZero(+price * +volume, priceFixed),
				Number((Number(volume) / (maxVolume / 100)).toFixed(2)),
			];
		});
	}, []);

	const handleOnSelectBids = React.useCallback(
		(index: string, total: number) => {
			const priceToSet = bids[Number(index)] && Number(bids[Number(index)][0]);
			if (currentPrice !== priceToSet && currentMarket) {
				dispatch(setCurrentPrice(priceToSet));
				dispatch(setCurrentAmount(Decimal.formatRemoveZero(total, currentMarket.amount_precision)));
				dispatch(setOrderType('buy'));
			}
		},
		[bids, currentPrice, dispatch],
	);

	const handleOnSelectAsks = React.useCallback(
		(index: string, total: number) => {
			const priceToSet = asks[Number(index)] && Number(asks[Number(index)][0]);
			if (currentPrice !== priceToSet && currentMarket) {
				dispatch(setCurrentPrice(priceToSet));
				dispatch(setCurrentAmount(Decimal.formatRemoveZero(total, currentMarket.amount_precision)));
				dispatch(setOrderType('sell'));
			}
		},
		[currentPrice, dispatch, asks],
	);

	const arrAsksElm = renderOrderBook(asks, 'asks', currentMarket);
	const arrBidsElm = renderOrderBook(bids, 'bids', currentMarket);
	const noDataElm = (
		<tr>
			<td className="td-order-book-table__empty_data text-center" style={{ width: '100%' }}>
				{formatMessage({ id: 'page.noDataToShow' })}
			</td>
		</tr>
	);
	const getBidsElm = React.useCallback(() => {
		if (arrBidsElm.length > 0) {
			const total = accumulateVolume(bids);

			return arrBidsElm.map((item, i) => (
				<tr className="cnt-order-book-tr" key={i} onClick={() => handleOnSelectBids(i.toString(), total[i])}>
					<td className="td-order-book-item__positive">{item[0]}</td>
					<td>{item[1]}</td>
					<td className="text-right">{item[2]}</td>
					<td className="cnt-order-book-tr__show-percent-right" style={{ width: `${(item[3] as number) || 0}%` }}></td>
				</tr>
			));
		}

		return noDataElm;
	}, [currentMarket, bids]);
	const getAsksElm = React.useCallback(() => {
		if (arrAsksElm.length > 0) {
			const total = accumulateVolume(asks);

			return arrAsksElm.map((item, i) => (
				<tr className="cnt-order-book-tr" key={i} onClick={() => handleOnSelectAsks(i.toString(), total[i])}>
					<td className="td-order-book-item__negative">{item[0]}</td>
					<td>{item[1]}</td>
					<td className="text-right">{item[2]}</td>
					<td className="cnt-order-book-tr__show-percent-left" style={{ width: `${(item[3] as number) || 0}%` }}></td>
				</tr>
			));
		}

		return noDataElm;
	}, [currentMarket, asks]);

	const infoTabs: Array<{
		labelTooltip: string;
		key: typeof tabState;
		render: () => JSX.Element;
	}> = [
		{
			labelTooltip: 'Order Book',
			key: 'all',
			render: () => (
				<OrderBookSvg
					active={tabState === 'all'}
					className="mr-2"
					onClick={() => {
						setTabState('all');
					}}
				/>
			),
		},
		{
			labelTooltip: 'Buy',
			key: 'buy',
			render: () => (
				<OrderBookBuySvg
					active={tabState === 'buy'}
					className="mr-2"
					onClick={() => {
						setTabState('buy');
					}}
				/>
			),
		},
		{
			labelTooltip: 'Sell',
			key: 'sell',
			render: () => (
				<OrderBookSellSvg
					active={tabState === 'sell'}
					className="mr-2"
					onClick={() => {
						setTabState('sell');
					}}
				/>
			),
		},
	];

	const elementTabs = infoTabs.map(({ key, labelTooltip, render }) => (
		<OverlayTrigger
			key={key}
			placement="bottom"
			overlay={
				<Tooltip className="td-order-book-tooltip" id="td-order-book-header-all">
					{labelTooltip}
				</Tooltip>
			}
		>
			{render()}
		</OverlayTrigger>
	));

	const isPositive =
		currentMarket && /\+/.test(currentMarket && (marketTickers[currentMarket.id] || defaultTicker).price_change_percent);
	const cls = isPositive ? 'positive' : 'negative';

	const classNameTable = classNames(
		'td-order-book-table',
		{
			'td-order-book-table--all': tabState === 'all',
		},
		{
			'td-order-book-table--orther': tabState !== 'all',
		},
	);

	const classNameTableReverse = classNameTable + ' td-reverse-table-body';

	return (
		<div className="cnt-order-book ">
			<Row className="h-100">
				<Col className="h-100 td-order-book-wrapper p-0" xs={12}>
					<div className="td-order-book">
						<div className="td-order-book-header d-flex flex-wrap justify-content-between">
							<div className="td-order-book-header__title">
								<h3>{formatMessage({ id: 'page.body.trading.header.orderBook.header.title' })}</h3>
							</div>
							<div className="td-order-book-header-icon">
								<Col className="p-0 d-flex align-items-center">{elementTabs}</Col>
								<Col className="p-0 d-flex align-items-center"></Col>
							</div>
						</div>
						<div className="td-order-book-tbheader">
							<div className="p-0">
								{`${formatMessage({ id: 'page.body.trading.header.orderBook.header.title.price' })}${
									currentMarket ? `(${quoteUnit})` : ''
								}`}
							</div>
							<div className="p-0">
								{`${formatMessage({ id: 'page.body.trading.header.orderBook.header.title.amount' })}${
									currentMarket ? `(${baseUnit})` : ''
								}`}
							</div>
							<div className="p-0 text-right">
								{`${formatMessage({ id: 'page.body.trading.header.orderBook.header.title.sum' })}${
									currentMarket ? `(${quoteUnit})` : ''
								}`}
							</div>
						</div>
						{tabState === 'all' || tabState === 'sell' ? (
							<table className={classNameTableReverse}>
								<tbody>{getAsksElm()}</tbody>
							</table>
						) : null}
						<div className="td-order-book-ticker d-flex">
							<Col
								className={`p-0  td-order-book-ticker__last-price d-flex align-items-center td-order-book-item__${cls}`}
								lg="auto"
							>
								{Decimal.formatRemoveZero(
									+get(currentTicker, 'last', 0),
									get(currentMarket, 'price_precision', 0),
								)}
								{cls === 'positive' ? <img src={upSvg} alt="" /> : <img src={downSvg} alt="" />}
							</Col>
							<Col className={`p-0  td-order-book-ticker__usd d-flex align-items-center`} lg="auto">
								${' '}
								<ConvertUsd
									value={+get(currentTicker, 'last', 0)}
									symbol={get(currentMarket, 'quote_unit', '')}
								/>
							</Col>
						</div>
						{tabState === 'all' || tabState === 'buy' ? (
							<table className={classNameTable}>
								<tbody>{getBidsElm()}</tbody>
							</table>
						) : null}
					</div>
				</Col>
			</Row>
		</div>
	);
};

export const NewOrderBook = OrderBookContainer;
