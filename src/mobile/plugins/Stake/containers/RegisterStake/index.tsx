import classNames from 'classnames';
import { addDays, format } from 'date-fns';
import millify from 'millify';
import * as React from 'react';
import Countdown from 'react-countdown';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getTimeZone } from '../../../../../helpers';
import {
	createStake,
	selectCreateStakeLoading,
	selectStakeHistories,
	selectStakeHistoriesLoading,
	selectUserInfo,
	selectWallets,
	StakingReward,
} from '../../../../../modules';
import { LoadingSpinner } from '../../components';

interface RegisterStakeProps {
	stake_id: string;
	currency_id: string;
	start_time: string;
	end_time: string;
	rewards: StakingReward[];
	status: 'upcoming' | 'running' | 'ended' | '';
	active: boolean;
	total_amount: string;
	cap_amount: string;
	min_amount: string;
	cap_amount_per_user: string;
}

const DEFAULT_PERIOD_INDEX = 0;

export const RegisterStake: React.FC<RegisterStakeProps> = (props: RegisterStakeProps) => {
	const intl = useIntl();
	const {
		stake_id,
		currency_id,
		rewards,
		start_time,
		status,
		active,
		total_amount,
		cap_amount_per_user,
		cap_amount,
		min_amount,
	} = props;
	const [selectedPeriodIndexState, setSelectedPeriodIndexState] = React.useState<number>(DEFAULT_PERIOD_INDEX);
	const [lockupDateState, setLockupDateState] = React.useState('');
	const [releaseDateState, setReleaseDateState] = React.useState('');
	const [expectedRewardState, setExpectedRewardState] = React.useState('');
	const [amountState, setAmountState] = React.useState('');
	const [agreeState, setAgreeState] = React.useState(false);
	const [rewardState, setRewardState] = React.useState({
		reward_id: '',
		period: 0,
		annual_rate: 0,
	});

	const isLoadingCreateStake = useSelector(selectCreateStakeLoading);
	const isLoadingStakingList = useSelector(selectStakeHistoriesLoading);
	const stakeHistories = useSelector(selectStakeHistories);
	const stakedAmount = stakeHistories.map(his => his.amount).reduce((prev, next) => Number(prev) + Number(next), 0);
	const remainLimitedAmount = Number(cap_amount_per_user) - Number(stakedAmount);

	const wallets = useSelector(selectWallets);
	const wallet = wallets.find(wal => wal.currency.toLowerCase() === currency_id.toLowerCase()) || { balance: 0 };

	React.useEffect(() => {
		setExpectedRewardState(((rewardState.annual_rate / 365) * rewardState.period * Number(amountState)).toString());
	}, [amountState, selectedPeriodIndexState, rewardState]);

	const handleSelectLockupPeriod = React.useCallback(
		(periodIndex: number) => {
			const reward = rewards[periodIndex];
			setSelectedPeriodIndexState(periodIndex);
			if (reward) {
				const { reward_id, period, annual_rate } = reward;
				setLockupDateState(format(new Date(), 'yyyy-MM-dd hh:mm'));
				setReleaseDateState(format(addDays(new Date(), Number(period)), 'yyyy-MM-dd hh:mm'));
				setRewardState({
					...rewardState,
					reward_id: String(reward_id),
					period: Number(period),
					annual_rate: Number(annual_rate),
				});
			}
		},
		[rewardState, rewards],
	);

	React.useEffect(() => {
		if (rewards.length > 0) {
			const validRewardIndex = rewards.findIndex(reward => Number(total_amount) > Number(cap_amount));
			setSelectedPeriodIndexState(validRewardIndex ? validRewardIndex : DEFAULT_PERIOD_INDEX);
			handleSelectLockupPeriod(validRewardIndex ? validRewardIndex : DEFAULT_PERIOD_INDEX);
		}
	}, [rewards, handleSelectLockupPeriod, cap_amount, total_amount]);

	const isDisableStakeButton =
		amountState === '' ||
		(amountState !== '' && Number(cap_amount_per_user) === 0 ? false : Number(amountState) > Number(remainLimitedAmount)) ||
		(amountState !== '' && Number(min_amount) === 0 ? false : Number(amountState) < Number(min_amount)) ||
		!agreeState ||
		Number(amountState) > Number(wallet.balance) ||
		Number(expectedRewardState) <= 0;

	const renderer = ({ days, hours, minutes, seconds, completed }) => {
		if (completed) {
			// render a completed state
			// window.location.reload(false);
			return (
				<span>
					{0}:{0}:{0}:{0}
				</span>
			);
		} else {
			// render a countdown
			return (
				<span>
					{days}d {hours}h {minutes}m {seconds}s
				</span>
			);
		}
	};

	const renderProgress = () => {
		return (
			<span className="text-warning" hidden={status !== 'upcoming'}>
				{intl.formatMessage({ id: `stake.detail.register.startIn` })}:{' '}
				<Countdown date={new Date(start_time)} renderer={renderer} />
			</span>
		);
	};

	const dispatch = useDispatch();
	const user = useSelector(selectUserInfo);

	const resetForm = () => {
		setAmountState('');
		setAgreeState(false);
		handleSelectLockupPeriod(DEFAULT_PERIOD_INDEX);
	};

	const handleCreateStake = () => {
		resetForm();
		dispatch(
			createStake({
				uid: user.uid,
				stake_id: stake_id,
				reward_id: rewardState.reward_id,
				amount: amountState,
				lockup_date: lockupDateState,
				release_date: releaseDateState,
			}),
		);
	};

	const stakeButtonClassNames = classNames('stake-btn', isDisableStakeButton ? 'stake-btn--disabled' : '');

	return (
		<div className="td-mobile-register-stake">
			<span className="td-mobile-register-stake__amount-number">
				{intl.formatMessage({ id: `stake.detail.register.availableAmount` })}:{` ${wallet.balance || '0.0'} `}
				{currency_id.toUpperCase()}
			</span>
			<div className="td-mobile-register-stake__box">
				<span>{intl.formatMessage({ id: `stake.detail.register.amount` })}</span>
				<input
					value={amountState}
					type="number"
					placeholder="0"
					onChange={e => {
						const amount = e.target.value;
						if (Number(amount) >= 0) {
							setAmountState(amount);
						}
					}}
				/>
				<span>{currency_id.toUpperCase()}</span>
			</div>
			<div className="col-12">
				<span
					hidden={Number(amountState) >= Number(min_amount) || amountState === ''}
					className="text-danger float-right"
				>
					No less than{' '}
					<strong>
						{Number(min_amount)} {currency_id.toUpperCase()}
					</strong>{' '}
					can be staked at a time.
				</span>
				<span
					hidden={
						Number(cap_amount_per_user) === 0
							? true
							: Number(amountState) <= Number(remainLimitedAmount) || amountState === ''
					}
					className="text-danger float-right"
				>
					No larger than{' '}
					<strong>
						{Number(remainLimitedAmount) > 1000000
							? millify(Number(remainLimitedAmount), {
									precision: 2,
							  })
							: Number(remainLimitedAmount)}{' '}
						{currency_id.toUpperCase()}
					</strong>{' '}
					can be staked at a time.
				</span>
			</div>

			<div className="td-mobile-register-stake__lockup-period">
				<h5 className="td-mobile-register-stake__lockup-period__title">
					{intl.formatMessage({ id: `stake.detail.register.lockupPeriod` })}
				</h5>
				<div className="td-mobile-register-stake__lockup-period__buttons">
					{rewards.map((reward: StakingReward, index: number) => (
						<button
							disabled={Number(total_amount) === 0 ? false : Number(total_amount) <= Number(cap_amount)}
							key={index}
							className={selectedPeriodIndexState === index ? 'active' : undefined}
							onClick={() => handleSelectLockupPeriod(index)}
						>
							{Number(reward.period)} days
						</button>
					))}
				</div>
				<span className="td-mobile-register-stake__lockup-period__reward">
					Annualized Rewards <strong>{Number(rewardState.annual_rate) * 100}%</strong>
				</span>
			</div>

			<div className="td-mobile-register-stake__lockup-date">
				<h5 className="td-mobile-register-stake__lockup-date__title">
					{intl.formatMessage({ id: `stake.detail.register.lockupDates` })} (GMT{getTimeZone()})
				</h5>
				<div className="td-mobile-register-stake__lockup-date__content">
					<div className="td-mobile-register-stake__lockup-date__content__item">
						<span className="key"> {intl.formatMessage({ id: `stake.detail.register.lockup` })}</span>
						<span className="value">{lockupDateState}</span>
					</div>
					<div className="td-mobile-register-stake__lockup-date__content__item">
						<span className="key"> {intl.formatMessage({ id: `stake.detail.register.release` })}</span>
						<span className="value">{releaseDateState}</span>
					</div>
					<div className="td-mobile-register-stake__lockup-date__content__item">
						<span className="key"> {intl.formatMessage({ id: `stake.detail.register.paymentTime` })}</span>
					</div>
				</div>
			</div>

			<div className="td-mobile-register-stake__expected">
				<h5 className="td-mobile-register-stake__expected__title">
					{intl.formatMessage({ id: `stake.detail.register.expectedRewards` })}
				</h5>
				<div className="td-mobile-register-stake__expected__box">
					<input type="text" disabled value={expectedRewardState} />
					<span>{currency_id.toUpperCase()}</span>
				</div>
			</div>

			<label className="td-mobile-register-stake__cautions">
				<input type="checkbox" checked={agreeState} onChange={e => setAgreeState(e.target.checked)} />
				{intl.formatMessage({ id: `stake.detail.register.agreeCautions` })}
			</label>

			<div className="td-mobile-register-stake__submit">
				<button onClick={handleCreateStake} className={stakeButtonClassNames} disabled={isDisableStakeButton}>
					STAKE
				</button>
			</div>

			<LoadingSpinner loading={isLoadingStakingList || isLoadingCreateStake} />
			<div className="stacking-register__disabled text-info" hidden={status === 'running'}>
				<span>{renderProgress()}</span>
			</div>
			<div className="stacking-register__disabled text-info" hidden={active}>
				<span>{intl.formatMessage({ id: `stake.detail.register.stakeDisabled` })}</span>
			</div>
			<div className="stacking-register__disabled text-info" hidden={status !== 'ended'}>
				<span>{intl.formatMessage({ id: `stake.detail.register.stakeEnded` })}</span>
			</div>
		</div>
	);
};
