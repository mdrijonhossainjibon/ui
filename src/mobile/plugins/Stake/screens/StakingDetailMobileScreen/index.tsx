import { NewTabPanel } from 'components';
import { useCurrenciesFetch } from 'hooks';
import millify from 'millify';
import { TabPane } from 'rc-tabs';
import * as React from 'react';
import { ProgressBar } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import {
	selectStakingList,
	selectUserInfo,
	Stake,
	stakeHistoryFetch,
	stakeWalletFetch,
	stakingListFetch,
	unStakeHistoryFetch,
} from '../../../../../modules';
import { StakeHistory, UnStakeHistory } from '../../components';
import { MyAssets, RegisterStake, StakingInfo, UnStake } from '../../containers';

const initialStakingItem: Stake = {
	stake_id: '',
	currency_id: '',
	staking_name: '',
	description: '',
	start_time: '',
	end_time: '',
	active: true,
	rewards: [],
	status: '',
	ref_link: '',
	total_amount: '0',
	cap_amount: '0',
	cap_amount_per_user: '0',
	min_amount: '0',
};

export const StakingDetailMobileScreen = () => {
	const intl = useIntl();
	const user = useSelector(selectUserInfo);
	const history = useHistory();

	// dispatch
	const dispatch = useDispatch();
	const dispatchFetchStakingList = () => dispatch(stakingListFetch());
	const [stakingItemState, setStakingItemState] = React.useState<Stake>(initialStakingItem);
	const [progressState, setProgressState] = React.useState('');
	const [totalAmountState, setTotalAmountState] = React.useState('');
	const [totalCapState, setTotalCapState] = React.useState('');

	const { stake_id } = useParams<{ stake_id: string }>();
	const stakingList = useSelector(selectStakingList);
	useCurrenciesFetch();
	React.useEffect(() => {
		const stakingItem =
			stakingList.find(staking => staking.stake_id.toString() === stake_id.toString()) || initialStakingItem;
		setStakingItemState(stakingItem);
	}, [stake_id, stakingList]);

	React.useEffect(() => {
		if (stakingItemState.rewards.length) {
			const totalAmount: number = Number(stakingItemState.total_amount);
			const totalCap: number = Number(stakingItemState.cap_amount);
			const percent = ((totalCap / totalAmount) * 100).toFixed(2);
			setProgressState(percent);
			setTotalAmountState(
				Number(totalAmount) > 100000000
					? String(
							millify(Number(totalAmount), {
								precision: 2,
							}),
					  )
					: String(totalAmount),
			);
			setTotalCapState(
				Number(totalCap) > 100000000
					? String(
							millify(Number(totalCap), {
								precision: 2,
							}),
					  )
					: String(totalCap),
			);
		}
	}, [stakingItemState]);

	React.useEffect(() => {
		dispatchFetchStakingList();
	}, [dispatch]);

	React.useEffect(() => {
		if (user.uid) {
			dispatch(stakeWalletFetch({ uid: user.uid }));
			dispatch(stakeHistoryFetch({ uid: user.uid, stake_id: stake_id }));
			dispatch(unStakeHistoryFetch({ uid: user.uid, currency_id: stakingItemState.currency_id }));
		}
	}, [user.uid, dispatch, stakingItemState.currency_id, stake_id]);

	const redirectToLogin = (): void | any => {
		history.push('/login');
	};
	const redirectToRegister = (): void | any => {
		history.push('/register');
	};

	const renderLoggedIn = () => {
		return (
			<>
				<div className="td-mobile-staking-detail__asset">
					<h5>{intl.formatMessage({ id: `stake.detail.title.myAssets` })}</h5>
					<MyAssets currency_id={stakingItemState.currency_id} />
				</div>

				<div className="td-mobile-staking-detail__stake">
					<NewTabPanel>
						<TabPane tab="STAKE" key="stake">
							<RegisterStake
								stake_id={stake_id}
								currency_id={stakingItemState.currency_id}
								start_time={stakingItemState.start_time}
								end_time={stakingItemState.end_time}
								rewards={stakingItemState.rewards}
								status={stakingItemState.status}
								active={stakingItemState.active}
								total_amount={stakingItemState.total_amount}
								cap_amount={stakingItemState.cap_amount}
								cap_amount_per_user={stakingItemState.cap_amount_per_user}
								min_amount={stakingItemState.min_amount}
							/>
						</TabPane>
						<TabPane tab="UNSTAKE" key="unstake">
							<UnStake currency_id={stakingItemState.currency_id} />
						</TabPane>
					</NewTabPanel>
				</div>

				<div className="td-mobile-staking-detail__history">
					<h3 className="text-warning">{intl.formatMessage({ id: `stake.detail.title.stakeHistory` })}</h3>
					<StakeHistory currency_id={stakingItemState.currency_id} />
				</div>

				<div className="td-mobile-staking-detail__history">
					<h3 className="text-warning">{intl.formatMessage({ id: `stake.detail.title.unStakeHistory` })}</h3>
					<UnStakeHistory currency_id={stakingItemState.currency_id} />
				</div>
			</>
		);
	};

	const renderNotLoggedIn = () => {
		return (
			<div className="td-mobile-staking-detail__loggedIn">
				<div className="td-mobile-staking-detail__loggedIn__userLogIn">
					<div className="td-mobile-staking-detail-loggedIn__wrapper">
						<div className="td-mobile-staking-detail-loggedIn__wrapper__desription">
							{intl.formatMessage({ id: 'page.mobile.stake.detail.logged_in_notice' })}
						</div>
						<div className="td-mobile-staking-detail-loggedIn__wrapper__login">
							<button onClick={redirectToLogin}>
								{intl.formatMessage({ id: 'page.mobile.stake.dettail.login' })}
							</button>
							<p>
								{intl.formatMessage({ id: 'page.mobile.stake.detail.register_notice' })}
								<span onClick={redirectToRegister}>
									{intl.formatMessage({ id: 'page.mobile.stake.detail.register' })}
								</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="td-mobile-staking-detail">
			<h4 className="td-mobile-staking-detail__title">
				{stakingItemState.currency_id.toUpperCase()}
				{intl.formatMessage({ id: 'page.mobile.stake.title' })}
			</h4>
			<div className="td-mobile-staking-detail__info">
				<StakingInfo
					currency_id={stakingItemState.currency_id}
					staking_name={stakingItemState.staking_name}
					description={stakingItemState.description}
					ref_link={stakingItemState.ref_link}
				/>
			</div>

			<div className="row">
				<div className="col-12">
					<div style={{ position: 'relative' }} hidden={Number(totalAmountState) <= 0}>
						<ProgressBar
							style={{ height: '75px', background: 'rgba(132, 142, 156, 0.35)', fontSize: '30px' }}
							animated
							now={Number(progressState)}
						/>
						<span
							className="text-white"
							style={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								fontSize: '1rem',
							}}
						>
							{totalCapState}/{totalAmountState}
						</span>
					</div>
				</div>
			</div>

			<div className="td-mobile-staking-detail__note">
				<div className="td-mobile-staking-detail__note__left">
					<span>{totalCapState}</span>
					<span hidden={Number(totalAmountState) <= 0}> / {totalAmountState}</span>
				</div>
				<ul className="td-mobile-staking-detail__note__right">
					<li>{intl.formatMessage({ id: `stake.detail.info.stakingNotes1` })}</li>
					<li>{intl.formatMessage({ id: `stake.detail.info.stakingNotes2` })}</li>
					<li>{intl.formatMessage({ id: `stake.detail.info.stakingNotes3` })}</li>
				</ul>
			</div>
			{user.uid ? renderLoggedIn() : renderNotLoggedIn()}
		</div>
	);
};
