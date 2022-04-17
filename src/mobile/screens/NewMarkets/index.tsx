import React from 'react';
import { useMarketsFetch, useMarketsTickersFetch, useRangerConnectFetch } from '../../../hooks';
import { Markets } from './Markets';

const NewMarketsComponent = () => {
	useMarketsFetch();
	useMarketsTickersFetch();
	useRangerConnectFetch();

	return <Markets />;
};

export const NewMarketsScreenMobile = React.memo(NewMarketsComponent);
