import * as React from 'react';
import { usePagination, useTable } from 'react-table';
import styled from 'styled-components';

interface MarketTableProps {
	columns: any;
	data: any;
}
const TableStyles = styled.div`
	table {
		width: 100%;
		border-spacing: 0;
		th,
		td {
			margin: 0;
			cursor: pointer;
			font-size: 14px;
			color: #fff;
			text-align: justify;
			padding-top: 15px;
			padding-bottom: 15px;
			padding-right: 10px;
			padding-left: 10px;
			transition: all 0.2s;
			background-color: #313445;
		}
		tr {
			border-top: 1px solid #848e9c;
		}
		th {
			color: #fff;
			background-color: #848e9c;
		}
		th:not(:first-child) {
			text-align: center;
		}
		tr td:not(:first-child) {
			text-align: center;
		}
		tr:hover td {
			background-color: #3c4055;
			color: #fff;
		}
	}
`;
const PagiantionStyle = styled.div`
	display: flex;
	padding-left: 0;
	list-style: none;
	border-radius: 0.25rem;
	justify-content: center;
	padding: 10px 0;
	border-top: 1px solid;

	button {
		background-color: transparent;
		color: #faf9f9;
		padding: 4px 12px;
		margin: 0 6px;
		border: 1px solid #666;
		border-radius: 2px;
		:focus {
			border: 1px solid #fff;
			outline: none;
			background: #313445;
			color: #fff;
		}
	}
	span {
		display: flex;
		align-items: center;
	}
`;
export const MarketTable: React.FC<MarketTableProps> = (props: MarketTableProps) => {
	const { columns, data } = props;

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page, // instead of using 'rows', we'll use page,

		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		//setPageSize,
		state: { pageIndex },
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0, pageSize: 30 },
			autoResetPage: false,
		},
		usePagination,
	);

	return (
		<React.Fragment>
			<TableStyles>
				<table {...getTableProps()} style={{ position: 'relative' }}>
					<thead>
						{headerGroups.map(headerGroup => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map(column => (
									<th width={`${[...columns].length / 100}%`} {...column.getHeaderProps()}>
										<span style={{ fontWeight: 'normal' }}>{column.render('Header')}</span>
									</th>
								))}
							</tr>
						))}
					</thead>
					{
						<tbody {...getTableBodyProps()}>
							{page.map(row => {
								prepareRow(row);

								return (
									<tr {...row.getRowProps()}>
										{row.cells.map(cell => {
											return (
												<td width={`${[...columns].length / 100}%`} {...cell.getCellProps()}>
													{cell.render('Cell')}
												</td>
											);
										})}
									</tr>
								);
							})}
						</tbody>
					}
				</table>
			</TableStyles>
			<PagiantionStyle>
				<button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
					{'<<'}
				</button>{' '}
				<button onClick={previousPage} disabled={!canPreviousPage}>
					{'<'}
				</button>{' '}
				<span>
					Page{' '}
					<strong className="d-flex justify-center: center">
						<div className="mr-1 ml-1" style={{ color: '#ced4da' }}>
							{+pageIndex + 1}
						</div>{' '}
						of {pageOptions.length}
					</strong>{' '}
				</span>
				<button onClick={nextPage} disabled={!canNextPage}>
					{'>'}
				</button>{' '}
				<button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
					{'>>'}
				</button>{' '}
			</PagiantionStyle>
		</React.Fragment>
	);
};
