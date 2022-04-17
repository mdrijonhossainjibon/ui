import { Empty } from 'antd';
import UdonIconGif from 'assets/icon-udonex.gif';
import { NewPagination } from 'components';
import { useVoteDonateFreeFetch, useVoteListFetch, useWalletsFetch } from 'hooks';
import get from 'lodash/get';
import { PaginationMobile } from 'mobile/components';
import { selectMobileDeviceState, selectVoteListInfo, selectVoteListLoading, selectWallets } from 'modules';
import * as constants from 'plugins/constants/vote';
import { ButtonVote, CountDownVote } from 'plugins/Vote/components';
import * as React from 'react';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// tslint:disable-next-line: no-empty-interface
interface VoteNewsProps {}

const defaultPaginationState = {
	pageIndex: 1,
	limit: 10,
};

export const VoteNews: React.FC<VoteNewsProps> = ({}) => {
	const intl = useIntl();
	useWalletsFetch();
	const freeVote = useVoteDonateFreeFetch();

	const [pagination, setPagintion] = React.useState(defaultPaginationState);
	const [keyword, setKeyword] = React.useState('');

	const isMobileDevice = useSelector(selectMobileDeviceState);
	const voteListInfo = useSelector(selectVoteListInfo);
	const isVoteListLoading = useSelector(selectVoteListLoading);
	const wallet = useSelector(selectWallets, isEqual).find(
		walletParam => walletParam.currency === constants.VOTE_CURRENCIE.toLowerCase(),
	);

	useVoteListFetch({ ...pagination, keyword });

	React.useEffect(() => {
		setPagintion(prev => ({ ...prev, pageIndex: defaultPaginationState.pageIndex }));
	}, [keyword]);

	const onChangeKeyword: React.InputHTMLAttributes<HTMLInputElement>['onChange'] = e => {
		setKeyword(e.target.value);
	};

	const getBodyTableData = React.useCallback(() => {
		const getRankData = (i: number) => (i <= 2 ? (i + 1).toString() : '');
		const rowDatas = voteListInfo.data.map((vote, i) => {
			return [
				getRankData(i),
				vote.id,
				vote.name,
				<a href={vote.website} target="_blank">
					{vote.website}
				</a>,
				<ButtonVote idKey={i} quantity={vote.total} id={vote.id} />,
			];
		});

		return rowDatas;
	}, [voteListInfo]);

	const onToPage = (pageIndex: number) => {
		setPagintion(prev => ({
			...prev,
			pageIndex,
		}));
	};

	const renderPagination = () => {
		if (isMobileDevice) {
			return (
				<PaginationMobile
					forcePage={pagination.pageIndex - 1}
					toPage={onToPage}
					pageCount={Math.ceil(voteListInfo.total / pagination.limit)}
				/>
			);
		}
		return (
			<NewPagination
				forcePage={pagination.pageIndex - 1}
				toPage={onToPage}
				pageCount={Math.ceil(voteListInfo.total / pagination.limit)}
			/>
		);
	};

	const dataTable = getBodyTableData();
	const availableVote = wallet && wallet.balance ? Math.floor(+wallet.balance / constants.VOTE_RATE) : 0;
	const availableFreeVote = freeVote.total ? Math.floor((freeVote.total - freeVote.used) / constants.VOTE_RATE) : 0;

	return (
		<div className="pg-vote__news">
			<div className="pg-vote--border pg-vote__news__title">
				<p>
					{intl.formatMessage(
						{ id: 'page.body.vote.news.title' },
						{ vote_rate: constants.VOTE_RATE, vote_currencie: constants.VOTE_CURRENCIE.toUpperCase() },
					)}
				</p>
				<p>
					{intl.formatMessage({ id: 'page.body.vote.news.title.you_can_buy' })}
					<Link to="/market/udonusdt">
						{intl.formatMessage({ id: 'page.body.vote.news.title.exchange_name' })}
					</Link>{' '}
					{intl.formatMessage({ id: 'page.vote.body.news.or' })}{' '}
					<a href="#" target="blank">
						{intl.formatMessage({ id: 'page.body.vote.news.title.pancakeswap' })}
					</a>
				</p>
			</div>
			<CountDownVote />
			<div className="pg-vote--border pg-vote__news__wrapper-table">
				<div className="pg-vote__news__navbar">
					<h4 className="pg-vote__news__navbar__title m-0">
						{intl.formatMessage({ id: 'page.body.vote.news.new_coin' })}
					</h4>
					<div className="pg-vote__news__navbar__desc d-flex flex-column justify-content-center ml-3">
						<div>
							<span>
								{intl.formatMessage(
									{ id: 'page.body.vote.news.balance' },
									{ vote_currencie: constants.VOTE_CURRENCIE, vote_value: +get(wallet, 'balance', 0) },
								)}
							</span>{' '}
							-{' '}
							<span>
								{intl.formatMessage({ id: 'page.body.vote.news.available' }, { available_vote: availableVote })}
							</span>
						</div>
						<div>
							<span>{intl.formatMessage({ id: 'page.body.vote.news.free' }, { availableFreeVote })}</span>-{' '}
							<span>
								{intl.formatMessage(
									{ id: 'page.body.vote.news.total' },
									{ total: availableVote + availableFreeVote },
								)}
							</span>
						</div>
					</div>

					<a className="pg-vote__news__navbar__link" href="https://forms.gle/Ui6xDaL9ME8KNQu37" target="_blank">
						<button type="button" className="pg-vote__news--radius btn btn-success">
							{intl.formatMessage({ id: 'page.body.vote.news.submit_coin' })}
						</button>
					</a>
				</div>
				<div className="mb-3 w-100">
					<input
						className="pg-vote__news__navbar__input-search w-100"
						placeholder={intl.formatMessage({ id: 'page.vote.body.news.search.placeholder' })}
						value={keyword}
						onChange={onChangeKeyword}
					/>
				</div>
				<div className="pg-vote__news__table__inner">
					<table className="pg-vote__news__table">
						<thead>
							<tr>
								<th>{intl.formatMessage({ id: 'page.body.vote.rank' })}</th>
								<th>{intl.formatMessage({ id: 'page.body.vote.code' })}</th>
								<th>{intl.formatMessage({ id: 'page.body.vote.name' })}</th>
								<th>{intl.formatMessage({ id: 'page.body.vote.website' })}</th>
								<th>{intl.formatMessage({ id: 'page.body.vote.votes' })}</th>
							</tr>
						</thead>
						<tbody className="pg-vote__news__table__tbody">
							{dataTable.length &&
								dataTable
									.slice(
										(pagination.pageIndex - 1) * pagination.limit,
										(pagination.pageIndex - 1) * pagination.limit + pagination.limit,
									)
									.map((row, i) => (
										<tr key={i}>
											{row.map((value, j) => (
												<td key={j}>{value}</td>
											))}
										</tr>
									))}
						</tbody>
					</table>
					{isVoteListLoading && (
						<div className="pg-vote__data__inner--loading">
							<img src={UdonIconGif} alt="loading" />
						</div>
					)}
					{!dataTable.length && !isVoteListLoading && (
						<div className="mb-5 mt-5">
							<Empty />
						</div>
					)}
				</div>

				{renderPagination()}
			</div>
		</div>
	);
};
