import { format } from 'date-fns';
import { toLower, toUpper, upperCase } from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { currenciesFetch, NewCompetition, selectCompetitionList, selectCurrencies, selectWallets } from '../../../../../modules';
import banner from './img/banner.png';
import classnames from 'classnames';
export const CompetitionItemNoneRunning: React.FC<NewCompetition> = props => {
	const { end_date, type, currency_id, total_prize, start_date, id } = props;
	const dispatch = useDispatch();
	// selectors
	const wallets = useSelector(selectWallets);
	const wallet = wallets.find(wallet => toLower(wallet.currency) === toLower(currency_id));
	const currencies = useSelector(selectCurrencies);
	const competitions = useSelector(selectCompetitionList);
	const history = useHistory();
	const forwardToDetail = () => {
		const competition = competitions.payload.find(competition => competition.id === id);
		if (competition && competition.status !== 'upcoming') {
			const location = {
				pathname: `/competition/${id}`,
			};
			history.push(location);
		}
	};
	React.useEffect(() => {
		dispatch(currenciesFetch());
	}, []);
	const getCryptoIcon = React.useCallback(
		(currencyID: string): string => {
			const currency = currencies.find((cur: any) => cur.id === currencyID.toLowerCase());
			try {
				return require(`../../../../../../node_modules/cryptocurrency-icons/128/color/${currencyID.toLowerCase()}.png`);
			} catch (err) {
				if (currency) {
					return currency.icon_url;
				}
				return require('../../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
			}
		},
		[currency_id],
	);
	const durationCompetition = `${format(new Date(start_date), 'MMM dd')} - ${format(new Date(end_date), 'MMM dd')}`;
	const typeCompetitionClassNames = (() => {
		switch (type) {
			case 'stake':
				return classnames('type--stake');
			case 'trade':
				return classnames('type--trade');
			case 'deposit':
				return classnames('type--deposit');
		}
	})();
	return (
		<div id="mobile-competition-item-none-running" style={{ backgroundImage: `url(${banner})` }} onClick={forwardToDetail}>
			<div className="mobile-competition-item__header">
				<div className="w-100">
					<div className={`mobile-competition-item__header__type ${typeCompetitionClassNames}`}>{upperCase(type)}</div>
				</div>
			</div>
			<div className="d-flex col-12">
				<div className="mobile-competition-item__content col-8">
					<div className="mobile-competition-item__content__info">
						<div className="mobile-competition-item__content__info__currency">{toUpper(currency_id)}</div>
						<div className="mobile-competition-item__content__info__date">{durationCompetition}</div>
						<div className="mobile-competition-item__content__info__prize">
							<div className="mobile-competition-item__content__info__prize--title">Prize Pool</div>
							<div className="mobile-competition-item__content__info__prize--value">{total_prize}</div>
						</div>
					</div>
				</div>
				<div className="mobile-competition-item__icon col-4 d-flex justify-content-center align-items-center">
					<img
						style={{ borderRadius: '50%' }}
						src={wallet ? wallet.iconUrl : getCryptoIcon(currency_id)}
						alt={`${toUpper(currency_id)}-icon`}
					></img>
				</div>
			</div>
		</div>
	);
};
