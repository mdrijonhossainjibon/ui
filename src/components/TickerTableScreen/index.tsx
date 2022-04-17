import { Button, Input } from 'antd';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { Pagination } from '../';
import { Decimal } from '../../components';
import { Market } from '../../modules';
import './ticker.css';

interface Props {
	currentBidUnit: string;
	currentBidUnitsList: string[];
	markets: Market[];
	redirectToTrading: (key: string) => void;
	setCurrentBidUnit: (key: string) => void;
}

export const TickerTableScreen = (props: Props) => {
	const { currentBidUnit, markets } = props;
	const intl = useIntl();

	const [searchMarketInputState, setSearchMarketInputState] = React.useState('');
	const [paginationState, setPaginationState] = React.useState({
		current: 1,
		pageSize: 15,
		total: 0,
	});

	const renderHeader = () => (
		<ul className="navigation" role="tablist">
			{props.currentBidUnitsList.map((item, i) => (
				<li
					key={i}
					className={`navigation__item ${item === currentBidUnit && 'navigation__item--active'}`}
					onClick={() => props.setCurrentBidUnit(item)}
				>
					<span className="navigation__item__link">
						{item ? item.toUpperCase() : intl.formatMessage({ id: 'page.body.marketsTable.filter.all' })}
					</span>
				</li>
			))}
			<div className="home-page__markets-top-block" style={{ marginLeft: 764 }}>
				<Input placeholder="Enter coin to search..." onChange={handldeSearchInputChange} />
			</div>
		</ul>
	);
	const handldeSearchInputChange = (e: any) => {
		props.setCurrentBidUnit('');
		setSearchMarketInputState(e.target.value);
	};

	React.useEffect(() => {
		if (markets) {
			setPaginationState(prev => ({
				...prev,
				total: markets.length,
			}));
		}
	}, [markets.length, markets]);

	const handleGetStartPointPagination = React.useCallback((): number => {
		const start = paginationState.pageSize * paginationState.current - paginationState.pageSize;

		return start;
	}, [paginationState]);

	React.useEffect(() => {
		handleGetStartPointPagination();
	}, [paginationState, handleGetStartPointPagination]);

	const renderPagination = () => {
		const { current, pageSize, total } = paginationState;

		return (
			<Pagination
				onClickToPage={onClickToPage}
				page={current}
				onClickNextPage={onClickNextPage}
				onClickPrevPage={onClickPrevPage}
				firstElemIndex={1}
				lastElemIndex={Math.ceil(total / pageSize)}
			/>
		);
	};
	const onClickPrevPage = () => {
		setPaginationState(prev => ({
			...prev,
			current: prev.current - 1,
		}));
	};
	const onClickNextPage = () => {
		setPaginationState(prev => ({
			...prev,
			current: prev.current + 1,
		}));
	};
	const onClickToPage = (value: number) => {
		setPaginationState(prev => ({
			...prev,
			current: value,
		}));
	};

	const renderItem = (market, index: number) => {
		const marketChangeColor = +(market.change || 0) < 0 ? 'negative' : 'positive';
		const decima = 4;

		return (
			<tr key={index} onClick={() => props.redirectToTrading(market.id)}>
				<td>
					<div>{market && market.name}</div>
				</td>
				<td>
					<span className={marketChangeColor}>
						<Decimal fixed={market.price_precision} thousSep=",">
							{market.last}
						</Decimal>
					</span>
				</td>
				<td>
					<span className={marketChangeColor}>{market.price_change_percent}</span>
				</td>
				<td>
					<span>
						<Decimal fixed={market.price_precision} thousSep=",">
							{market.high}
						</Decimal>
					</span>
				</td>
				<td>
					<span>
						<Decimal fixed={market.price_precision} thousSep=",">
							{market.low}
						</Decimal>
					</span>
				</td>
				<td>
					<span className={marketChangeColor}>
						<Decimal fixed={decima} thousSep=",">
							{market.volume}
						</Decimal>
					</span>
				</td>
				<td>
					<Button
						type="primary"
						size="small"
						style={{ marginRight: 0, fontSize: 14 }}
						onClick={() => props.redirectToTrading(market.id)}
					>
						Trade
					</Button>
				</td>
			</tr>
		);
	};

	return (
		<div className="pg-ticker-table">
			<div className="pg-ticker-table__filter">{renderHeader()}</div>
			<div className="pg-ticker-table__table-wrap">
				<table className="pg-ticker-table__table">
					<thead>
						<tr>
							<th scope="col">{intl.formatMessage({ id: 'page.body.marketsTable.header.pair' })}</th>
							<th scope="col">{intl.formatMessage({ id: 'page.body.marketsTable.header.lastPrice' })}</th>
							<th scope="col">{intl.formatMessage({ id: 'page.body.marketsTable.header.change' })}</th>
							<th scope="col">{intl.formatMessage({ id: 'page.body.marketsTable.header.high' })}</th>
							<th scope="col">{intl.formatMessage({ id: 'page.body.marketsTable.header.low' })}</th>
							<th scope="col">{intl.formatMessage({ id: 'page.body.marketsTable.header.volume' })}</th>
							<th scope="col">Markets</th>
						</tr>
					</thead>
					<tbody>
						{markets ? (
							markets
								.slice(
									handleGetStartPointPagination(),
									handleGetStartPointPagination() + paginationState.pageSize,
								)
								.filter(
									market =>
										market.base_unit.includes(searchMarketInputState) ||
										market.quote_unit.includes(searchMarketInputState),
								)
								.map(renderItem)
						) : (
							<tr>
								<td>
									<span className="no-data">{intl.formatMessage({ id: 'page.noDataToShow' })}</span>
								</td>
							</tr>
						)}
					</tbody>
				</table>
				<div className="pg-ticker-table__pagination">{renderPagination()}</div>
			</div>
		</div>
	);
};
