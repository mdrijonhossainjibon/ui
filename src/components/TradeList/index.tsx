import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Market, marketsFetch, selectMarkets, setCurrentMarket } from '../../modules';

interface TradeListProps {
	currency_id: string;
}

export const TradeList: React.FC<TradeListProps> = (props: TradeListProps) => {
	const { currency_id } = props;

	const markets = useSelector(selectMarkets);
	const dispatch = useDispatch();
	const history = useHistory();
	const dispatchFetchMarkets = React.useCallback(() => dispatch(marketsFetch()), [dispatch]);
	React.useEffect(() => {
		dispatchFetchMarkets();
	}, [dispatchFetchMarkets]);

	const handleRedirectToTrading = (id: string) => {
		const currentMarket: Market | undefined = markets.find(item => item.id === id);

		if (currentMarket) {
			dispatch(setCurrentMarket(currentMarket));
			history.push(`/market/${currentMarket.id}`);
		}
	};

	return (
		<div>
			{markets
				.filter(market => market.base_unit.toLowerCase() === currency_id.toLowerCase())
				.map(market => (
					<span
						key={market.id}
						style={{ color: '#fff', marginRight: '1rem', borderBottom: '1px solid #fff', cursor: 'pointer' }}
						onClick={() => handleRedirectToTrading(market.id)}
					>
						{market.name}
					</span>
				))}
		</div>
	);
};
