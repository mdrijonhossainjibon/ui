import * as React from 'react';
import ReactPaginate from 'react-paginate';
import { usePagination, useTable } from 'react-table';
import { LoadingSpinner } from '../LoadingSpinner';
import EmptySVG from './empty.svg';

interface StakeTableProps {
	columns: any;
	data: any;
	loading: boolean;
}

const NUMBER_ITEM_DISPLAY = 12;

export const StakeTable: React.FC<StakeTableProps> = (props: StakeTableProps) => {
	const { columns, data, loading } = props;
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

	return (
		<div className="td-stake-table">
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
						<p className="text-white">No Data</p>
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
				containerClassName={'td-pg-wallet__pagination'}
				activeClassName={'active'}
				forcePage={pageIndex}
			/>
		</div>
	);
};
