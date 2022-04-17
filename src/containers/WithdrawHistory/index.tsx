import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import Tabs, { TabPane } from 'rc-tabs';
import { getTabName, localeDate } from '../../helpers';
import { selectCurrencies, selectChildCurrencies, selectWithdrawHistory } from '../../modules';
import { usePagination, useTable } from 'react-table';
import EmptySVG from './empty.svg';
import ReactPaginate from 'react-paginate';
import { toLower } from 'lodash';
interface WithdawHistoryTableProps {
	columns: any;
	data: any;
}
const NUMBER_ITEM_DISPLAY = 20;
interface WithdrawHistoryProps {
	currency_id: string;
}

export const WithdrawHistory: React.FC<WithdrawHistoryProps> = (props: WithdrawHistoryProps) => {
	const intl = useIntl();

	// props
	const { currency_id } = props;

	// selector
	const list = useSelector(selectWithdrawHistory);
	const currencies = useSelector(selectCurrencies);
	const childCurrencies = useSelector(selectChildCurrencies);
	const childCurrenciesIds = childCurrencies.map(child => child.id);

	const formatTxState = (tx: string, confirmations?: number, minConfirmations?: number) => {
		const process = require('../../assets/status/wait.svg');
		const fail = require('../../assets/status/fail.svg');
		const success = require('../../assets/status/success.svg');
		const checking = <span style={{ color: 'var(--yellow)' }}>Checking...</span>;
		const statusMapping = {
			confirming: <img src={process} alt="confirming" />,
			succeed: <img src={success} alt="succeed" />,
			failed: <img src={fail} alt="failed" />,
			accepted: <img src={process} alt="accepted" />,
			collected: <img src={success} alt="collected" />,
			canceled: <img src={fail} alt="canceled" />,
			rejected: <img src={fail} alt="rejected" />,
			processing: checking,
			prepared: <img src={process} alt="prepared" />,
			fee_processing: <img src={process} alt="fee_processing" />,
			skipped: checking,
			submitted:
				confirmations !== undefined && minConfirmations !== undefined ? (
					`${confirmations}/${minConfirmations}`
				) : (
					<img src={process} alt="process" />
				),
		};

		return statusMapping[tx];
	};

	const columns = React.useMemo(() => {
		return [
			{
				Header: intl.formatMessage({ id: `page.body.history.withdraw.header.date` }),
				accessor: 'date',
			},
			{
				Header: intl.formatMessage({ id: 'page.body.history.withdraw.header.typeCoin' }),
				accessor: 'type',
			},
			{
				Header: intl.formatMessage({ id: 'page.body.history.withdraw.header.txID' }),
				accessor: 'txid',
			},
			{
				Header: intl.formatMessage({ id: `page.body.history.withdraw.header.status` }),
				accessor: 'state',
			},
			{
				Header: intl.formatMessage({ id: `page.body.history.withdraw.header.amount` }),
				accessor: 'amount',
			},
		];
	}, [intl]);

	const main_list = list
		.filter(history => history.currency === currency_id.toLowerCase())
		.map(history => {
			const { blockchain_key } = currencies.find(currency => currency.id === history.currency) || {
				blockchain_key: 'Invalid',
			};
			const blockchain = getTabName(blockchain_key ? blockchain_key : 'Invalid');
			return {
				...history,
				type: blockchain,
			};
		});
	const child_list = list
		.filter(history => childCurrenciesIds.includes(history.currency))
		.map(history => {
			const currencyIndex = childCurrenciesIds.findIndex(
				childCurrencyID => toLower(childCurrencyID) === toLower(history.currency),
			);
			const blockchain = getTabName(
				childCurrencies[currencyIndex] && childCurrencies[currencyIndex].blockchain_key
					? childCurrencies[currencyIndex].blockchain_key
					: 'Invalid',
			);

			return {
				...history,
				type: blockchain,
			};
		});
	const new_list = [...main_list, ...child_list];
	const data = new_list
		.sort((a, b) => {
			return new Date(a.created_at) > new Date(b.created_at) ? -1 : 1;
		})
		.map(history => {
			const currency = currencies.find(cur => cur.id === history.currency);
			const blockchain_address = currency ? currency.explorer_transaction : '';
			const blockchainTxidAddress = blockchain_address
				? blockchain_address.replace('#{txid}', history.blockchain_txid)
				: '';
			return {
				...history,
				date: localeDate(history.created_at, 'fullDate'),
				status: history.state,
				amount: history.amount,
				txid: (
					<a rel="noopener noreferrer" target="_blank" href={blockchainTxidAddress}>
						{history.blockchain_txid}
					</a>
				),
				state: formatTxState(history.state),
			};
		});

	const all_history = [...data];
	const confirming_history = [...data].filter(d => d.status === 'confirming');
	const success_history = [...data].filter(d => d.status === 'succeed');
	const error_history = [...data].filter(d => d.status === 'failed');

	return (
		<div id="withdraw-history" style={{ marginTop: '50px' }}>
			<h2>{intl.formatMessage({ id: `page.body.history.withdraw` })}</h2>
			<div className="react-tabs">
				<Tabs defaultActiveKey="recent_history">
					<TabPane tab={intl.formatMessage({ id: 'page.body.history.withdraw.tab.recent' })} key="recent_history">
						<WithdrawHistoryTable columns={columns} data={all_history} />
					</TabPane>
					<TabPane
						tab={intl.formatMessage({ id: 'page.body.history.withdraw.tab.confirming' })}
						key="confirming_history"
					>
						<WithdrawHistoryTable columns={columns} data={confirming_history} />
					</TabPane>
					<TabPane tab={intl.formatMessage({ id: 'page.body.history.withdraw.tab.success' })} key="success_history">
						<WithdrawHistoryTable columns={columns} data={success_history} />
					</TabPane>
					<TabPane tab={intl.formatMessage({ id: 'page.body.history.withdraw.tab.error' })} key="error_history">
						<WithdrawHistoryTable columns={columns} data={error_history} />
					</TabPane>
				</Tabs>
			</div>
		</div>
	);
};

