import classNames from 'classnames';
import * as React from 'react';
import { usePagination, useTable } from 'react-table';
import { LoadingSpinner } from '../LoadingSpinner';
import EmptySVG from './empty.svg';

interface ReacTableProps {
	columns: any;
	data: any;
	loading: boolean;
}

export const ReactTable: React.FC<ReacTableProps> = (props: ReacTableProps) => {
	const { columns, data, loading } = props;
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page, // instead of using 'rows', we'll use page,
		// which has only the rows for the active page

		// the rest of these things are super handy, too ;)
		canPreviousPage,
		canNextPage,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		state: { pageIndex },
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0 },
		},
		usePagination,
	);

	// render the UI for your table
	return (
		<div id="react-table-mobile">
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

				{loading ? (
					<div style={{ width: '100%', height: '100px' }}>
						<LoadingSpinner loading={loading} />
					</div>
				) : [...page].length === 0 ? (
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
			<div className="pagination">
				<div className="pagination-button-box">
					<button
						className={classNames(!canPreviousPage ? 'disabled' : '')}
						onClick={() => gotoPage(0)}
						disabled={!canPreviousPage}
					>
						{'<<'}
					</button>{' '}
					<button
						className={classNames(!canPreviousPage ? 'disabled' : '')}
						onClick={previousPage}
						disabled={!canPreviousPage}
					>
						{'<'}
					</button>{' '}
					<button style={{ backgroundColor: '#8093C4' }}>{pageIndex + 1}</button>{' '}
					<button className={classNames(!canNextPage ? 'disabled' : '')} onClick={nextPage} disabled={!canNextPage}>
						{'>'}
					</button>{' '}
					<button
						className={classNames(!canNextPage ? 'disabled' : '')}
						onClick={() => gotoPage(pageCount - 1)}
						disabled={!canNextPage}
					>
						{'>>'}
					</button>{' '}
				</div>
			</div>
		</div>
	);
};
