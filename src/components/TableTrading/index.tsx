import classNames from 'classnames';
import compactLd from 'lodash/compact';
import flattenDeepnLd from 'lodash/flattenDeep';
import * as React from 'react';
import { TableBlockStyle } from './styles';

type CellData = string | number | React.ReactNode | undefined;

interface Filter {
	name: string;
	filter: (cell: CellData[]) => boolean;
}

interface TableProps {
	/**
	 * Data which is used to render Table. The first element
	 * of array is used to render table head unless `noHead`
	 * is true. the rest is used to render Table body.
	 *
	 * All the elements of an array should have the same length.
	 */
	data: CellData[][];
	/**
	 * Renders table head.
	 */
	header?: React.ReactNode[];
	/**
	 *  Pair name & filter is used to filter table data depending on a filter
	 */
	filters?: Filter[];
	/**
	 * Row's unique key, could be a number - element's index in data
	 */
	rowKeyIndex?: number;
	/**
	 * Key of selected row, could be a string
	 */
	selectedKey?: string;
	/**
	 * Callback called when a row is selected
	 */
	onSelect?: (key: string) => void;
	/**
	 * Header which is displayed above the table
	 */
	titleComponent?: React.ReactNode;
	/**
	 * Defines whether row background shows or not, and calculates width of it
	 */
	rowBackground?: (row: number) => React.CSSProperties;
	/**
	 * Defines from what side row background starts `(left, right)`
	 * @default 'left'
	 */
	side?: 'left' | 'right';
	/**
	 * Sets row background color
	 */
	rowBackgroundColor?: string;
	/**
	 * Sets colspan count for empty table
	 */
	colSpan?: number;
}

/**
 * Cryptobase Table overrides default table
 */
