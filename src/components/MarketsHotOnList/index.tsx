import axios from 'axios';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Decimal, ConvertUsd } from '../../components';

import { toLower, toUpper } from 'lodash';
import { useIntl } from 'react-intl';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { currenciesFetch, Market, selectCurrencies, selectMarkets, selectMarketTickers, setCurrentMarket } from '../../modules';

const ChartWrap = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
`;
const MarketChartItem = styled.div`
	min-height: 100px;
	padding: 15px 0;
	border-radius: 8px;
	background-color: #172b4c;
	line-height: 1;
	cursor: pointer;
`;

export const MarketsHotOnlist: React.FC<any> = () => {
	const defaultTicker = {
		amount: '0.0',
		last: '0.0',
		high: '0.0',
		open: '0.0',
		low: '0.0',
		price_change_percent: '+0.00%',
		volume: '0.0',
	};
	const displayMarket = 'usdt';

	const dispatch = useDispatch();
	const [marketNames, setMarketNames] = React.useState<string[]>([]);
	const [kLinesState, setKlinesState] = React.useState<Array<Array<{ pv: string }>>>([]);
	const markets = useSelector(selectMarkets);
	const marketTickers = useSelector(selectMarketTickers);
	const currencies = useSelector(selectCurrencies);
	const intl = useIntl();

	React.useEffect(() => {
		dispatch(currenciesFetch());
	}, [dispatch]);

	React.useEffect(() => {
		if (markets.length) {
			const marketListToState = markets
				.filter(market => market.quote_unit.toLowerCase().includes(displayMarket))
				.map(market => {
					return {
						id: market.id,
						name: toLower(market.name),
						price_change_percent: (marketTickers[market.id] || defaultTicker).price_change_percent,
						price_change_percent_num: Math.abs(
							Number.parseFloat((marketTickers[market.id] || defaultTicker).price_change_percent),
						),
					};
				});

			if (marketTickers && !marketNames.length) {
				const greenList = marketListToState
					.filter(l => l.price_change_percent[0] === '+' && l.price_change_percent_num !== 0)
					.sort((a, b) => {
						return b.price_change_percent_num - a.price_change_percent_num;
					});
				const redList = marketListToState
					.filter(l => l.price_change_percent[0] === '-' && l.price_change_percent_num !== 0)
					.sort((a, b) => {
						return a.price_change_percent_num - b.price_change_percent_num;
					});
				const list = [...greenList, ...redList];

				const marketNames = list.slice(0, 4).map(market => {
					return market.name;
				});
				setMarketNames(marketNames);
			}
		} else {
			setMarketNames([]);
		}
	}, [markets.length]);

	const BASE_MARKET_URL = 'https://ex.udonex.com/api/v2/udonex/public/markets';
	// const BASE_MARKET_URL = `${window.document.location.origin}/api/v2/udonex/public/markets`;

	const fetchMarketsKlines = async (marketId: string, from: number, to: number) => {
		try {
			const klines = await axios.get(
				`${BASE_MARKET_URL}/${marketId.split('/').join('')}/k-line?period=30&time_from=${from}&time_to=${to}`,
			);
			return klines.data.map((kline, index) => {
				return { pv: kline[3] };
			});
		} catch (error) {
			return [];
		}
	};
	React.useEffect(() => {
		if (marketNames.length) {
			const from = Math.floor(Date.now() / 1000) - 60 * 24 * 60 * 1000;
			const to = Math.floor(Date.now() / 1000);
			const drawMarketLines = async () => {
				try {
					for (let i = 0; i < marketNames.length; i++) {
						const klines = await fetchMarketsKlines(marketNames[i], from, to);
						setKlinesState(prev => [...prev, klines]);
					}
				} catch (error) {
					console.log(error);
				}

				return;
			};
			drawMarketLines();
		}
	}, [marketNames]);

	const findIcon = (code: string): string => {
		const currency = currencies.find((currency: any) => toLower(currency.id) === toLower(code));
		try {
			return require(`../../../node_modules/cryptocurrency-icons/128/color/${toLower(code)}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}

			return require('../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	const history = useHistory();
	const handleRedirectToTrading = (id: string) => {
		const currentMarket: Market | undefined = markets.find(item => item.id === id);

		if (currentMarket) {
			dispatch(setCurrentMarket(currentMarket));
			history.push(`/market/${currentMarket.id}`);
		}
	};

	const MarketChart = (data: Array<{ pv: string }>, marketID: string) => {
		const market = markets.find(
			market =>
				toLower(market.quote_unit) === toLower(marketID.split('/')[1]) &&
				toLower(market.base_unit) === toLower(marketID.split('/')[0]),
		);
		const market_id = market ? toUpper(market.name) : '';
		const baseCurrency = market_id.split('/')[0];
		const quoteCurrency = market_id.split('/')[1];
		const last = market ? Decimal.format((marketTickers[market.id] || defaultTicker).last, market.price_precision) : '0.00';
		const open = market ? (marketTickers[market.id] || defaultTicker).open : '0.00';
		const price_change_percent = market ? (marketTickers[market.id] || defaultTicker).price_change_percent : '0.00%';
		const volume = market
			? Decimal.format((marketTickers[market.id] || defaultTicker).volume, market.amount_precision)
			: '0,00 -';
		const change = +last - +open;
		const marketChangeColor = +(change || 0) < 0 ? 'var(--system-red)' : 'var(--system-green)';

		return (
			<MarketChartItem>
				<div className="container" onClick={() => handleRedirectToTrading(market ? market.id : '')}>
					<div className="row mb-5 pb-4">
						<div className="col-12 d-flex justify-content-between">
							{baseCurrency && quoteCurrency ? (
								<div
									style={{
										position: 'relative',
									}}
								>
									<img
										style={{
											position: 'absolute',
											zIndex: 999,
											border: '2px solid #172B4C',
											borderRadius: '50%',
											width: 33,
											height: 33,
										}}
										width="30px"
										height="30px"
										src={findIcon(baseCurrency)}
										alt={baseCurrency}
									/>
									<img
										style={{
											position: 'absolute',
											left: 20,
											bottom: -30,
											zIndex: 0,
											borderRadius: '50%',
										}}
										width="30px"
										height="30px"
										src={findIcon(quoteCurrency)}
										alt={quoteCurrency}
									/>
									<span style={{ color: 'var(--body-background-color)' }}>-/-</span>
								</div>
							) : (
								<span className="text-white">–/–</span>
							)}

							<div
								style={{ fontSize: '1.2rem', position: 'absolute', top: 0, right: '1rem' }}
								className="text-white text-right"
							>
								<div>{toUpper(marketID)}</div>

								<div className="mt-3">
									<span style={{ color: marketChangeColor, fontWeight: 'bold' }}>{price_change_percent}</span>
								</div>
							</div>
						</div>
					</div>
					<div className="row" style={{ zIndex: 999, position: 'relative' }}>
						<div className="col-12 d-flex justify-content-start align-items-center">
							<span style={{ fontSize: '1.4rem', color: marketChangeColor }}>{last}</span>
							<p className="m-0 ml-3 text-white">
								≈ $ <ConvertUsd value={+last} symbol={quoteCurrency} />
							</p>
						</div>
					</div>
					<div className="row mt-3" style={{ zIndex: 999, position: 'relative' }}>
						<div className="col-12 d-flex justify-content: center">
							<div>
								<span style={{ color: '#FFF' }}>
									{intl.formatMessage({ id: 'page.marketsLists.marketsHotOnList.volume' })}
								</span>
								<span className="ml-2" style={{ marginRight: '5px', color: '#FFF', fontWeight: 'bold' }}>
									{volume}
								</span>
								<span style={{ color: '#FFF' }}>{quoteCurrency}</span>
							</div>
						</div>
					</div>
					<div className="row position-absolute fixed-bottom" style={{ zIndex: 100, position: 'absolute' }}>
						<div className="col-12">
							<ResponsiveContainer ani width="100%" aspect={4.5 / 1}>
								<AreaChart
									width={90}
									height={60}
									data={data}
									margin={{
										top: 5,
										right: 20,
										left: 20,
										bottom: 5,
									}}
								>
									<Area
										isAnimationActive={false}
										type="monotone"
										dataKey="pv"
										stroke="#728bb9"
										fill="#0d223e"
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>
			</MarketChartItem>
		);
	};

	const renderChart = () => {
		return (
			<ChartWrap>
				<div
					className="container-fluid"
					style={{ backgroundColor: 'transparent', padding: '1rem 0px', borderRadius: '1rem', zIndex: 1 }}
				>
					<div className="row">
						<div className="col-lg-3 col-md-6 mb-2 position-relative">
							{MarketChart(kLinesState[0] ? kLinesState[0] : [], marketNames[0] ? marketNames[0] : '')}
						</div>
						<div className="col-lg-3 col-md-6 mb-2 position-relative">
							{MarketChart(kLinesState[1] ? kLinesState[1] : [], marketNames[1] ? marketNames[1] : '')}
						</div>
						<div className="col-lg-3 col-md-6 mb-2 position-relative">
							{MarketChart(kLinesState[2] ? kLinesState[2] : [], marketNames[2] ? marketNames[2] : '')}
						</div>
						<div className="col-lg-3 col-md-6 mb-2 position-relative">
							{MarketChart(kLinesState[3] ? kLinesState[3] : [], marketNames[3] ? marketNames[3] : '')}
						</div>
					</div>
				</div>
			</ChartWrap>
		);
	};

	return <React.Fragment>{renderChart()}</React.Fragment>;
};
