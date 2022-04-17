import * as React from 'react';
import { usePagination, useTable } from 'react-table';
import styled from 'styled-components';

interface MarketTableProps {
	columns: any;
	data: any;
}
const TableStyles = styled.div`
	table {
		thead {
			background-color: var(--system-text-white-color);
			tr:first-child {
				border-bottom: none;
			}
		}
		width: 100%;
		border-spacing: 0;
		th,
		td {
			margin: 0;
			cursor: pointer;
			font-size: 14px;
			line-height: 19px;
			font-weight: 500;
			color: #333333;
			text-align: justify;
			padding-top: 15px;
			padding-bottom: 15px;
			padding-right: 10px;
			padding-left: 40px;
			transition: all 0.2s;
			background-color: var(--system-text-white-color);
		}
		td:last-child {
			text-align: right;
			padding-right: 40px;
		}
		tr {
			border-bottom: 0.5px solid #c4c4c4;
			transition: all 0.3s;
		}
		th {
			color: #000;
			padding-left: 40px;
			background-color: var(--btn-yellow-level-3);
		}
		th:not(:first-child) {
			text-align: center;
		}
		th:last-child {
			text-align: right;
			padding-right: 40px;
		}
		tr td:not(:first-child) {
			text-align: center;
		}
		tr:hover {
			background: var(--system-text-white-color);
			box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.45);
		}
		thead:hover tr {
			box-shadow: none;
			border-left: none;
		}
	}
`;
export const NewMarketTable: React.FC<MarketTableProps> = (props: MarketTableProps) => {
	const { columns, data } = props;

	const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0, pageSize: 5 },
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
		</React.Fragment>
	);
};
