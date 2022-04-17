import { Dropdown, Empty, Menu } from 'antd';
import classNames from 'classnames';
import { NewTabPanel } from 'components';
import { TabPane } from 'rc-tabs';
import React, { useEffect, useState } from 'react';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Market, selectMarkets, selectMarketsLoading, selectMarketTickers, Ticker } from '../../../modules/public/markets';
import { LoadingMobile } from '../Loading';
import { MarketList } from '../NewMarketsList';
import { PaginationMobile } from '../Pagination';

const MAX_ELEMENT = 5;

const DEFAULT_TICKER: Ticker = {
	amount: '0.0',
	last: '0.0',
	high: '0.0',
	open: '0.0',
	low: '0.0',
	price_change_percent: '+0.00%',
	volume: '0.0',
	avg_price: '0',
};

const DEFAULT_SORT = { pairs: false, price: false, change: false };

const DEFAULT_MAXPAGE = 1;

const DEFAULT_PAGEINDEX = 1;

let DEFAULT_TAB = 'ALL';

const LIST_TAB = ['USDT', 'BTC', 'ETH', 'BNB', 'ATRON','BUSD', 'TUSD', 'USDC'];

interface AllMarketListProp {
	valueSearch?: string;
	setValueSearch?: (value: string) => void;
	pagination?: boolean;
	hideFavorite?: boolean;
	hideAll?: boolean;
}

