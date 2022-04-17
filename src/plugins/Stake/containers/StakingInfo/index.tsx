import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
	Market,
	marketsFetch,
	selectCurrencies,
	selectMarkets,
	selectStakeHistoriesLoading,
	setCurrentMarket,
} from '../../../../modules';
import { LoadingSpinner } from '../../components';

interface StakingInfoProps {
	currency_id: string;
	staking_name: string;
	description?: string;
	ref_link?: string;
}

export const StakingInfo: React.FC<StakingInfoProps> = (props: StakingInfoProps) => {
	const intl = useIntl();
	const { staking_name, description, currency_id, ref_link } = props;
	const currencies = useSelector(selectCurrencies);
	const getCryptoIcon = (currencyID: string): string => {
		const currency = currencies.find((cur: any) => cur.id === currencyID);
		try {
			return require(`../../../../../node_modules/cryptocurrency-icons/128/color/${currencyID.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}

			return require('../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};
	const markets = useSelector(selectMarkets);
	const dispatch = useDispatch();
	const history = useHistory();
	const dispatchFetchMarkets = () => dispatch(marketsFetch());
	React.useEffect(() => {
		dispatchFetchMarkets();
	}, []);

	const handleRedirectToTrading = (id: string) => {
		const currentMarket: Market | undefined = markets.find(item => item.base_unit === id);
		if (currentMarket) {
			dispatch(setCurrentMarket(currentMarket));
			history.push({ pathname: `/market/${currentMarket.id}` });
		}
	};

	const isLoadingStakingList = useSelector(selectStakeHistoriesLoading);

	return (
		<div id="staking-info">
			<div className="row">
				<div id="event" className="col-10 d-flex flex-row">
					<div className="event-image">
						<img src={getCryptoIcon(currency_id)} alt={currency_id} />
					</div>
					<div className="event-info">
						<span className="event-info__name">{staking_name}</span>
						<span className="event-info__description">{description}</span>
					</div>
				</div>
				<div className="col-2 buttons">
					<button className="trade-btn" onClick={() => handleRedirectToTrading(currency_id.toLowerCase())}>
						{intl.formatMessage({ id: `stake.detail.info.button.trade` })} {currency_id.toUpperCase()}
					</button>
					<a rel="noopener noreferrer" target="_blank" href={ref_link} className="view-detail-btn btn">
						{intl.formatMessage({ id: `stake.detail.info.button.detail` })}
					</a>
				</div>
			</div>
			<LoadingSpinner loading={isLoadingStakingList} />
		</div>
	);
};
