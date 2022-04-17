import * as React from 'react';
import { useHistory } from 'react-router';
import { selectCurrencies, Stake } from '../../../../../modules';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import Countdown from 'react-countdown';
import { useIntl } from 'react-intl';
import { ProgressBar } from 'react-bootstrap';
import millify from 'millify';
import { toUpper } from 'lodash';

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
			pathname: '/stake/detail/' + stake_id,
		};
		history.push(location);
	};

	const getCryptoIcon = (currency_id: string): string => {
		const currency = currencies.find((currency: any) => currency.id === currency_id);
		try {
			return require(`../../../../../../node_modules/cryptocurrency-icons/128/color/${currency_id.toLowerCase()}.png`);
		} catch (err) {
			if (currency) return currency.icon_url;
			return require('../../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	const statusClassnames = classNames(
		'stacking-item__label',
		status === 'upcoming'
			? 'stacking-item__label-upcoming'
			: status === 'running'
			? 'stacking-item__label-running'
			: status === 'ended'
			? 'stacking-item__label-ended'
			: '',
	);

	const renderStakeLabel = () => {
		return <div className={statusClassnames}>{status.toUpperCase()}</div>;
	};

	const renderProgressBar = () => {
		return (
			<section
				hidden={status === 'ended'}
				className="stake-item__time d-flex flex-row justify-content-between align-items-end"
			>
				<div className="timer">
					<span className="text-warning" hidden={status !== 'upcoming'}>
						{intl.formatMessage({ id: 'page.mobile.stake.start_in' })}
						<Countdown date={new Date(start_time)} renderer={renderer} />
					</span>
					<span hidden={status !== 'running'}>
						{intl.formatMessage({ id: 'page.mobile.stake.close_in' })}
						<Countdown date={new Date(end_time)} renderer={renderer} />
					</span>
				</div>
			</section>
		);
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
			// Render a completed state
			// window.location.reload(false);
			return (
				<span>
					{0}:{0}:{0}:{0}
				</span>
			);
		} else {
			// Render a countdown
			return (
				<span>
					{days}d {hours}h {minutes}m {seconds}s
				</span>
			);
		}
	};

	return (
		<div id="stacking-item">
			<div className="staking-item-container d-flex flex-column">
				<section className="image">
					<div className="logo-image">
						<img style={{ borderRadius: '50%' }} src={getCryptoIcon(currency_id)} alt={toUpper(currency_id)} />
					</div>
				</section>
				<section className="text">
					<h3 className="title">{staking_name}</h3>
					<div className="reward-container d-flex flex-row flex-wrap align-items-center">
						{rewards.map((reward, index) => (
							<div className="reward">
								<div className="reward-box" key={index}>
									<div className="reward-box__rate">{Number(reward.annual_rate) * 100}%</div>
									<div className="reward-box__period text-white">{Number(reward.period)} days</div>
								</div>
							</div>
						))}
					</div>
				</section>
				{renderProgressBar()}

				<section className="stake-item__progress d-flex flex-row justify-content-between align-items-end">
					<div style={{ position: 'relative', width: '100%' }}>
						<ProgressBar
							style={{ width: '100%', background: 'rgba(132, 142, 156, 0.35)' }}
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
							}}
						>
							<span>
								(Staked){' '}
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
								(Total)
							</span>
						</div>
					</div>
				</section>

				<section className="buttons d-flex flex-row justify-content-between align-items-end">
					<button onClick={handleGoStacking} className="go-stack-btn">
						{status === 'ended' || status === 'upcoming'
							? intl.formatMessage({ id: `stake.list.item.button.view` })
							: intl.formatMessage({ id: `stake.list.item.button.goStake` })}
					</button>
					<a rel="noopener noreferrer" target="_blank" href={ref_link} className="btn learn-more-btn">
						{intl.formatMessage({ id: `stake.list.item.button.learnMore` })}
					</a>
				</section>
			</div>
			<div hidden={active} className="stacking-item__disabled">
				<span>{intl.formatMessage({ id: 'page.mobile.stake.stake_is_disabled' })}</span>
			</div>
			{renderStakeLabel()}
		</div>
	);
};
