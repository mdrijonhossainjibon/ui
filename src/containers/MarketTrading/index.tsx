import { incrementalOrderBook } from 'api';
import { MarketTradingSvg } from 'assets/images/trading/MarketTradingSvg';
import searchSvg from 'assets/images/trading/search.svg';
import classnames from 'classnames';
import { Decimal } from 'components';
import { getUrlPart, setDocumentTitle } from 'helpers';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import {
	depthFetch,
	Market,
	marketsFetch,
	selectCurrentMarket,
	selectMarkets,
	selectMarketTickers,
	selectUserLoggedIn,
	setCurrentMarket,
	setCurrentPrice,
} from 'modules';
import { rangerConnectFetch } from 'modules/public/ranger';
import { selectRanger } from 'modules/public/ranger/selectors';
import * as React from 'react';
import isEqual from 'react-fast-compare';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MarketsListTrading } from './MarketsListTrading';
import { MarketTradingStyle, SearchBlockStyle, StarBlockStyle } from './styles';
import { useIntl } from 'react-intl';

interface ObjDropdownState {
	childActiveKey: string;
}

interface CheckedDropdownState {
	[key: string]: ObjDropdownState;
}

interface StarItem {
	key: string;
	listKeyDropDown?: string[];
}

const LIST_KEY_FIAT_DROPDOWN = ['BUSD', 'USDC', 'TUSD'];

