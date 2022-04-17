import classnames from 'classnames';
import { selectVoteListInfoRound } from 'modules';
import moment from 'moment';
import * as React from 'react';
import Countdown, { CountdownRendererFn } from 'react-countdown';
import isEqual from 'react-fast-compare';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

const RenderCompleted = () => {
	const intl = useIntl();

	return (
		<React.Fragment>
			<div className="pg-vote__cpn__countdown__done text-center">
				<span className="pg-vote__cpn__countdown__done__thanks">
					{intl.formatMessage({ id: 'page.vote.body.news.countdown.voteEnd' })} <br />{' '}
					{intl.formatMessage({ id: 'page.vote.body.news.countdown.thanks' })}
				</span>
			</div>
		</React.Fragment>
	);
};

const RenderTime = ({ days, hours, minutes, seconds }) => {
	const intl = useIntl();
	const format = (value: number) => (value.toString().length === 1 ? `0${value}` : value.toString());
	return (
		<React.Fragment>
			<span>
				{format(days)}
				<i>{intl.formatMessage({ id: 'page.vote.body.news.countdown.days' })}</i>
			</span>
			<span>
				{format(hours)}
				<i>{intl.formatMessage({ id: 'page.vote.body.news.countdown.hours' })}</i>
			</span>
			<span>
				{format(minutes)}
				<i>{intl.formatMessage({ id: 'page.vote.body.news.countdown.minutes' })}</i>
			</span>
			<span>
				{format(seconds)} <i>{intl.formatMessage({ id: 'page.vote.body.news.countdown.seconds' })}</i>
			</span>
		</React.Fragment>
	);
};

const rendererCountDown: CountdownRendererFn = ({ days, hours, minutes, seconds, completed }) => {
	const timeElm = (
		<div className="pg-vote__cpn__countdown__time-remaining text-center">
			<RenderTime days={days} hours={hours} minutes={minutes} seconds={seconds} />
		</div>
	);
	if (completed) {
		return (
			<React.Fragment>
				<RenderCompleted />
				{timeElm}
			</React.Fragment>
		);
	} else {
		return timeElm;
	}
};

// tslint:disable-next-line: no-empty-interface
interface CountDownVoteProps {}

const CountDownVoteCpn: React.FC<CountDownVoteProps> = ({}) => {
	const intl = useIntl();

	const infoRound = useSelector(selectVoteListInfoRound, isEqual);
	const [diffNum, setDiffNum] = React.useState(0);
	React.useEffect(() => {
		setDiffNum(infoRound ? moment(infoRound.ended_at).diff(moment(infoRound.current_time)) : 0);
	}, [infoRound]);

	return (
		<div className="pg-vote__cpn__countdown">
			<div
				className={classnames('pg-vote--border pg-vote__cpn__countdown__count', {
					'mb-3': infoRound && infoRound.coin_id,
				})}
			>
				<Countdown
					intervalDelay={1000}
					date={diffNum ? Date.now() + diffNum : Date.now() + 10000}
					renderer={rendererCountDown}
				/>
			</div>
			{infoRound && infoRound.infoCoin && infoRound.infoCoin.id && (
				<div className="pg-vote--border pg-vote__cpn__countdown__last-win text-center">
					{intl.formatMessage({ id: 'page.vote.body.news.countdown.lastWin' })}{' '}
					<span className="pg-vote__cpn__countdown__last-win__winner text-success">
						{infoRound.infoCoin.id.toUpperCase()}
					</span>
					<br />
					{intl.formatMessage({ id: 'page.vote.body.news.countdown.website' })}{' '}
					<a rel="noopener noreferrer" target="_blank" href={infoRound.infoCoin.website}>
						{infoRound.infoCoin.website}
					</a>
				</div>
			)}
		</div>
	);
};

export const CountDownVote = React.memo(CountDownVoteCpn, isEqual);
