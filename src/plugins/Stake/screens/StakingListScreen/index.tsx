import classnames from 'classnames';
import { setDocumentTitle } from 'helpers';
import { useCurrenciesFetch } from 'hooks';
import { toLower } from 'lodash';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectStakingListLoading, selectStakingList, stakingListFetch } from '../../../../modules';
import { StakingList } from '../../containers';
import UdonIconGif from './icon-udonex.gif';
import { useIntl } from 'react-intl';

export const StakingListScreen = () => {
	const intl = useIntl();
	setDocumentTitle(intl.formatMessage({ id: 'page.stake.setDocument' }));

	// state
	const [filterStackingState, setFilterStackingState] = React.useState<'upcoming' | 'running' | 'all' | 'ended'>('all');
	const upcomingButtonClassName = classnames(
		'desktop-staking-list-screen__header__buttons-btn',
		filterStackingState === 'upcoming' ? 'desktop-staking-list-screen__header__buttons__upcoming' : '',
	);
	const runningButtonClassName = classnames(
		'desktop-staking-list-screen__header__buttons-btn',
		filterStackingState === 'running' ? 'desktop-staking-list-screen__header__buttons__running' : '',
	);
	const endedButtonClassName = classnames(
		'desktop-staking-list-screen__header__buttons-btn',
		filterStackingState === 'ended' ? 'desktop-staking-list-screen__header__buttons__ended' : '',
	);
	const allButtonClassName = classnames(
		'desktop-staking-list-screen__header__buttons-btn',
		filterStackingState === 'all' ? 'desktop-staking-list-screen__header__buttons__all' : '',
	);

	// store
	const stakingList = useSelector(selectStakingList);
	const isLoadingStake = useSelector(selectStakingListLoading);

	const upcomingList = stakingList.filter(staking => staking.status === 'upcoming');
	const runningList = stakingList.filter(staking => staking.status === 'running');
	const endedList = stakingList.filter(staking => staking.status === 'ended');

	// dispatch
	const dispatch = useDispatch();
	const dispatchFetchStakingList = () => dispatch(stakingListFetch());

	useCurrenciesFetch();

	React.useEffect(() => {
		dispatchFetchStakingList();
	}, []);

	const [searchState, setSearchState] = React.useState('');

	React.useEffect(() => {
		setFilterStackingState('all');
	}, [searchState]);

	const renderStakingList = () => {
		if (searchState !== '') {
			return (
				<StakingList
					stakes={[...stakingList].filter(stake => toLower(stake.currency_id).includes(toLower(searchState)))}
				/>
			);
		}
		return filterStackingState === 'upcoming' ? (
			<StakingList stakes={[...upcomingList]} />
		) : filterStackingState === 'running' ? (
			<StakingList stakes={[...runningList]} />
		) : filterStackingState === 'ended' ? (
			<StakingList stakes={[...endedList]} />
		) : (
			<StakingList stakes={[...stakingList]} />
		);
	};

	return (
		<div className="desktop-staking-list-screen">
			<div className="container-fluid desktop-staking-list-screen__header">
				<div className="row">
					<div className="col-12">
						<h3 className="desktop-staking-list-screen__header__h3">
							{intl.formatMessage({ id: 'page.stake.header.title' })}
						</h3>
					</div>
				</div>
				<div className="d-flex flex-row justify-content-between">
					<div className="desktop-staking-list-screen__header__search">
						<input
							placeholder="Search currency"
							type="text"
							value={searchState}
							onChange={e => setSearchState(e.target.value)}
						/>
						<div className="icon-search">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"
									fill="#848E9C"
								/>
							</svg>
						</div>
					</div>
					<div className="desktop-staking-list-screen__header__buttons">
						<button onClick={() => setFilterStackingState('all')} className={allButtonClassName}>
							{intl.formatMessage({ id: 'page.stake.header.search.btn.all' })}{' '}
							<span hidden={filterStackingState != 'all'}></span>
						</button>
						<button onClick={() => setFilterStackingState('upcoming')} className={upcomingButtonClassName}>
							{intl.formatMessage({ id: 'page.stake.header.search.btn.coming' })}{' '}
							<span hidden={filterStackingState != 'upcoming'}></span>
						</button>
						<button onClick={() => setFilterStackingState('running')} className={runningButtonClassName}>
							{intl.formatMessage({ id: 'page.stake.header.search.btn.running' })}{' '}
							<span hidden={filterStackingState != 'running'}></span>
						</button>
						<button onClick={() => setFilterStackingState('ended')} className={endedButtonClassName}>
							{intl.formatMessage({ id: 'page.stake.header.search.btn.ended' })}{' '}
							<span hidden={filterStackingState != 'ended'}></span>
						</button>
					</div>
				</div>
			</div>

			<div className="row desktop-staking-list-screen__body mt-3">
				{isLoadingStake ? (
					<div className="td-ieo-listing-screen__body-loading mt-3">
						<img src={UdonIconGif} alt="loading" />
						<h3 className="mr-4">{intl.formatMessage({ id: 'page.stake.body.loading' })}</h3>
					</div>
				) : (
					renderStakingList()
				)}
			</div>
		</div>
	);
};
