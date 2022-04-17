import classNames from 'classnames';
import * as React from 'react';
import Countdown from 'react-countdown';
import { useSelector } from 'react-redux';

import millify from 'millify';
import { ProgressBar } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { Currency, selectCurrencies, Stake } from '../../../../modules';

type Props = Stake;

export const StakingItem: React.FC<Props> = (props: Props) => {
	const intl = useIntl();
	const {
		stake_id,
		currency_id,
		staking_name,
		rewards,
		active,
		status,
		start_time,
		end_time,
		ref_link,
		total_amount,
		cap_amount,
	} = props;
	const [progressState, setProgressState] = React.useState('');
	const [totalAmountState, setTotalAmountState] = React.useState('');
	const [totalCapState, setTotalCapState] = React.useState('');
	const history = useHistory();
	const currencies = useSelector(selectCurrencies);
	const handleGoStacking = () => {
		const location = {
			pathname: `/stake/detail/${stake_id}`,
		};
		history.push(location);
	};

	const getCryptoIcon = (currencyID: string): string => {
		const currency = currencies.find((cur: Currency) => cur.id === currencyID);
		try {
			return require(`../../../../../node_modules/cryptocurrency-icons/128/color/${currencyID.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}

			return require('../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	const statusClassnames = classNames(
		'desktop-stacking-item__label',
		status === 'upcoming'
			? 'desktop-stacking-item__label-upcoming'
			: status === 'running'
			? 'desktop-stacking-item__label-running'
			: status === 'ended'
			? 'desktop-stacking-item__label-ended'
			: '',
	);

	const renderStakeLabel = () => {
		const renderStatusByI18n = () => {
			switch (status) {
				case 'running':
					return intl.formatMessage({ id: 'page.stake.header.search.btn.running' });
				case 'upcoming':
					return intl.formatMessage({ id: 'page.stake.header.search.btn.coming' });
				case 'ended':
					return intl.formatMessage({ id: 'page.stake.header.search.btn.ended' });

				default:
					return '';
			}
		};
		return <div className={statusClassnames}>{renderStatusByI18n()}</div>;
	};

	React.useEffect(() => {
		const totalAmount: number = Number(total_amount);
		const totalCap: number = Number(cap_amount);
		const percent = ((totalCap / totalAmount) * 100).toFixed(2);
		setProgressState(percent);
		setTotalAmountState(totalAmount.toFixed(5));
		setTotalCapState(totalCap.toFixed(5));
	}, [rewards, cap_amount, total_amount]);

	const renderer = ({ days, hours, minutes, seconds, completed }) => {
		if (completed) {
			// render a completed state
			// window.location.reload(false);
			return (
				<div className="desktop-stacking-item__timer__countdown w-100 d-flex flex-row justify-content-around">
					<div className="desktop-stacking-item__timer__countdown__item">0</div>
					<div className="desktop-stacking-item__timer__countdown__item">0</div>
					<div className="desktop-stacking-item__timer__countdown__item">0</div>
					<div className="desktop-stacking-item__timer__countdown__item">0</div>
				</div>
			);
		} else {
			// render a countdown
			return (
				<div className="desktop-stacking-item__timer__countdown w-100 d-flex flex-row justify-content-around">
					<div className="desktop-stacking-item__timer__countdown__item">{days}</div>
					<div className="desktop-stacking-item__timer__countdown__item">{hours}</div>
					<div className="desktop-stacking-item__timer__countdown__item">{minutes}</div>
					<div className="desktop-stacking-item__timer__countdown__item">{seconds}</div>
				</div>
			);
		}
	};

	return (
		<div className="desktop-stacking-item">
			<div className={statusClassnames}>
				<span>{status.toUpperCase()}</span>
			</div>
			<div className="desktop-stacking-item__container d-flex flex-column">
				<section className="desktop-stacking-item__container__image">
					<div className="desktop-stacking-item__container__image__logo-image">
						<img style={{ borderRadius: '50%' }} src={getCryptoIcon(currency_id)} alt={currency_id} />
					</div>
				</section>
				<section className="desktop-stacking-item__container__text">
					<h3 className="desktop-stacking-item__container__text__title">{staking_name}</h3>
					<div className="desktop-stacking-item__container__text__reward-container d-flex flex-row flex-wrap align-items-center">
						{rewards.map((reward, index) => (
							<div className="desktop-stacking-item__container__text__reward-container__reward">
								<div
									className="desktop-stacking-item__container__text__reward-container__reward__box"
									key={index}
								>
									<div className="desktop-stacking-item__container__text__reward-container__reward__box__rate">
										{Number(reward.annual_rate) * 100}%
									</div>
									<div className="desktop-stacking-item__container__text__reward-container__reward__box__period text-white">
										{Number(reward.period)} {intl.formatMessage({ id: 'page.stake.item.info.days' })}
									</div>
								</div>
							</div>
						))}
					</div>
				</section>
				<div className="desktop-stacking-item__timer">
					<div hidden={status !== 'upcoming'}>
						<Countdown date={new Date(start_time)} renderer={renderer} />
					</div>
					<div hidden={status !== 'running'}>
						<Countdown date={new Date(end_time)} renderer={renderer} />
					</div>
					<div hidden={status !== 'ended'}>
						<Countdown date={new Date(end_time)} renderer={renderer} />
					</div>
				</div>
				<section className="desktop-stacking-item__container__progress d-flex flex-row justify-content-between align-items-end">
					<div style={{ position: 'relative', width: '100%' }}>
						<ProgressBar
							style={{ width: '100%', background: 'var(--order-header-color)', height: '30px' }}
							animated
							now={Number(progressState)}
						/>
						<div
							className="text-white d-flex justify-content-around align-items-center"
							style={{
								position: 'absolute',
								top: '0',
								left: '0',
								width: '100%',
								height: '100%',
								padding: '0 1rem',
							}}
						>
							<span>
								{intl.formatMessage({ id: 'page.stake.item.info.staked' })}
								{Number(totalCapState) > 100000000
									? millify(Number(totalCapState), {
											precision: 2,
									  })
									: Number(totalCapState)}
							</span>
							<span hidden={Number(totalAmountState) <= 0}> / </span>
							<span hidden={Number(totalAmountState) <= 0}>
								{Number(totalAmountState) > 100000000
									? millify(Number(totalAmountState), {
											precision: 2,
									  })
									: Number(totalAmountState)}{' '}
								{intl.formatMessage({ id: 'page.stake.item.info.total' })}
							</span>
						</div>
					</div>
				</section>
				<section className="desktop-stacking-item__container__buttons d-flex flex-row justify-content-between align-items-end">
					<button onClick={handleGoStacking} className="desktop-stacking-item__container__buttons__go-stake">
						{status === 'ended' || status === 'upcoming'
							? intl.formatMessage({ id: `stake.list.item.button.view` })
							: intl.formatMessage({ id: `stake.list.item.button.goStake` })}
					</button>
					<a
						rel="noopener noreferrer"
						target="_blank"
						href={ref_link}
						className="btn desktop-stacking-item__container__buttons__learn-more"
					>
						{intl.formatMessage({ id: `stake.list.item.button.learnMore` })}
					</a>
				</section>
			</div>
			<div hidden={active} className="desktop-stacking-item__disabled">
				<span>{intl.formatMessage({ id: 'page.stake.item.info.disabled' })}</span>
			</div>
			{renderStakeLabel()}
		</div>
	);
};
