import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FB from './Assets/fb.svg';
import TELE from './Assets/telegram.svg';
import TW from './Assets/twitter.svg';

import { copy, QRCode } from 'components';
import { format } from 'date-fns';
import { alertPush, selectUserInfo } from 'modules';
import {
	commisionHistoryFetch,
	estimatedCommisionFetch,
	friendsListFetch,
	selectCommisionHistories,
	selectCommisionHistoryLoading,
	selectEstimatedCommision,
	selectFriendsList,
	selectFriendsLoading,
} from 'modules/plugins/referral';
import ReactPaginate from 'react-paginate';
import ReactTooltip from 'react-tooltip';
import COPY_ICON from '../../assets/icons/Profile/copy.svg';

const QR_SIZE = 120;
const NUMBER_ITEM_DISPLAY = 5;

export const ReferralContent: React.FC = () => {
	const dispatch = useDispatch();
	const user = useSelector(selectUserInfo);
	const estimatedCommision = useSelector(selectEstimatedCommision);
	const [paginationFriendsState, setPaginationFriendsState] = React.useState(0);
	const [paginationCommisionHistoryState, setPaginationCommisionHistoryState] = React.useState(0);
	const referralLink = `${window.document.location.origin}/register?refid=${user.uid}`;

	const friends = useSelector(selectFriendsList);
	const commisionHistories = useSelector(selectCommisionHistories);

	const isFriendsFetchLoading = useSelector(selectFriendsLoading);
	const isCommisionHistoryFetchLoading = useSelector(selectCommisionHistoryLoading);

	const handleCopyText = () => {
		copy('referral-link');
		dispatch(alertPush({ message: ['page.referral.link.copy.success'], type: 'success' }));
	};

	React.useEffect(() => {
		dispatch(friendsListFetch({ page: paginationFriendsState, limit: NUMBER_ITEM_DISPLAY }));
		dispatch(commisionHistoryFetch({ page: paginationFriendsState, limit: NUMBER_ITEM_DISPLAY }));
		dispatch(estimatedCommisionFetch());
	}, []);

	const renderReferralContent = () => {
		const referralID = user.referal_uid || '';

		return (
			<div className="container">
				<div className="td-mobile-referral-content__wrapper">
					<div className="row">
						<div className="col-12 d-flex justify-content-between">
							<p className="font-weight-bold">QR Code:</p>
							<div className="referral-container-QRcode">
								<QRCode dimensions={QR_SIZE} data={referralLink} />
							</div>
						</div>
						<div className="col-12">
							<div className="referral-container-content">
								<div
									className="referral-container-content__ID d-flex"
									style={{
										marginTop: '10px',
									}}
								>
									<p className="font-weight-bold">My Referral ID:</p>
									<p className="text-white" style={{ marginLeft: '20px' }}>
										{referralID}
									</p>
								</div>
								<div
									className="referral-container-content__link d-flex align-items-center"
									style={{
										marginTop: '16px',
									}}
									onClick={handleCopyText}
								>
									<p className="font-weight-bold">Referral Link:</p>
									<div className="referral-container-content__link__copiedable">
										<input
											className="text-white"
											type="text"
											id="referral-link"
											defaultValue={referralLink}
											readOnly={true}
										></input>
										<button className="ml-3 text-center">
											<img src={COPY_ICON} alt="copy icon" />
										</button>
									</div>
								</div>
								<div
									className="referral-container-content__share d-flex"
									style={{
										marginTop: '12px',
									}}
								>
									<p className="font-weight-bold">Share:</p>
									<div style={{ marginLeft: 66 }}>
										<img src={FB} alt="facabook" />
										<img src={TELE} alt="telefram" />
										<img src={TW} alt="twitter" />
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-12 d-flex flex-column justify-content-around border-left border-dark">
							<div className="referral-container__friend d-flex justify-content-between border-bottom border-dark w-100">
								<p className="font-weight-bold">Referral friends</p>
								<p className="text-white">{friends[0]}</p>
							</div>
							<div className="referral-container__Referral__Commission-value font-weight-bold">
								Estimated Commission Value
							</div>
							<div className="referral-container__coin-name d-flex flex-row-reverse text-white">
								{estimatedCommision ? estimatedCommision.total : ''}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
	const renderReferralTable = () => {
		const handleFriendsPageClick = (selectedItem: { selected: number }) => {
			setPaginationFriendsState(selectedItem.selected);
			dispatch(friendsListFetch({ page: selectedItem.selected, limit: NUMBER_ITEM_DISPLAY }));
		};

		const handleCommisionHistoryPageClick = (selectedItem: { selected: number }) => {
			setPaginationCommisionHistoryState(selectedItem.selected);
			dispatch(commisionHistoryFetch({ page: selectedItem.selected, limit: NUMBER_ITEM_DISPLAY }));
		};

		return (
			<div>
				<div className="td-mobile-referral-content__table">
					<div className="container">
						<div className="row td-mobile-referral-content__table__row">
							<div className="col-12 td-mobile-referral-content__table__row__col-left">
								<h4>Referral Friends</h4>
								<div className="row mt-3 px-1">
									<div className="col-6 text-left">Email</div>
									<div className="col-6 text-right">Date</div>
								</div>
								<div
									hidden={!isFriendsFetchLoading}
									className="td-mobile-referral-content__table__row__col-left__loading"
								>
									<div className="d-flex justify-content-center">
										<div className="spinner-border" role="status">
											<span className="sr-only">Loading...</span>
										</div>
									</div>
								</div>
								<div className="row mt-3 td-mobile-referral-content__table__row__col-left__friends px-1">
									{friends[1].map((friend, index) => (
										<React.Fragment key={index}>
											<div className="col-6 text-white td-mobile-referral-content__table__row__col-left__friends-email text-left">
												<span data-tip={friend.email}>{friend.email}</span>
												<ReactTooltip />
											</div>
											<div className="col-6 text-right text-white td-mobile-referral-content__table__row__col-left__friends-time">
												<span data-tip={format(new Date(friend.time), 'MM-dd-YYY hh:mm:ss')}>
													{format(new Date(friend.time), 'MM-dd-YYY hh:mm:ss')}
												</span>
												<ReactTooltip />
											</div>
										</React.Fragment>
									))}
								</div>
								<div className="row mt-3 d-flex justify-content-center">
									<ReactPaginate
										previousLabel={'<'}
										nextLabel={'>'}
										breakLabel={'...'}
										breakClassName={'break-me'}
										pageCount={friends[0] / NUMBER_ITEM_DISPLAY}
										marginPagesDisplayed={2}
										pageRangeDisplayed={NUMBER_ITEM_DISPLAY}
										onPageChange={handleFriendsPageClick}
										containerClassName={'td-mobile-referral-content__table-pagination'}
										activeClassName={'active'}
										forcePage={paginationFriendsState}
									/>
								</div>
							</div>
							<div className="col-12 td-mobile-referral-content__table__row__col-right">
								<h4>Lastest Commission History</h4>
								<div className="row mt-3 px-1">
									<div className="col-4 text-left">Commision</div>
									<div className="col-4 text-left">Email</div>
									<div className="col-4 text-right">Date</div>
								</div>
								<div
									hidden={!isCommisionHistoryFetchLoading}
									className="td-mobile-referral-content__table__row__col-left__loading"
								>
									<div className="d-flex justify-content-center">
										<div className="spinner-border" role="status">
											<span className="sr-only">Loading...</span>
										</div>
									</div>
								</div>
								<div className="row mt-3 td-mobile-referral-content__table__row__col-right__commision px-1">
									{commisionHistories[1].map((history, index) => (
										<React.Fragment key={index}>
											<div className="col-4 text-left text-white">{history.total}</div>
											<div className="col-4 text-left text-white td-mobile-referral-content__table__row__col-right__commision-email">
												<span data-tip={history.email}>{history.email}</span>
												<ReactTooltip />
											</div>
											<div className="col-4 text-right text-white">
												{format(new Date(history.time), 'MM-dd-YYY hh:mm:ss')}
											</div>
										</React.Fragment>
									))}
								</div>
								<div className="row mt-3 d-flex justify-content-center">
									<ReactPaginate
										previousLabel={'<'}
										nextLabel={'>'}
										breakLabel={'...'}
										breakClassName={'break-me'}
										pageCount={commisionHistories[0] / NUMBER_ITEM_DISPLAY}
										marginPagesDisplayed={2}
										pageRangeDisplayed={NUMBER_ITEM_DISPLAY}
										onPageChange={handleCommisionHistoryPageClick}
										containerClassName={'td-mobile-referral-content__table-pagination'}
										activeClassName={'active'}
										forcePage={paginationCommisionHistoryState}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="td-mobile-referral-content">
			{renderReferralContent()}
			{renderReferralTable()}
		</div>
	);
};
