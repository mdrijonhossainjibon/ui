import { Empty } from 'antd';
import * as React from 'react';
import { TableStyle } from './styles';

type CellData = string | number | React.ReactNode | undefined;

// tslint:disable-next-line: no-empty-interface
interface TableOrderProps {
	headersKeys: string[];
	data: CellData[][];
}

export const TableOrder: React.FC<TableOrderProps> = ({ headersKeys, data }) => {
	const renderRowCells = (row: CellData[]) => {
		return row && row.length ? row.map((c, index: number) => <td key={index}>{c}</td>) : [];
	};

	const renderBody = (rows: CellData[][]) => {
		const rowElements = rows.map((r, i) => {
			return <tr key={i}>{renderRowCells(r)}</tr>;
		});

		return <tbody>{rowElements}</tbody>;
	};

	return (
		<React.Fragment>
			<TableStyle className="table table-fixed">
				<thead>
					<tr>
						{headersKeys.map((headerKey, i) => (
							<th key={i}>{headerKey}</th>
						))}
					</tr>
				</thead>
				{data.length ? renderBody(data) : null}
			</TableStyle>
			{data.length ? null : <Empty description={false} />}
		</React.Fragment>
	);
};
