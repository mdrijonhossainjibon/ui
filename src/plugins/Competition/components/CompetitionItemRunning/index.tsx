import classnames from 'classnames';
import { formatDistance, format } from 'date-fns';
import { toLower, toUpper, upperCase } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { NewCompetition, selectCurrencies, selectWallets } from '../../../../modules';
import { useIntl } from 'react-intl';

export const CompetitionItemRunning: React.FC<NewCompetition> = props => {
	const intl = useIntl();
	const { end_date, type, currency_id, total_prize, start_date, id } = props;
	const currencies = useSelector(selectCurrencies);
	const history = useHistory();
	const onClickButtonDetail = () => {
		const location = {
			pathname: `/competition/${id}`,
		};
		history.push(location);
	};
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
	// selectors
	const wallets = useSelector(selectWallets);
	const wallet = wallets.find(wallet => toLower(wallet.currency) === toLower(currency_id));

	const getCryptoIcon = React.useCallback(
		(currencyID: string): string => {
			const currency = currencies.find((cur: any) => cur.id === currencyID.toLowerCase());
			try {
				return require(`../../../../../node_modules/cryptocurrency-icons/128/color/${currencyID.toLowerCase()}.png`);
			} catch (err) {
				if (currency) {
					return currency.icon_url;
				}
				return require('../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
			}
		},
		[currency_id],
	);
	const durationCompetition = `${format(new Date(start_date), 'MMM dd')} - ${format(new Date(end_date), 'MMM dd')}`;
	const renderCompetitionInfo = (title: string, value: string) => {
		return (
			<div className="desktop-competition-item-running__content__info__item col-6">
				<div className="desktop-competition-item-running__content__info__item--title">
					{title}
					<div className="desktop-competition-item-running__content__info__item--value">{value}</div>
				</div>
			</div>
		);
	};
	return (
		<div id="desktop-competition-item-running">
			<div className={`desktop-competition-item-running__header`}>
				<div className="w-100">
					<div className={`desktop-competition-item-running__header__type ${typeCompetitionClassNames}`}>
						{upperCase(type)}
					</div>
					<div className="desktop-competition-item-running__header__time">
						{intl.formatMessage({ id: 'page.competition.body.item.running.end' })}{' '}
						{formatDistance(new Date(end_date), new Date(), { addSuffix: true })}
					</div>
				</div>
				<div className="desktop-competition-item-running__header__icon d-flex justify-content-center">
					<img
						style={{ borderRadius: '50%' }}
						src={wallet ? wallet.iconUrl : getCryptoIcon(currency_id)}
						alt={`${currency_id}-icon`}
					/>
				</div>
			</div>
			<div className="desktop-competition-item-running__content">
				<div className="desktop-competition-item-running__content__currency">{toUpper(currency_id)}</div>
				<div className="desktop-competition-item-running__content__info row">
					{renderCompetitionInfo('Prize pool', total_prize || '')}
					{renderCompetitionInfo('Dates', durationCompetition || '')}
				</div>
			</div>
			<div className="desktop-competition-item-running__detail">
				<button type="button" onClick={onClickButtonDetail} className="desktop-competition-item-running__detail__button">
					{intl.formatMessage({ id: 'page.competition.body.item.running.btn.details' })}
				</button>
			</div>
		</div>
	);
};
