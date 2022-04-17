import { format } from 'date-fns';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectStakeHistories, selectStakeHistoriesLoading } from '../../../../modules';
import { StakeTable } from '../../components';
import { useIntl } from 'react-intl';
interface StakeHistoryProps {
	currency_id: string;
}
export const StakeHistory = (props: StakeHistoryProps) => {
	const intl = useIntl();
	const { currency_id } = props;
	const stakeHistories = useSelector(selectStakeHistories);

	const formatStatus = (tx: string) => {
		const process = require('../../../../assets/status/wait.svg');
		const fail = require('../../../../assets/status/fail.svg');
		const success = require('../../../../assets/status/success.svg');
		const statusMapping = {
			succeed: <img src={success} alt="" />,
			distributed: <img src={success} alt="" />,
			canceled: <img src={fail} alt="" />,
			processing: <img src={process} alt="" />,
			pending: <img src={process} alt="" />,
		};

		return statusMapping[tx];
	};

	const histories = stakeHistories
		.filter(history => history.currency_id.toLowerCase() === currency_id.toLowerCase())
		.map(history => ({
			...history,
			period: `${history.period} days`,
			rate: `${history.rate}%`,
			amount: Number(history.amount),
			lockup_date: format(new Date(history.lockup_date), 'yyyy-MM-dd hh:mm:ss'),
			release_date: format(new Date(history.release_date), 'yyyy-MM-dd hh:mm:ss'),
			status: formatStatus(history.status),
		}));

	const columns = React.useMemo(() => {
		return [
			{
				Header: intl.formatMessage({ id: 'page.stake.detail.stake.history.header.table.period' }),
				accessor: 'period',
			},
			{
				Header: intl.formatMessage({ id: 'page.stake.detail.stake.history.header.table.rate' }),
				accessor: 'rate',
			},
			{
				Header: intl.formatMessage({ id: 'page.stake.detail.stake.history.header.table.amount' }),
				accessor: 'amount',
			},
			{
				Header: intl.formatMessage({ id: 'page.stake.detail.stake.history.header.table.lockupDate' }),
				accessor: 'lockup_date',
			},
			{
				Header: intl.formatMessage({ id: 'page.stake.detail.stake.history.header.table.release' }),
				accessor: 'release_date',
			},
			{
				Header: intl.formatMessage({ id: 'page.stake.detail.stake.history.header.table.status' }),
				accessor: 'status',
			},
		];
	}, []);
	const stakeHistoryLoading = useSelector(selectStakeHistoriesLoading);
	const stakedAmount: number = histories.length > 0 ? histories.map(history => history.amount).reduce((a, b) => a + b, 0) : 0;

	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<div>
				<span className="text-white text-left float-right" style={{ fontSize: '1.3rem' }}>
					{intl.formatMessage({ id: 'page.stake.detail.stake.history.header.total' })} {stakedAmount.toFixed(5)}
				</span>
			</div>
			<StakeTable columns={columns} data={histories.reverse()} loading={stakeHistoryLoading} />
		</div>
	);
};