const WithdrawHistoryTable: React.FC<WithdawHistoryTableProps> = (props: WithdawHistoryTableProps) => {
	const intl = useIntl();
	const { columns, data } = props;
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		gotoPage,
		state: { pageIndex },
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0, pageSize: NUMBER_ITEM_DISPLAY },
			autoResetPage: false,
		},
		usePagination,
	);

	const handlePageClick = (selectedItem: { selected: number }) => {
		gotoPage(selectedItem.selected);
	};
	// render the UI for your table
	return (
		<div className="td-pg-withdraw-history">
			<table {...getTableProps()} style={{ position: 'relative' }}>
				<thead>
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<th {...column.getHeaderProps()}>
									<span style={{ fontWeight: 'normal' }}>{column.render('Header')}</span>
								</th>
							))}
						</tr>
					))}
				</thead>
				{[...page].length === 0 ? (
					<div className="text-center empty">
						<img className="text-center" width="100px" src={EmptySVG} alt="empty" />
						<br />
						<p>{intl.formatMessage({ id: 'page.body.history.withdraw.body.noData' })}</p>
					</div>
				) : (
					<tbody {...getTableBodyProps()}>
						{page.map(row => {
							prepareRow(row);

							return (
								<tr {...row.getRowProps()}>
									{row.cells.map(cell => {
										return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
									})}
								</tr>
							);
						})}
					</tbody>
				)}
			</table>
			<ReactPaginate
				previousLabel={'<'}
				nextLabel={'>'}
				breakLabel={'...'}
				breakClassName={'break-me'}
				pageCount={data.length / NUMBER_ITEM_DISPLAY}
				marginPagesDisplayed={2}
				pageRangeDisplayed={5}
				onPageChange={handlePageClick}
				containerClassName={'td-pg-withdraw-history__pagination'}
				activeClassName={'active'}
				forcePage={pageIndex}
			/>
		</div>
	);
};
