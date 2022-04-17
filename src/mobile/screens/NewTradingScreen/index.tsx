import { useDepthFetch, useMarketsFetch, useMarketsTickersFetch, useRangerConnectFetch } from 'hooks';
import { selectCurrentMarket } from 'modules';
import * as React from 'react';
import isEqual from 'react-fast-compare';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { NewCurrentMarketInfo } from '../../components';

const TradingComponent: React.FC = () => {
	const history = useHistory();
	const params = useParams<{
		market: string;
	}>();
	useMarketsFetch();
	useMarketsTickersFetch();
	useRangerConnectFetch();
	useDepthFetch();

	const market = useSelector(selectCurrentMarket, isEqual);

	React.useEffect(() => {
		if (!params.market) {
			if (market && params.market !== market.id) {
				history.push(`/market/${market.id}`);
			}
		}
	}, [market]);

	return (
		<div className="td-mobile-screen-trading">
			<div className="td-mobile-screen-trading__main-content">
				<NewCurrentMarketInfo />
			</div>
		</div>
	);
};

export const NewTradingScreenMobile = React.memo(TradingComponent, isEqual);
