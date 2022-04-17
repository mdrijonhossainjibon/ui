import message from 'antd/lib/message';
import { localeDate } from 'helpers';
import { useAirdropCoinClaimFetch, useAirdropCoinFetch } from 'hooks';
import get from 'lodash/get';
import { WrapperTabPage } from 'mobile/components';
import { airdropCoinClaimItemActive, selectAirdropCoinLoading, selectUserLoggedIn } from 'modules';
import moment from 'moment';
import * as React from 'react';
import { ProgressBar } from 'react-bootstrap';
import Countdown, { CountdownRendererFn } from 'react-countdown';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const rendererCountDown: CountdownRendererFn = ({ days, hours, minutes, seconds, completed }) => {
	const format = (value: number) => (value.toString().length === 1 ? `0${value}` : value.toString());
	const timeElm = (
		<div>
			<span className="pg-airdrop-list-coin--color-red font-weight-bold">
				Remaining: {format(days)} Days {format(hours)}:{format(minutes)}:{format(seconds)}
			</span>
		</div>
	);
	if (completed) {
		return timeElm;
	} else {
		return timeElm;
	}
};

// tslint:disable-next-line: no-empty-interface
interface AirdropCoinListScreenProps {}

const PAGE_SIZE = 6;
export const AirdropCoinListMobileScreen: React.FC<AirdropCoinListScreenProps> = ({}) => {
	const intl = useIntl();
	const history = useHistory();
	const dispatch = useDispatch();
	const airdrops = useAirdropCoinFetch();
	const claims = useAirdropCoinClaimFetch();

	const isLoading = useSelector(selectAirdropCoinLoading);
	const userLoggedIn = useSelector(selectUserLoggedIn);

	const [filterAirdropCoinState, setFilterAirdropCoinState] = React.useState<'upcoming' | 'running' | 'all' | 'ended'>('all');
	const [searchState, setSearchState] = React.useState('');
	const [pageIndex, setPageIndex] = React.useState(1);

	React.useEffect(() => {
		filterAirdropCoinState !== 'all' && setFilterAirdropCoinState('all');
	}, [searchState]);

	React.useEffect(() => {
		setPageIndex(1);
	}, [filterAirdropCoinState]);

	const filterList = (() => {
		let result = airdrops;
		const nowTime = moment.utc();
		const running = airdrops.filter(
			airdrop => moment.utc(airdrop.started_at).isBefore(nowTime) && moment.utc(airdrop.ended_at).isAfter(nowTime),
		);
		const upcoming = airdrops.filter(airdrop => moment.utc(airdrop.started_at).isAfter(nowTime));
		const ended = airdrops.filter(airdrop => moment.utc(airdrop.ended_at).isBefore(nowTime));
		switch (filterAirdropCoinState) {
			case 'running':
				result = running;
				break;
			case 'upcoming':
				result = upcoming;
				break;
			case 'ended':
				result = ended;
				break;
			default:
				result = running.concat(upcoming, ended);
				break;
		}

		if (searchState) {
			result = result.filter(airdrop => airdrop.airdrop_id.toLowerCase().includes(searchState.toLowerCase()));
		}

		return result;
	})();

	const paginationFilter = () => {
		let result = filterList;
		const startSlice = (pageIndex - 1) * PAGE_SIZE;
		const endSlice = startSlice + PAGE_SIZE;
		result = result.slice(startSlice, endSlice);

		return result;
	};

	const handleClaim = (airdropId: string) => {
		if (userLoggedIn) {
			const hide = message.loading('Loading...', 0);
			dispatch(
				airdropCoinClaimItemActive({ airdropId }, () => {
					hide();
				}),
			);
		} else {
			history.push('/login');
		}
	};

	const airDropsElm = paginationFilter().map((item, i) => {
		const nowTime = moment.utc();
		const claim = claims.find(claimParam => claimParam.airdrop_id === item.airdrop_id);
		const progressPercent = ((item.total_claim / item.max_claim) * 100).toFixed(2);

		const hasClaim = get(claim, 'claim_doned') === null; //is claim exist
		const comming = moment.utc(item.started_at).isAfter(nowTime);
		const ended = moment.utc(item.ended_at).isBefore(nowTime);
		const maxed = item.total_claim >= item.max_claim;
		const isDisableClaim = !claim || !hasClaim || !userLoggedIn || maxed || ended || comming;
		const claimSuccess = get(claim, 'claim_doned') === 1; //claim success
		const claimFail = get(claim, 'claim_doned') === 0; //claim fail
		const userNameBot = get(item, 'bot.config_bot.tele_username_bot') as string | undefined;
		const linkToBot = userNameBot ? `https://t.me/${userNameBot}` : undefined;

		let noteStr = `Click 'Join' to join!`;
		// tslint:disable-next-line: prefer-conditional-expression
		if (comming) {
			noteStr = `The airdrop hasn't started yet!`;
		} else if (claimSuccess) {
			if (get(item, 'bot.config_bot.has_send_token', 0)) {
				noteStr = get(claim, 'msg_status_msg_claim.msg_note', '');
			} else {
				noteStr = `Distribution will take place on ${localeDate(item.distribution_at, 'fullDate')}`;
			}
		} else if (claimFail) {
			noteStr = `${get(claim, 'msg_status_msg_claim.msg_note', '')}`;
		} else if (ended) {
			noteStr = `The airdrop has ended!`;
		} else if (maxed) {
			noteStr = `The maximum number of claims has been reached!`;
		} else if (!userLoggedIn) {
			noteStr = noteStr;
		} else if (!isDisableClaim) {
			noteStr = `Click 'Claim' to receive!`;
		}

		const checkStatus = () => {
			if (ended) {
				return 'Ended';
			}

			if (comming) {
				return 'Upcoming';
			}
			return 'Running';
		};

		const classNameOfStatus = () => {
			const status = checkStatus();

			switch (status) {
				case 'Ended':
					return 'td-mobile-screen-airdrop-list-coin__list__item__status--ended';

				case 'Running':
					return 'td-mobile-screen-airdrop-list-coin__list__item__status--running';

				case 'Upcoming':
					return 'td-mobile-screen-airdrop-list-coin__list__item__status--comming';
				default:
					return 'td-mobile-screen-airdrop-list-coin__list__item__status--running';
			}
		};

		return (
			<div className="td-mobile-screen-airdrop-list-coin__list__item" key={i}>
				<div className={classNameOfStatus()}>{checkStatus()}</div>
				<div className="d-flex flex-row justify-content-center">
					<div className="td-mobile-screen-airdrop-list-coin__list__item__left">
						<div className="td-mobile-screen-airdrop-list-coin__list__item__title">
							{item.airdrop_id.toUpperCase()} - {item.airdrop_title}
						</div>
						<div className="td-mobile-screen-airdrop-list-coin__list__item__desc">
							<div>
								<Countdown
									intervalDelay={1000}
									date={
										comming || ended
											? Date.now()
											: Date.now() + (moment(item.ended_at).diff(moment(moment().utc())) || 1000)
									}
									renderer={rendererCountDown}
								/>
								<div>
									<span className="pg-airdrop-list-coin--color-yellow font-weight-bold">
										{intl.formatMessage({ id: 'page.mobile.airdrop.item.text.status' })}
									</span>
									<span className="font-weight-bold">{noteStr}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="td-mobile-screen-airdrop-list-coin__list__item__mid">
					<div className="td-mobile-screen-airdrop-list-coin__list__item__mid__top">
						<div className="td-mobile-screen-airdrop-list-coin__list__item__total">
							<div className="td-mobile-screen-airdrop-list-coin__list__item__total__title">
								{intl.formatMessage({ id: 'page.mobile.airdrop.item.text.total' })}
							</div>
							<div className="d-flex flex-row  justify-content-center">
								<div className="td-mobile-screen-airdrop-list-coin__list__item__total__claim">
									<ProgressBar animated now={Number(progressPercent)} />
									<div className="td-mobile-screen-airdrop-list-coin__list__item__total__claim__value td-mobile-screen-airdrop-list-coin--color-green">
										{item.total_claim} / {item.max_claim}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="td-mobile-screen-airdrop-list-coin__list__item__mid__bottom">
						<div className="td-mobile-screen-airdrop-list-coin__list__item__ref">
							<div className="td-mobile-screen-airdrop-list-coin__list__item__ref__title">
								{intl.formatMessage({ id: 'page.mobile.airdrop.item.text.gift' })}
							</div>
							<div className="td-mobile-screen-airdrop-list-coin__list__item__ref__desc td-mobile-screen-airdrop-list-coin--color-red">
								{get(item, 'bot.config_bot.value_of_gift', '')}
							</div>
						</div>
						<div className="td-mobile-screen-airdrop-list-coin__list__item__ref">
							<div className="td-mobile-screen-airdrop-list-coin__list__item__ref__title">
								{intl.formatMessage({ id: 'page.mobile.airdrop.item.text.refGift' })}
							</div>
							<div className="td-mobile-screen-airdrop-list-coin__list__item__ref__desc td-mobile-screen-airdrop-list-coin--color-red">
								{get(item, 'bot.config_bot.value_of_gift_ref', '')}
							</div>
						</div>
					</div>
				</div>
				<div className="td-mobile-screen-airdrop-list-coin__list__item__right">
					<a
						className="td-mobile-screen-airdrop-list-coin__list__item__link"
						href={linkToBot}
						target="_blank"
						rel="noopener noreferrer"
					>
						<button
							disabled={!userNameBot || ended || comming}
							className="btn btn-lg btn-block  td-mobile-screen-airdrop-list-coin__list__item__button"
						>
							{intl.formatMessage({ id: 'page.mobile.airdrop.item.text.btn.join' })}
						</button>
					</a>
					<button
						disabled={isDisableClaim}
						className="td-mobile-screen-airdrop-list-coin__list__item__button td-mobile-screen-airdrop-list-coin__list__item__button--claim"
						onClick={() => handleClaim(item.airdrop_id)}
					>
						{intl.formatMessage({ id: 'page.mobile.airdrop.item.text.btn.claim' })}
					</button>
				</div>
			</div>
		);
	});

	return (
		<div className="td-mobile-screen-airdrop-list-coin">
			<WrapperTabPage
				title={intl.formatMessage({ id: 'page.mobile.airdrop.title' })}
				filterState={filterAirdropCoinState}
				setFilterState={setFilterAirdropCoinState}
				searchState={searchState}
				setSearchState={setSearchState}
				totalItem={filterList.length}
				pageIndex={pageIndex}
				pageSize={PAGE_SIZE}
				isLoading={isLoading}
				onPageChange={pageIndexParam => {
					setPageIndex(pageIndexParam);
				}}
			>
				{airDropsElm.length ? airDropsElm : undefined}
			</WrapperTabPage>
		</div>
	);
};
