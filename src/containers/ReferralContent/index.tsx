import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { copy } from '../../helpers';
import { alertPush, selectUserInfo } from '../../modules';

import FB from './Assets/fb.svg';
import TELE from './Assets/telegram.svg';
import TW from './Assets/twitter.svg';

import { QRCode } from 'components';
import { format } from 'date-fns';
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

const QR_SIZE = 120;
const NUMBER_ITEM_DISPLAY = 5;

export const ReferralContent: React.FC = () => {
	const dispatch = useDispatch();
	const user = useSelector(selectUserInfo);

	const estimatedCommission = useSelector(selectEstimatedCommision);
	const [paginationFriendsState, setPaginationFriendsState] = React.useState(0);
	const [paginationCommissionHistoryState, setPaginationCommissionHistoryState] = React.useState(0);
	const referralLink = `${window.document.location.origin}/register?refid=${user.uid}`;

	const friends = useSelector(selectFriendsList);
	const commissionHistories = useSelector(selectCommisionHistories);

	const isFriendsFetchLoading = useSelector(selectFriendsLoading);
	const isCommissionHistoryFetchLoading = useSelector(selectCommisionHistoryLoading);

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
		return (
			<div className="container-fluid">
				<div className="td-referral-content__wrapper">
					<div className="row">
						<div className="col-8 d-flex flex-row align-items-center">
							<div className="referral-container-QRcode">
								<QRCode dimensions={QR_SIZE} data={referralLink} />
							</div>
							<div className={'referral-container-content w-100 ml-5'}>
								<table className={'w-100'}>
									<tr>
										<td>
											<p className="font-weight-bold">My Referral ID:</p>
										</td>
										<td>
											<div className={'row'}>
												<div className={'col-md-12'}>
													<p className="text-white">{user.uid}</p>
												</div>
											</div>
										</td>
									</tr>
									<tr onClick={handleCopyText}>
										<td>
											<p className="font-weight-bold">Referral Link:</p>
										</td>
										<td>
											<div className={'row w-100'}>
												<div className={'col-md-12 col-xl-8 mb-3'}>
													<input
														className="text-white"
														style={{
															backgroundColor: 'var(--main-background-color)',
															borderRadius: '10px',
															border: 'none',
															padding: '6px',
															outline: 'none',
															width: '100%',
														}}
														type="text"
														id="referral-link"
														defaultValue={referralLink}
														readOnly={true}
													/>
												</div>
												<div className={'col-md-12 col-xl-4'}>
													<button
														className="text-center td-referral-content__copy-link"
														style={{
															backgroundColor: 'var(--yellow)',
															borderRadius: '10px',
															padding: '6px 16px',
															color: '#FFF',
															marginBottom: '0',
															outline: 'none',
															border: 'none',
															width: '100%',
														}}
													>
														Copy Link
													</button>
												</div>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<p className="font-weight-bold">Share:</p>
										</td>
										<td>
											<div className={'row'}>
												<div className={'col-12'}>
													<img src={FB} alt="facebook" />
													<img src={TELE} alt="telegram" />
													<img src={TW} alt="twitter" />
												</div>
											</div>
										</td>
									</tr>
								</table>
							</div>
						</div>
						<div className="col-4 d-flex flex-column justify-content-around border-left border-dark">
							<div className="referral-container__friend d-flex justify-content-between border-bottom border-dark w-100">
								<p className="font-weight-bold">Referral friends</p>
								<p className="text-white">{friends[0]}</p>
							</div>
							<div className="referral-container__Referral__Commission-value font-weight-bold">
								Estimated Commission Value
							</div>
							<div className="referral-container__coin-name d-flex flex-row-reverse text-white">
								{estimatedCommission ? estimatedCommission.total : ''}
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

		const handleCommissionHistoryPageClick = (selectedItem: { selected: number }) => {
			setPaginationCommissionHistoryState(selectedItem.selected);
			dispatch(commisionHistoryFetch({ page: selectedItem.selected, limit: NUMBER_ITEM_DISPLAY }));
		};

		return (
			<div>
				<div className="td-referral-content__table">
					<div className="container-fluid">
						<div className="row td-referral-content__table__row ">
							<div className="col-md-4 td-referral-content__table__row__col-left">
								<h4>Referral Friends</h4>
								<div className="row mt-3">
									<div className="col-md-6 text-left">Email</div>
									<div className="col-md-6 text-right">Date</div>
								</div>
								<div
									hidden={!isFriendsFetchLoading}
									className="td-referral-content__table__row__col-left__loading"
								>
									<div className="d-flex justify-content-center">
										<div className="spinner-border" role="status">
											<span className="sr-only">Loading...</span>
										</div>
									</div>
								</div>
								<div className="row mt-3 td-referral-content__table__row__col-left__friends">
									{friends[1].map((friend, index) => (
										<React.Fragment key={index}>
											<div className="col-md-6 text-white td-referral-content__table__row__col-left__friends-email text-left">
												<span data-tip={friend.email}>{friend.email}</span>
												<ReactTooltip />
											</div>
											<div className="col-md-6 text-right text-white td-referral-content__table__row__col-left__friends-time">
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
										containerClassName={'td-referral-content__table-pagination'}
										activeClassName={'active'}
										forcePage={paginationFriendsState}
									/>
								</div>
							</div>
							<div className="col-md-8 td-referral-content__table__row__col-right">
								<h4>Lastest Commission History</h4>
								<div className="row mt-3">
									<div className="col-md-3 text-left">Commission</div>
									<div className="col-md-5 text-left">Email</div>
									<div className="col-md-4 text-right">Date</div>
								</div>
								<div
									hidden={!isCommissionHistoryFetchLoading}
									className="td-referral-content__table__row__col-left__loading"
								>
									<div className="d-flex justify-content-center">
										<div className="spinner-border" role="status">
											<span className="sr-only">Loading...</span>
										</div>
									</div>
								</div>
								<div className="row mt-3 td-referral-content__table__row__col-right__commision">
									{commissionHistories[1].map((history, index) => (
										<React.Fragment key={index}>
											<div className="col-md-3 text-left text-white">{history.total}</div>
											<div className="col-md-5 text-left text-white td-referral-content__table__row__col-right__commision-email">
												<span data-tip={history.email}>{history.email}</span>
												<ReactTooltip />
											</div>
											<div className="col-md-4 text-right text-white">
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
										pageCount={commissionHistories[0] / NUMBER_ITEM_DISPLAY}
										marginPagesDisplayed={2}
										pageRangeDisplayed={NUMBER_ITEM_DISPLAY}
										onPageChange={handleCommissionHistoryPageClick}
										containerClassName={'td-referral-content__table-pagination'}
										activeClassName={'active'}
										forcePage={paginationCommissionHistoryState}
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
		<div className="td-referral-content">
			{renderReferralContent()}
			{renderReferralTable()}
		</div>
	);
};
