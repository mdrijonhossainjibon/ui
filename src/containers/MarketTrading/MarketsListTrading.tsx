import { incrementalOrderBook } from 'api';
import { SortAsc, SortDefault, SortDesc } from 'assets/images/SortIcons';
import { MarketTradingSvg } from 'assets/images/trading/MarketTradingSvg';
import classnames from 'classnames';
import { Decimal, TableTrading } from 'components';
import find from 'lodash/find';
import { depthFetch, Market, selectCurrentMarket, selectMarketTickers, setCurrentMarket, setCurrentPrice } from 'modules';
import * as React from 'react';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MarketsListTradingStyle } from './styles';

interface MarketsListTradingComponentProps {
	data: Market[];
	type: 'change' | 'volume';
	onSelectFavorite: (id: string) => void;
	listFavoriteKey: string[];
}

const handleChangeSortIcon = (sortBy: string, id: string, reverseOrder: boolean) => {
	if (sortBy !== 'none' && id === sortBy && !reverseOrder) {
		return <SortDesc />;
	}

	if (sortBy !== 'none' && id === sortBy && reverseOrder) {
		return <SortAsc />;
	}

	return <SortDefault />;
};

const MarketsListTradingComponent: React.FC<MarketsListTradingComponentProps> = props => {
	const history = useHistory();
	const dispatch = useDispatch();
	const intl = useIntl();

	const [sortByState, setSortByState] = React.useState<string>('none');
	const [isHoverFavorite, setIsHoverFavorite] = React.useState<boolean>(false);
	const [reverseOrderState, setReverseOrderState] = React.useState<boolean>(false);

	const currentMarket = useSelector(selectCurrentMarket, isEqual);
	const marketTickers = useSelector(selectMarketTickers, isEqual);

	const currencyPairSelectHandler = (key: string) => {
		const marketToSet = props.data.find(market => market.name === key);

		dispatch(setCurrentPrice(0));
		if (marketToSet) {
			dispatch(setCurrentMarket(marketToSet));
			if (!incrementalOrderBook()) {
				dispatch(depthFetch(marketToSet));
			}
			history.push(`/market/${marketToSet.id}`);
		}
	};

	const getHeaders = () => {
		const header = [
			{ id: 'id', translationKey: 'market' },
			{ id: 'last', translationKey: 'last_price' },
			props.type === 'change'
				? { id: 'price_change_percent_num', translationKey: 'change' }
				: { id: 'volume', translationKey: 'volume' },
		]
			.map(obj => {
				return {
					...obj,
					selected: sortByState === obj.id,
					reversed: sortByState === obj.id && reverseOrderState,
				};
			})
			.map(obj => {
				const classname = classnames({
					'td-markets-trading-list-container__header-selected': obj.selected,
				});

				return (
					<span className={classname} key={obj.id} onClick={() => handleHeaderClick(obj.id)}>
						{intl.formatMessage({ id: `page.body.trade.header.markets.content.${obj.translationKey}` })}
						<span className="sort-icon">{handleChangeSortIcon(sortByState, obj.id, reverseOrderState)}</span>
					</span>
				);
			});

		// custom rowKeyTable
		header.push(<></>);

		return header;
	};

	const handleHoverFavorite = (isHover: boolean) => {
		setIsHoverFavorite(isHover);
	};

	const mapMarkets = () => {
		const defaultTicker = {
			last: 0,
			volume: 0,
			price_change_percent: '+0.00%',
		};

		const marketsMapped = props.data.map((market: Market) => {
			return {
				...market,
				last: (marketTickers[market.id] || defaultTicker).last,
				volume: (marketTickers[market.id] || defaultTicker).volume,
				price_change_percent: (marketTickers[market.id] || defaultTicker).price_change_percent,
				price_change_percent_num: Number.parseFloat((marketTickers[market.id] || defaultTicker).price_change_percent),
			};
		});

		if (sortByState !== 'none') {
			marketsMapped.sort((a, b) => (a[sortByState] > b[sortByState] ? 1 : b[sortByState] > a[sortByState] ? -1 : 0));
		}

		reverseOrderState && marketsMapped.reverse();

		return marketsMapped.map(market => {
			const isPositive = /\+/.test((marketTickers[market.id] || defaultTicker).price_change_percent);
			const classname = classnames({
				'td-markets-trading-list-container__positive': isPositive,
				'td-markets-trading-list-container__negative': !isPositive,
			});

			return [
				<span>
					<MarketTradingSvg
						active={props.listFavoriteKey.includes(market.id)}
						className="favorite"
						onMouseEnter={() => handleHoverFavorite(true)}
						onMouseLeave={() => handleHoverFavorite(false)}
						onClick={() => props.onSelectFavorite(market.id)}
					/>
					<span className="ml-2">{market.name}</span>
				</span>,
				<span className={classname}>{Decimal.formatRemoveZero(Number(market.last), market.price_precision)}</span>,
				props.type === 'change' ? (
					<span className={classname}>{market.price_change_percent}</span>
				) : (
					<span className={classname}>{Decimal.formatRemoveZero(Number(market.volume), market.amount_precision)}</span>
				),
				market.name,
			];
		});
	};

	const handleHeaderClick = (key: string) => {
		if (key !== sortByState) {
			setSortByState(key);
			setReverseOrderState(false);
		} else if (key === sortByState && !reverseOrderState) {
			setReverseOrderState(true);
		} else {
			setSortByState('none');
			setReverseOrderState(false);
		}
	};

	const dataTable = mapMarkets();
	const selectedObject = find(props.data, market => (currentMarket && currentMarket.name === market.name ? true : false));

	return (
		<MarketsListTradingStyle>
			<div className="td-markets-trading-list-container">
				<TableTrading
					data={dataTable.length > 0 ? dataTable : [[]]}
					header={getHeaders()}
					onSelect={isHoverFavorite ? undefined : currencyPairSelectHandler}
					selectedKey={selectedObject === undefined ? undefined : selectedObject.name}
					rowKeyIndex={3}
				/>
			</div>
		</MarketsListTradingStyle>
	);
};

export const MarketsListTrading = MarketsListTradingComponent;
