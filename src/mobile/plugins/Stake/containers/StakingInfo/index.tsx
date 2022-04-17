import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
	Currency,
	Market,
	marketsFetch,
	selectCurrencies,
	selectMarkets,
	selectStakeHistoriesLoading,
	setCurrentMarket,
} from '../../../../../modules';
import { LoadingSpinner } from '../../components';

interface StakingInfoProps {
	currency_id: string;
	staking_name: string;
	description?: string;
	logo_image?: string;
	ref_link?: string;
}

export const StakingInfo: React.FC<StakingInfoProps> = (props: StakingInfoProps) => {
	const intl = useIntl();
	const { staking_name, description, currency_id, ref_link } = props;
	const currencies = useSelector(selectCurrencies);
	const getCryptoIcon = (currencyID: string): string => {
		const currency = currencies.find((cur: Currency) => cur.id === currencyID);
		try {
			return require(`../../../../../../node_modules/cryptocurrency-icons/128/color/${currencyID.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}

			return require('../../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};
	const markets = useSelector(selectMarkets);
	const dispatch = useDispatch();
	const history = useHistory();
	const dispatchFetchMarkets = React.useCallback(() => dispatch(marketsFetch()), [dispatch]);
	React.useEffect(() => {
		dispatchFetchMarkets();
	}, [dispatchFetchMarkets]);

	const handleRedirectToTrading = (id: string) => {
		const currentMarket: Market | undefined = markets.find(item => item.base_unit === id);
		if (currentMarket) {
			dispatch(setCurrentMarket(currentMarket));
			history.push({ pathname: `/trading/${currentMarket.id}` });
		}
	};

	const isLoadingStakingList = useSelector(selectStakeHistoriesLoading);

	return (
		<div className="td-mobile-staking-info">
			<div className="td-mobile-staking-info__content">
				<div className="td-mobile-staking-info__content__image">
					<img src={getCryptoIcon(currency_id)} alt={currency_id} />
				</div>
				<div className="td-mobile-staking-info__content__text">
					<span className="td-mobile-staking-info__content__text__name">{staking_name}</span>
					<span className="td-mobile-staking-info__content__text__description">{description}</span>
				</div>
			</div>
			<div className="td-mobile-staking-info__buttons">
				<button
					className="td-mobile-staking-info__buttons__trade"
					onClick={() => handleRedirectToTrading(currency_id.toLowerCase())}
				>
					{intl.formatMessage({ id: `stake.detail.info.button.trade` })} {currency_id.toUpperCase()}
				</button>
				<a
					rel="noopener noreferrer"
					target="_blank"
					href={ref_link}
					className="td-mobile-staking-info__buttons__view-detail"
				>
					{intl.formatMessage({ id: `stake.detail.info.button.detail` })}
				</a>
			</div>
			<LoadingSpinner loading={isLoadingStakingList} />
		</div>
	);
};