// tslint:disable-next-line: no-empty
export const NewAllMarketList: React.FC<AllMarketListProp> = ({
	valueSearch = '',
	// tslint:disable-next-line: no-empty
	setValueSearch = () => {},
	pagination = true,
	hideFavorite,
	hideAll,
}) => {
	const intl = useIntl();
	const markets = useSelector(selectMarkets);
	const isLoading = useSelector(selectMarketsLoading);
	const tickers = useSelector(selectMarketTickers);
	const DEFAULT_LIST_TAB = (!hideFavorite ? ['Favorite'] : []).concat(hideAll ? LIST_TAB : ['ALL'].concat(LIST_TAB));

	const otherKeyName = intl.formatMessage({ id: 'page.trading.marketTrading.tab.other' });
	DEFAULT_TAB = hideAll ? 'USDT' : 'ALL';

	const [listTab, setListTab] = useState(DEFAULT_LIST_TAB);
	const [tab, setTab] = useState(DEFAULT_TAB);
	const [listMarket, setListMarket] = useState(markets);
	const [maxPage, setMaxPage] = useState(DEFAULT_MAXPAGE);
	const [pageIndex, setPageIndex] = useState(DEFAULT_PAGEINDEX);
	const [sortBy, setSortBy] = useState(DEFAULT_SORT);
	const [isSort, setIsSort] = useState(DEFAULT_SORT);
	const favoritemMarketsLocal = JSON.parse(localStorage.getItem('favourites_markets') || '[]');
	const [otherActiveKey, setOtherActiveKey] = useState(otherKeyName);

	const listTabNormal = listTab.slice(0, 4);
	const listTabOther = listTab.slice(4);

	useEffect(() => {
		if (markets.length > 0) {
			setListTab(DEFAULT_LIST_TAB);
			let listMarketTamp = pagination ? markets.slice(0, MAX_ELEMENT) : markets;
			listMarketTamp = sortForAZ(listMarketTamp, false);
			listMarketTamp = listMarketTamp.filter(e => true);
			setListMarket(listMarketTamp);
			setMaxPage(Math.ceil(markets.length / MAX_ELEMENT));
		}
	}, [markets]);

	const filterTab = () =>
		markets.filter(e => {
			switch (tab) {
				case 'ALTS':
					return (
						e.quote_unit !== DEFAULT_LIST_TAB[1].toLowerCase() &&
						e.quote_unit !== DEFAULT_LIST_TAB[2].toLowerCase() &&
						e.quote_unit !== DEFAULT_LIST_TAB[3].toLowerCase()
					);
				case 'Favorite':
					return favoritemMarketsLocal.includes(e.id);
				case 'ALL':
					return true;
				case otherKeyName:
					return e.quote_unit === otherActiveKey.toLowerCase();
				default:
					return e.quote_unit === tab.toLowerCase();
			}
		});

	useEffect(() => {
		if (tab !== '') {
			if (valueSearch !== '') {
				setValueSearch('');
			}

			let listMarketTamp = filterTab();
			listMarketTamp = sortForAZ(listMarketTamp, false);
			setPageIndex(DEFAULT_PAGEINDEX);
			setMaxPage(Math.ceil(listMarketTamp.length / MAX_ELEMENT));
			listMarketTamp = pagination ? listMarketTamp.slice(0, MAX_ELEMENT) : listMarketTamp;
			setListMarket(listMarketTamp);
			setIsSort(DEFAULT_SORT);
		}
	}, [tab]);

	useEffect(() => {
		let listMarketTamp;
		listMarketTamp = filterTab();
		if (valueSearch !== '') {
			// tslint:disable-next-line: prefer-conditional-expression
			if (valueSearch.search('/') > 0) {
				listMarketTamp = listMarketTamp.filter(e => e.name.includes(valueSearch.toUpperCase()));
			} else {
				listMarketTamp = listMarketTamp.filter(e => e.name.split('/')[0].includes(valueSearch.toUpperCase()));
			}
			setIsSort(DEFAULT_SORT);
		}
		setListMarket(listMarketTamp);
	}, [valueSearch]);

	const onChangeFavorite = () => {
		if (tab === 'Favorite') {
			const favoritemMarketsLocalTmp = JSON.parse(localStorage.getItem('favourites_markets') || '[]');

			let listMarketTamp = markets.filter(e => {
				return favoritemMarketsLocalTmp.includes(e.id);
			});
			listMarketTamp = sortForAZ(listMarketTamp, false);
			setPageIndex(DEFAULT_PAGEINDEX);
			setMaxPage(Math.ceil(listMarketTamp.length / MAX_ELEMENT));
			listMarketTamp = pagination ? listMarketTamp.slice(0, MAX_ELEMENT) : listMarketTamp;
			setListMarket(listMarketTamp);
			setIsSort(DEFAULT_SORT);
		}
	};

	const onChangeTab = (nameTab: string) => {
		if (tab !== nameTab) {
			if (nameTab !== otherKeyName) {
				setTab(nameTab);
				if (otherActiveKey !== otherKeyName) {
					setOtherActiveKey(otherKeyName);
				}
			}
		}
	};

	const sortForAZ = (listMarketTamp: Market[], upOrDown: boolean) => {
		return listMarketTamp.sort((a, b) => {
			const textA = a.name.charAt(0);
			const textB = b.name.charAt(0);
			if (upOrDown) {
				return textA > textB ? -1 : textA < textB ? 1 : 0;
			} else {
				return textA < textB ? -1 : textA > textB ? 1 : 0;
			}
		});
	};

	const onSort = (typeSort: string) => {
		let listMarketTamp = listMarket;
		switch (typeSort) {
			case 'Pairs':
				if (!isSort.pairs) {
					setIsSort({ pairs: true, price: false, change: false });
				}
				// tslint:disable-next-line: prefer-conditional-expression
				if (sortBy.pairs) {
					listMarketTamp = sortForAZ(listMarketTamp, sortBy.pairs);
				} else {
					listMarketTamp = sortForAZ(listMarketTamp, sortBy.pairs);
				}

				setSortBy({ ...DEFAULT_SORT, pairs: !sortBy.pairs });

				break;
			case 'Last  Price':
				if (!isSort.price) {
					setIsSort({ pairs: false, price: true, change: false });
				}
				if (sortBy.price) {
					listMarketTamp.sort((a, b) => {
						const priceA = tickers[a.id] || DEFAULT_TICKER;
						const PriceB = tickers[b.id] || DEFAULT_TICKER;

						return Number(priceA.last) - Number(PriceB.last);
					});
				} else {
					listMarketTamp.sort((a, b) => {
						const priceA = tickers[a.id] || DEFAULT_TICKER;
						const PriceB = tickers[b.id] || DEFAULT_TICKER;

						return Number(PriceB.last) - Number(priceA.last);
					});
				}

				setSortBy({ ...DEFAULT_SORT, price: !sortBy.price });

				break;
			case 'Change':
				if (!isSort.change) {
					setIsSort({ pairs: false, price: false, change: true });
				}
				if (sortBy.change) {
					listMarketTamp.sort((a, b) => {
						const priceA = tickers[a.id] || DEFAULT_TICKER;
						const priceB = tickers[b.id] || DEFAULT_TICKER;

						return (
							Number(priceA.price_change_percent.replace(/[+%]/g, '')) -
							Number(priceB.price_change_percent.replace(/[+%]/g, ''))
						);
					});
				} else {
					listMarketTamp.sort((a, b) => {
						const priceA = tickers[a.id] || DEFAULT_TICKER;
						const priceB = tickers[b.id] || DEFAULT_TICKER;

						return (
							Number(priceB.price_change_percent.replace(/[+%]/g, '')) -
							Number(priceA.price_change_percent.replace(/[+%]/g, ''))
						);
					});
				}
				setSortBy({ ...DEFAULT_SORT, change: !sortBy.change });
				break;

			default:
				break;
		}

		setListMarket(listMarketTamp);
	};

	const renderTab = () => {
		const dropdownTab = (
			<Menu style={{ background: 'var(--secondary-background-color)' }}>
				{listTabOther.map(name => (
					<Menu.Item
						style={{
							backgroundColor: tab === otherKeyName ? 'rgba(255, 255, 255, 0.08)' : undefined,
						}}
						key={name}
						onClick={() => {
							setTab(otherKeyName);
							setOtherActiveKey(name);
						}}
					>
						{name}
					</Menu.Item>
				))}
			</Menu>
		);

		const convertNameTabByI18n = (name: string) => {
			switch (name) {
				case 'ALL':
					return intl.formatMessage({ id: 'page.trading.marketTrading.tab.all' });
					break;

				case 'Favorite':
					return intl.formatMessage({ id: 'page.trading.marketTrading.tab.favorite' });
					break;

				default:
					return name;
					break;
			}
		};

		return (
			<NewTabPanel activeKey={tab} onChange={onChangeTab}>
				{listTabNormal.map(name => (
					<TabPane key={name} tab={convertNameTabByI18n(name)}>
						{renderTable()}
					</TabPane>
				))}
				<TabPane
					key={otherKeyName}
					tab={
						<Dropdown placement="bottomRight" overlay={dropdownTab} trigger={['click']}>
							<span>
								{otherActiveKey}{' '}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill={tab === otherKeyName ? '#FFF' : 'var(--muted-background-color)'}
									width="22"
									height="22"
									viewBox="0 0 24 24"
								>
									<path d="M16 9v1.2L12 15l-4-4.8V9h8z"></path>
								</svg>
							</span>
						</Dropdown>
					}
				>
					{renderTable()}
				</TabPane>
			</NewTabPanel>
		);
	};

	const renderHeaderTable = () => {
		const nameByI18n = (name: string) => {
			switch (name) {
				case 'Pairs':
					return intl.formatMessage({ id: 'page.mobile.listMarkets.pairs' });
					break;

				case 'Last  Price':
					return intl.formatMessage({ id: 'page.mobile.listMarkets.lastPrice' });
					break;
				case 'Change':
					return intl.formatMessage({ id: 'page.mobile.listMarkets.change' });
					break;

				default:
					return '';
					break;
			}
		};
		const listHeader = ['Pairs', 'Last  Price', 'Change'];
		const renderUiHeader = listHeader.map((name, i) => {
			let classActiveUpDown = 'd-flex flex-column justify-content-center td-mobile-cpn-all-market__body__info__item__icon';

			switch (name) {
				case 'Pairs':
					if (isSort.pairs) {
						classActiveUpDown = classNames(
							'd-flex flex-column justify-content-center td-mobile-cpn-all-market__body__info__item__icon',
							{ 'td-mobile-cpn-all-market__body__info__item__icon--active-up': sortBy.pairs },
							{ 'td-mobile-cpn-all-market__body__info__item__icon--active-down': !sortBy.pairs },
						);
					}
					break;
				case 'Last  Price':
					if (isSort.price) {
						classActiveUpDown = classNames(
							'd-flex flex-column justify-content-center td-mobile-cpn-all-market__body__info__item__icon',
							{ 'td-mobile-cpn-all-market__body__info__item__icon--active-up': !sortBy.price },
							{ 'td-mobile-cpn-all-market__body__info__item__icon--active-down': sortBy.price },
						);
					}
					break;
				case 'Change':
					if (isSort.change) {
						classActiveUpDown = classNames(
							'd-flex flex-column justify-content-center td-mobile-cpn-all-market__body__info__item__icon',
							{ 'td-mobile-cpn-all-market__body__info__item__icon--active-up': !sortBy.change },
							{ 'td-mobile-cpn-all-market__body__info__item__icon--active-down': sortBy.change },
						);
					}
					break;
				default:
					break;
			}

			return (
				<th key={i}>
					<div
						className={classNames('td-mobile-cpn-all-market__body__info d-flex', { 'justify-content-end': i !== 0 })}
					>
						<div className="d-flex" onClick={() => onSort(name)}>
							<div className="td-mobile-cpn-all-market__body__info__item ">{nameByI18n(name)}</div>
							<div className={classActiveUpDown}>
								<FaSortUp />
								<FaSortDown />
							</div>
						</div>
					</div>
				</th>
			);
		});

		return <tr>{renderUiHeader}</tr>;
	};

	const renderTable = () => {
		return (
			<MarketList
				listMarket={listMarket}
				isShowTHead={true}
				childOfTHead={renderHeaderTable()}
				onchangeFavorite={onChangeFavorite}
				hideFavorite={hideFavorite}
			/>
		);
	};

	const goToPgae = (page: number) => {
		const indexElemStart = (page - 1) * MAX_ELEMENT;
		const indexElemStop = indexElemStart + MAX_ELEMENT;
		const listMarketTamp = pagination ? markets.slice(indexElemStart, indexElemStop) : markets;
		setListMarket(listMarketTamp);
		setPageIndex(page);
		setIsSort(DEFAULT_SORT);
	};

	const renderPagination = () => {
		if (listMarket.length === 0 && isLoading) {
			return <LoadingMobile />;
		}

		return listMarket.length === 0 ? (
			<Empty />
		) : (
			<PaginationMobile forcePage={pageIndex - 1} toPage={goToPgae} pageCount={maxPage} />
		);
	};

	return (
		<div className="td-mobile-cpn-all-market__body">
			<div className="td-mobile-cpn-all-market__body__wrapper">{renderTab()}</div>
			{pagination ? renderPagination() : undefined}
		</div>
	);
};
