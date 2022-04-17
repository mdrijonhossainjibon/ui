import { Empty } from 'antd';
import message, { MessageType } from 'antd/lib/message';
import UdonIconGif from 'assets/icon-udonex.gif';
import { Decimal } from 'components';
import { localeDate } from 'helpers';
import { useVoteHistoryFetch } from 'hooks';
import { selectVoteDonateLoading, selectVoteHistoryInfo, selectVoteListLoading } from 'modules';
import * as constants from 'plugins/constants/vote';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
// tslint:disable-next-line: no-empty-interface
interface VoteHistoryProps {}

export const VoteHistory: React.FC<VoteHistoryProps> = ({}) => {
	const intl = useIntl();
	useVoteHistoryFetch();
	const voteHistoryInfo = useSelector(selectVoteHistoryInfo);
	const isVoteHistoryLoading = useSelector(selectVoteListLoading);
	const isVoteDonateLoading = useSelector(selectVoteDonateLoading);
	const msg = React.useRef<MessageType | null>(null);

	React.useEffect(() => {
		if (isVoteDonateLoading) {
			msg.current = message.loading('Progress..', 0);
		} else {
			if (msg.current) {
				msg.current();
			}
		}
	}, [isVoteDonateLoading]);

	const getBodyTableData = React.useCallback(() => {
		const rowDatas = voteHistoryInfo.data.map((vote, i) => {
			return [
				i + 1,
				vote.coin_id,
				vote.name,
				Decimal.formatRemoveZero(vote.amount, 20),
				localeDate(vote.created_at, 'fullDate'),
			];
		});

		return rowDatas;
	}, [voteHistoryInfo]);

	const dataTable = getBodyTableData();

	const emptyTableElm = (
		<tr>
			<td className="d-table-cell" colSpan={1000}>
				<div className="mb-5 mt-5">
					<Empty />
				</div>
			</td>
		</tr>
	);

	return (
		<div className="pg-vote__history">
			<div className="pg-vote--border pg-vote__history__wrapper-table">
				<div className="pg-vote__history__navbar">
					<div className="mb-2">
						<h4 className="pg-vote__history__navbar__title m-0">
							{intl.formatMessage({ id: 'page.body.vote.history.title' })}
						</h4>
					</div>
				</div>
				<div className="pg-vote__history__table__inner">
					<table className="pg-vote__history__table pg-vote__history__table--fixed">
						<thead>
							<tr>
								<th>{intl.formatMessage({ id: 'page.body.vote.number' })}</th>
								<th>{intl.formatMessage({ id: 'page.body.vote.code' })}</th>
								<th>{intl.formatMessage({ id: 'page.body.vote.name' })}</th>
								<th>
									{intl.formatMessage(
										{ id: 'page.body.vote.amount' },
										{ vote_currencie: constants.VOTE_CURRENCIE.toUpperCase() },
									)}
								</th>
								<th>{intl.formatMessage({ id: 'page.body.vote.date' })}</th>
							</tr>
						</thead>
						<tbody>
							{dataTable.length
								? dataTable.map((row, i) => (
										<tr key={i}>
											{row.map((value, j) => (
												<td key={j}>{value}</td>
											))}
										</tr>
								  ))
								: emptyTableElm}
						</tbody>
					</table>
					{isVoteHistoryLoading && (
						<div className="pg-vote__data__inner--loading">
							<img src={UdonIconGif} alt="loading" />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
