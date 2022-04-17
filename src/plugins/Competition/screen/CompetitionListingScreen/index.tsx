import { currenciesFetch, fetchListCompetition, selectCompetitionList, walletsFetch } from 'modules';
import { ListCompetitionRunning, ListCompetitionNoneRunning } from 'plugins/Competition/containers';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import banner from './img/banner.png';
import { useState } from 'react';
import className from 'classnames';
import { LoadingCompetition } from '../../components';
import { setDocumentTitle } from 'helpers';
import { useIntl } from 'react-intl';
export type typeCompetition = 'stake' | 'trade';
export type statusCompetition = 'upcoming' | 'ended' | 'ongoing';
export const CompetitionListingScreen = () => {
	const intl = useIntl();
	setDocumentTitle(intl.formatMessage({ id: 'page.competition.setDocument' }));
	const dispatch = useDispatch();
	const { loading, payload: competitions } = useSelector(selectCompetitionList);
	const [statusCompetitionNoneRunningState, setTypeCompetitionNoneRunningState] = useState<statusCompetition>('upcoming');
	React.useEffect(() => {
		dispatch(fetchListCompetition());
		dispatch(currenciesFetch());
		dispatch(walletsFetch());
	}, []);
	const handleTypeNoneRunning = (type: statusCompetition) => {
		setTypeCompetitionNoneRunningState(type);
	};
	const listCompetitionRunning = competitions
		.filter(competition => competition.status === 'ongoing')
		.sort((prev, next) => next.id - prev.id);
	const listCompetitionNoneRunning = competitions
		.filter(competition => competition.status === statusCompetitionNoneRunningState)
		.sort((prev, next) => next.id - prev.id);
	const titleActiveUpcomingClassName = className(
		`${statusCompetitionNoneRunningState === 'upcoming' ? 'upcoming--active' : ''}`,
	);
	const titleActiveEndedClassName = className(`${statusCompetitionNoneRunningState === 'ended' ? 'ended--active' : ''}`);
	return (
		<div id="desktop-competition-listing">
			<div className="competition-listing__header">
				<img src={banner} alt="banner-competition" />
			</div>
			<div className="competition-listing__running">
				<div className="container">
					<div className="competition-listing__running__title w-100">
						<h4>{intl.formatMessage({ id: 'page.competition.header.title.active' })}</h4>
					</div>
					<div className="competition-listing__running__items">
						{(() => {
							if (loading) return <LoadingCompetition />;
							return <ListCompetitionRunning competitionList={listCompetitionRunning} />;
						})()}
					</div>
				</div>
			</div>
			<div className="competition-listing__none-running">
				<div className="container">
					<div className="competition-listing__none-running__title d-flex w-100">
						<div
							className={`competition-listing__none-running__title--upcoming ${titleActiveUpcomingClassName}`}
							onClick={() => handleTypeNoneRunning('upcoming')}
						>
							{intl.formatMessage({ id: 'page.competition.header.title.coming' })}
						</div>
						<div
							className={`competition-listing__none-running__title--ended ${titleActiveEndedClassName}`}
							onClick={() => handleTypeNoneRunning('ended')}
						>
							{intl.formatMessage({ id: 'page.competition.header.title.ended' })}
						</div>
					</div>
					<div className="competition-listing__none-running__items">
						{(() => {
							if (loading) return <LoadingCompetition />;
							return <ListCompetitionNoneRunning competitionList={listCompetitionNoneRunning} />;
						})()}
					</div>
				</div>
			</div>
		</div>
	);
};