const MarketTradingContainer: React.FC = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const intl = useIntl();

	const markets = useSelector(selectMarkets, isEqual);
	const currentMarket = useSelector(selectCurrentMarket);
	const rangerState = useSelector(selectRanger);
	const userLoggedIn = useSelector(selectUserLoggedIn);
	const tickers = useSelector(selectMarketTickers);

	const [searchFieldState, setSearchFieldState] = React.useState<string>('');
	const [starSelectedState, setStarSelectedState] = React.useState<string>('ALL');
	const [checkedDropdownState, setCheckedDropdownState] = React.useState<CheckedDropdownState>({});
	const [favoriteKeyState, setFavoriteKeyState] = React.useState<string[]>([]);
	const [radioSelectedState, setRadioSelectedState] = React.useState<'change' | 'volume'>('change');

	const STAR_LIST_INFO: StarItem[] = [
		{
			key: 'FAVORITE',
		},
		{
			key: 'ALL',
		},
		{
			key: 'BTC',
		},
		{
			key: 'ETH',
		},
		{
			key: 'BNB',
		},
		{
			key: 'USDT',
		},
		{
			key: 'OTHER',
			listKeyDropDown: LIST_KEY_FIAT_DROPDOWN,
		},
	];

	React.useEffect(() => {
		//load favourites_markets
		const listFavoriteKey = JSON.parse(localStorage.getItem('favourites_markets') || '[]') as string[];
		if (listFavoriteKey.length) {
			setFavoriteKeyState(listFavoriteKey);
		}

		setDocumentTitle(intl.formatMessage({ id: 'page.trading.documentTitle' }));
		const { connected, withAuth } = rangerState;

		if (markets.length < 1) {
			dispatch(marketsFetch());
		}

		if (currentMarket && !incrementalOrderBook()) {
			dispatch(depthFetch(currentMarket));
		}

		if (!connected) {
			dispatch(rangerConnectFetch({ withAuth: userLoggedIn }));
		}

		if (userLoggedIn && !withAuth) {
			dispatch(rangerConnectFetch({ withAuth: userLoggedIn }));
		}

		return () => {
			dispatch(setCurrentPrice(undefined));
		};
	}, []);

	React.useEffect(() => {
		localStorage.setItem('favourites_markets', JSON.stringify(favoriteKeyState));
	}, [favoriteKeyState.length]);

	React.useEffect(() => {
		if (userLoggedIn) {
			dispatch(rangerConnectFetch({ withAuth: userLoggedIn }));
		}
	}, [userLoggedIn]);

	React.useEffect(() => {
		setMarketFromUrlIfExists();
	}, [markets.length]);

	React.useEffect(() => {
		if (currentMarket) {
			const marketFromUrl = history.location.pathname.split('/');
			const marketNotMatched = currentMarket.id !== marketFromUrl[marketFromUrl.length - 1];
			if (marketNotMatched) {
				history.replace(`/market/${currentMarket.id}`);

				if (!incrementalOrderBook()) {
					dispatch(depthFetch(currentMarket));
				}
			}
		}
	}, [currentMarket]);

	React.useEffect(() => {
		if (currentMarket && tickers) {
			setTradingTitle(currentMarket);
		}
	}, [currentMarket, tickers]);

	// tslint:disable-next-line: no-shadowed-variable
	const setMarketFromUrlIfExists = (): void => {
		const urlMarket: string = getUrlPart(2, window.location.pathname);
		const market: Market | undefined = markets.find(item => item.id === urlMarket);

		if (market) {
			dispatch(setCurrentMarket(market));
		}
	};

	const setTradingTitle = (market: Market) => {
		const tickerPrice = tickers[market.id] ? tickers[market.id].last : '0.0';
		document.title = `${Decimal.formatRemoveZero(tickerPrice, market.price_precision)} ${market.name}`;
	};

	const searchFieldChangeHandler: React.InputHTMLAttributes<HTMLInputElement>['onChange'] = e => {
		setSearchFieldState(e.target.value);
	};

	const handleChangeRadio = (key: typeof radioSelectedState) => {
		if (key === radioSelectedState) {
			return;
		}
		setRadioSelectedState(key);
	};

	const renderSearch = () => {
		return (
			<SearchBlockStyle className="d-flex">
				<div className="search-wrapper w-50">
					<img className="search-icon" src={searchSvg} />
					<input
						className="search-input"
						type="text"
						placeholder={intl.formatMessage({ id: 'page.trading.marketTrading.search.placeholder' })}
						value={searchFieldState}
						onChange={searchFieldChangeHandler}
					/>
				</div>
				<div className="select-wrapper flex-fill d-flex align-items-center justify-content-center">
					<div
						className="select-item d-flex align-items-center justify-content-center h-100"
						onClick={() => handleChangeRadio('change')}
					>
						<i className={classnames({ active: radioSelectedState === 'change' })} />
						<label className="d-flex align-items-center mb-0 mr-2">
							{intl.formatMessage({ id: 'page.trading.marketTrading.search.change' })}
						</label>
					</div>
					<div
						className="select-item d-flex align-items-center justify-content-center h-100"
						onClick={() => handleChangeRadio('volume')}
					>
						<i className={classnames({ active: radioSelectedState === 'volume' })} />
						<label className="d-flex align-items-center mb-0">
							{intl.formatMessage({ id: 'page.trading.marketTrading.search.volume' })}
						</label>
					</div>
				</div>
			</SearchBlockStyle>
		);
	};

	const getData = () => {
		let data: Market[] = cloneDeep(markets);
		if (starSelectedState === 'ALL') {
			return data.filter(market => market.name.toLowerCase().includes(searchFieldState.toLowerCase()));
		}
		if (starSelectedState === 'FAVORITE') {
			data = data.filter(market => favoriteKeyState.includes(market.id));
		} else {
			const itemStart = STAR_LIST_INFO.find(item => item.key === starSelectedState);
			// tslint:disable-next-line: prefer-conditional-expression
			if (itemStart && itemStart.listKeyDropDown) {
				const searchDropDown = get(checkedDropdownState, `${starSelectedState}.childActiveKey`, '') as string;

				// tslint:disable-next-line: prefer-conditional-expression
				if (searchDropDown) {
					data = data.filter(market => market.name.split('/')[1] === searchDropDown);
				} else {
					data = data.filter(market => (itemStart.listKeyDropDown || []).includes(market.name.split('/')[1]));
				}
			} else {
				data = data.filter(market => market.name.toLowerCase().split('/')[1] === starSelectedState.toLowerCase());
			}
		}

		return data.filter(market => market.name.toLowerCase().includes(searchFieldState.toLowerCase()));
	};

	const handleSelectedStar = (key: string) => {
		if (starSelectedState !== key) {
			setStarSelectedState(key);
		}
	};

	const handleSelectFavorite = (id: string) => {
		if (favoriteKeyState.includes(id)) {
			setFavoriteKeyState(favoriteKeyState.filter(item => item !== id));
		} else {
			setFavoriteKeyState([...favoriteKeyState].concat([id]));
		}
	};

	const handleCheckDropdown = (key: string, chillKey: string) => {
		setCheckedDropdownState(prev => ({
			...prev,
			[key]: {
				childActiveKey: chillKey,
			},
		}));
	};

	const renderStarList = () => {
		return (
			<StarBlockStyle>
				{STAR_LIST_INFO.map((item, i) => {
					const { key } = item;
					const isFavorite = key === 'FAVORITE';

					const getContent = () => {
						if (item.listKeyDropDown) {
							const dropdownContentElm = (
								<div className="td-markets-trading-list-dropdown-wrapper">
									<div className="td-markets-trading-list-dropdown">
										<div
											className="td-markets-trading-list-dropdown__item"
											style={{ color: '#54B489' }}
											onClick={() => {
												handleCheckDropdown(key, '');
											}}
										>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
												<path
													d="M19.5 4.5h-15v2h15v-2zM19.5 17.5h-15v2h15v-2zM19.5 11h-15v2h15v-2z"
													fill="currentColor"
												></path>
											</svg>
											{intl.formatMessage({ id: 'page.trading.marketTrading.tab.other' })}
										</div>
										{item.listKeyDropDown.map((keyDropdown, j) => (
											<div
												className="td-markets-trading-list-dropdown__item"
												onClick={() => {
													handleCheckDropdown(key, keyDropdown);
												}}
												key={j}
											>
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
													<path fill="currentColor" d="M4 11h16v2H4z"></path>
												</svg>
												<span>{keyDropdown}</span>
											</div>
										))}
									</div>
								</div>
							);

							return (
								<React.Fragment>
									{get(checkedDropdownState, `${key}.childActiveKey`, null) ||
										intl.formatMessage({ id: 'page.trading.marketTrading.tab.other' })}{' '}
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
										<path d="M16 9v1.2L12 15l-4-4.8V9h8z"></path>
									</svg>
									{dropdownContentElm}
								</React.Fragment>
							);
						}

						return key === 'ALL' ? intl.formatMessage({ id: 'page.trading.marketTrading.tab.all' }) : key;
					};

					return (
						<button
							className={classnames({
								active: starSelectedState === key,
								favorite: isFavorite,
							})}
							onClick={() => handleSelectedStar(key)}
							key={i}
						>
							{isFavorite ? <MarketTradingSvg /> : getContent()}
						</button>
					);
				})}
			</StarBlockStyle>
		);
	};

	const dataTable = getData();

	return (
		<MarketTradingStyle>
			{renderStarList()}
			{renderSearch()}
			<MarketsListTrading
				listFavoriteKey={favoriteKeyState}
				onSelectFavorite={handleSelectFavorite}
				type={radioSelectedState}
				data={dataTable}
			/>
		</MarketTradingStyle>
	);
};

export const MarketTrading = MarketTradingContainer;
