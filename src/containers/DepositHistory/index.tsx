import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { getTabName, localeDate } from '../../helpers';
import { selectChildCurrencies, selectCurrencies, selectDepositHistory } from '../../modules';
import { usePagination, useTable } from 'react-table';
import EmptySVG from './empty.svg';
import ReactPaginate from 'react-paginate';
import { toLower } from 'lodash';
interface ReacTableProps {
	columns: any;
	data: any;
}
const NUMBER_ITEM_DISPLAY = 20;
interface DepositHistoryProps {
	currency_id: string;
}
export const DepositHistory: React.FC<DepositHistoryProps> = (props: DepositHistoryProps) => {
	const intl = useIntl();

	// props
	const { currency_id } = props;

	// selector
	const list = useSelector(selectDepositHistory);
	const currencies = useSelector(selectCurrencies);
	const childCurrencies = useSelector(selectChildCurrencies);
	const childCurrenciesIds = childCurrencies.map(child => child.id);

	const formatTxState = (tx: string, confirmations?: number, minConfirmations?: number) => {
		const process = require('../../assets/status/wait.svg');
		const fail = require('../../assets/status/fail.svg');
		const success = require('../../assets/status/success.svg');
		const statusMapping = {
			succeed: <img src={success} alt="" />,
			failed: <img src={fail} alt="" />,
			accepted: <img src={process} alt="" />,
			collected: <img src={success} alt="" />,
			canceled: <img src={fail} alt="" />,
			rejected: <img src={fail} alt="" />,
			processing: <img src={process} alt="" />,
			prepared: <img src={process} alt="" />,
			fee_processing: <img src={process} alt="" />,
			skipped: <img src={success} alt="" />,
			submitted:
				confirmations !== undefined && minConfirmations !== undefined ? (
					`${confirmations}/${minConfirmations}`
				) : (
					<img src={process} alt="" />
				),
		};

		return statusMapping[tx];
	};

	const columns = React.useMemo(() => {
		return [
			{
				Header: intl.formatMessage({ id: `page.body.history.deposit.header.date` }),
				accessor: 'date',
			},
			{
				Header: intl.formatMessage({ id: `page.body.history.deposit.header.type` }),
				accessor: 'type',
			},
			{
				Header: intl.formatMessage({ id: `page.body.history.deposit.header.txid` }),
				accessor: 'txid',
			},
			{
				Header: intl.formatMessage({ id: `page.body.history.deposit.header.status` }),
				accessor: 'state',
			},
			{
				Header: intl.formatMessage({ id: `page.body.history.deposit.header.amount` }),
				accessor: 'amount',
			},
		];
	}, [intl]);

	const parentHistoryList = list
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

	const childHistoryList = list
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
	const newList = [...parentHistoryList, ...childHistoryList];

	const data = newList
		.sort((a, b) => {
			return new Date(a.created_at) > new Date(b.created_at) ? -1 : 1;
		})
		.map((history: any) => {
			const currency = currencies.find(cur => cur.id === history.currency);
			const blockchainAddress = currency ? currency.explorer_transaction : '';
			const blockchainTxidAddress = blockchainAddress ? blockchainAddress.replace('#{txid}', history.txid) : '';

			return {
				...history,
				date: localeDate(history.created_at, 'fullDate'),
				status: 'success',
				amount: history.amount,
				txid: (
					<a rel="noopener noreferrer" target="_blank" href={blockchainTxidAddress}>
						{history.txid}
					</a>
				),
				state: formatTxState(history.state),
			};
		});

	return (
		<div style={{ marginTop: '10px' }}>
			<h2>{intl.formatMessage({ id: `page.body.history.deposit` })}</h2>
			<HistoryTable columns={columns} data={data} />
		</div>
	);
};

const HistoryTable: React.FC<ReacTableProps> = (props: ReacTableProps) => {
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
		<div className="td-pg-deposit-history">
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
						<p>No Data</p>
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
				containerClassName={'td-pg-deposit-history__pagination'}
				activeClassName={'active'}
				forcePage={pageIndex}
			/>
		</div>
	);
};