export const TableTrading: React.FC<TableProps> = props => {
	const [activeFilter, setActiveFilter] = React.useState<string | undefined>(undefined);
	const [resultData, setResultData] = React.useState<CellData[][] | undefined>(undefined);
	const [selectedRowKey, setSelectedRowKey] = React.useState<string | undefined>(props.selectedKey);

	React.useEffect(() => {
		// tslint:disable-next-line: no-shadowed-variable
		const { filters } = props;
		if (filters && filters.length > 0) {
			handleFilter(filters[0]);
		}
	}, []);

	React.useEffect(() => {
		if (selectedRowKey !== props.selectedKey) {
			setSelectedRowKey(props.selectedKey);
		}
	}, [props.selectedKey]);

	React.useEffect(() => {
		if (props.filters) {
			// tslint:disable-next-line: no-shadowed-variable
			const activeFilter = props.filters.find(filter => filter.name === activeFilter);

			if (activeFilter) {
				handleFilter(activeFilter);
			}
		}
	}, [props.data]);

	React.useEffect(() => {
		if (props.onSelect) {
			selectedRowKey && props.onSelect(selectedRowKey);
		}
	}, [selectedRowKey]);

	const renderTitleComponent = () => {
		// tslint:disable-next-line: no-shadowed-variable
		const { titleComponent } = props;

		return <div className={'td-title-component'}>{titleComponent}</div>;
	};

	const renderRowCells = (row: CellData[]) => {
		// tslint:disable-next-line: no-shadowed-variable
		const { data } = props;
		const dataRow = row.map(c => c);
		const isCheckEmpty = compactLd(flattenDeepnLd(dataRow)).length === 1;
		// tslint:disable-next-line: no-shadowed-variable
		const cn = classNames({ 'td-table__empty': isCheckEmpty && (data || []).length <= 1 });

		return dataRow && dataRow.length
			? dataRow.map((c, index: number) => {
					return (
						<td key={index} className={cn} colSpan={dataRow.length === 1 ? props.colSpan : undefined}>
							{c}
						</td>
					);
			  })
			: [];
	};

	const handleFilter = (item: Filter) => {
		// tslint:disable-next-line: no-shadowed-variable
		const { data } = props;

		if (!item.filter) {
			setResultData(data);

			return;
		}
		// tslint:disable-next-line: no-shadowed-variable
		const resultData: CellData[][] = [...data].filter(item.filter);
		setActiveFilter(item.name);
		setResultData(resultData);
	};

	const handleSelect = (key: string) => () => {
		const { onSelect } = props;

		if (onSelect) {
			setSelectedRowKey(key);
		}
	};

	const renderFilters = () => {
		// tslint:disable-next-line: no-shadowed-variable
		const { filters = [] } = props;

		// tslint:disable-next-line: no-shadowed-variable
		const cn = (filterName: string) =>
			classNames('td-table__filter', {
				'td-table__filter--active': activeFilter === filterName,
			});

		return filters.map((item: Filter) => {
			const handleFilterClick = () => {
				handleFilter(item);
			};

			return (
				<div className={cn(item.name)} key={item.name} onClick={handleFilterClick}>
					{item.name}
				</div>
			);
		});
	};

	const renderHead = (row: CellData[]) => {
		const cells = row.map((c, index) => <th key={index}>{c}</th>);

		return (
			<thead className={'td-table__head'}>
				<tr className={'td-table__head-row'}>{cells}</tr>
			</thead>
		);
	};

	const renderRowBackground = (i: number) => {
		const { rowBackground, rowBackgroundColor = 'rgba(184, 233, 245, 0.7)' } = props;
		const rowBackgroundResult = rowBackground ? rowBackground(i) : {};
		const style = {
			...rowBackgroundResult,
			backgroundColor: rowBackgroundColor,
		};

		return rowBackground ? <span key={i} style={style} className="td-table-background__row" /> : null;
	};

	const renderBackground = (rows: CellData[][]) => {
		const { rowBackground, side } = props;
		const dataToBeMapped = resultData || rows;
		const renderBackgroundRow = (r: CellData[], i: number) => renderRowBackground(i);

		const className = classNames('td-table-background', {
			'td-table-background--left': side === 'left',
			'td-table-background--right': side === 'right',
		});

		return <div className={className}>{rowBackground && dataToBeMapped.map(renderBackgroundRow)}</div>;
	};

	// tslint:disable-next-line: no-shadowed-variable
	const renderBody = (rows: CellData[][], rowKeyIndex: number | undefined) => {
		const rowClassName = (key: string) =>
			classNames({
				'td-table__row--selected': selectedRowKey === key,
			});

		const dataToBeMapped = resultData || rows;
		const rowElements = dataToBeMapped.map((r, i) => {
			const rowKey = String(rowKeyIndex !== undefined ? r[rowKeyIndex] : i);

			return (
				<tr className={rowClassName(rowKey)} key={rowKey} onClick={handleSelect(rowKey)}>
					{renderRowCells(r)}
				</tr>
			);
		});

		return <tbody className={'td-table__body'}>{rowElements}</tbody>;
	};

	// tslint:disable-next-line: no-shadowed-variable
	const ensureDataIsValid = (data: CellData[][]) => {
		const length = data[0].length;
		const len = data.length;
		for (let i = 0; i < len; i += 1) {
			if (data[i].length !== length) {
				throw Error('Array elements must have the same length');
			}
		}
	};

	const { data, header, titleComponent, filters = [], rowKeyIndex } = props;

	ensureDataIsValid(data);

	const cn = classNames('td-table-header__content', {
		'td-table-header__content-empty': !titleComponent && filters.length === 0,
	});

	return (
		<TableBlockStyle className="td-table-container">
			<div className={cn}>
				{titleComponent ? renderTitleComponent() : null}
				{filters.length ? <div className="td-table__filters">{renderFilters()}</div> : null}
			</div>
			<table className={'td-table'}>
				{header && header.length && renderHead(header)}
				{renderBody(data, rowKeyIndex)}
			</table>
			{renderBackground(data)}
		</TableBlockStyle>
	);
};
