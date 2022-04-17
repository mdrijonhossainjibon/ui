import { format } from 'date-fns';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { getTimeZone } from '../../../../../helpers';
import { selectStakeHistories, selectStakeHistoriesLoading } from '../../../../../modules';
import { ReactTable } from '../ReactTable';

interface StakeHistoryProps {
	currency_id: string;
}
export const StakeHistory = (props: StakeHistoryProps) => {
	const { currency_id } = props;
	const stakeHistories = useSelector(selectStakeHistories);

	const formatStatus = (tx: string) => {
		const process = require('../../../../../assets/status/wait.svg');
		const fail = require('../../../../../assets/status/fail.svg');
		const success = require('../../../../../assets/status/success.svg');
		const statusMapping = {
			succeed: <img src={success} alt="succeed" />,
			distributed: <img src={success} alt="distributed" />,
			canceled: <img src={fail} alt="canceled" />,
			processing: <img src={process} alt="processing" />,
			pending: <img src={process} alt="pending" />,
		};

		return statusMapping[tx];
	};

	const histories = stakeHistories
		.filter(history => history.currency_id.toLowerCase() === currency_id.toLowerCase())
		.map(history => ({
			...history,
			period: `${history.period} days`,
			amount: Number(history.amount),
			lockup_date: format(new Date(history.lockup_date), 'yyyy-MM-dd hh:mm:ss'),
			release_date: format(new Date(history.release_date), 'yyyy-MM-dd hh:mm:ss'),
			status: formatStatus(history.status),
		}));
	const columns = React.useMemo(() => {
		return [
			{
				Header: 'Period',
				accessor: 'period',
			},
			{
				Header: 'Status',
				accessor: 'status',
			},
			{
				Header: 'Amount',
				accessor: 'amount',
			},
			{
				Header: 'Lockup Date',
				accessor: 'lockup_date',
			},
		];
	}, []);
	const stakeHistoryLoading = useSelector(selectStakeHistoriesLoading);

	return (
		<div>
			<span className="timezone">Timezone: GMT{getTimeZone()}</span>
			<ReactTable columns={columns} data={histories.reverse()} loading={stakeHistoryLoading} />
		</div>
	);
};
