import classnames from 'classnames';
import * as React from 'react';
interface PaginationProps {
	page: number;
	/**
	 * Number shows first element index in pagination
	 */
	firstElemIndex: number;
	/**
	 * Number shows last element index in pagination
	 */
	lastElemIndex: number;
	/**
	 * Previous page click handler
	 */
	onClickPrevPage: () => void;
	/**
	 * Next page click handler
	 */
	onClickNextPage: () => void;
	/**
	 * Number shows current page index
	 */
	onClickFirstPage: () => void;

	onClickLastPage: () => void;

	onClickToPage?: (value: number) => void;
	/**
	 * Value for defining if next page exist or not
	 */
	nextPageExists?: boolean;
	/**
	 * Number shows total amount of elements
	 */
	total?: number;
	/**
	 * Separator between first and last values
	 */
	separator?: string;
	/**
	 * Text before total value
	 */
	totalText?: string;
}
export const PaginationAnnouncement: React.FC<PaginationProps> = props => {
	const { page, lastElemIndex, firstElemIndex } = props;

	const prevDisabled = page === firstElemIndex;
	const nextDisabled = page === lastElemIndex;

	const onClickPrevPage = () => {
		if (prevDisabled) {
			return;
		}
		props.onClickPrevPage();
	};

	const onClickNextPage = () => {
		if (nextDisabled) {
			return;
		}
		props.onClickNextPage();
	};

	const onClickFirstPage = () => {
		props.onClickFirstPage();
	};
	const onClickLastPage = () => {
		props.onClickLastPage();
	};
	const paginationList = (c: number, m: number) => {
		const current = c;
		const last = m;
		const delta = 1;
		const left = current - delta;
		const right = current + delta + 1;
		const range: number[] = [];
		const rangeWithDots = ([] as unknown) as [string, number];
		let l = 0;
		let temp: number;

		for (let i = 1; i <= last; i++) {
			if (i === 1 || i === last || (i >= left && i < right)) {
				range.push(i);
			}
		}

		for (const i of range) {
			if (l) {
				if (i - l === 2) {
					temp = l + 1;
					rangeWithDots.push(temp);
				} else if (i - l !== 1) {
					rangeWithDots.push('...');
				}
			}
			rangeWithDots.push(i);
			l = i;
		}

		return rangeWithDots;
	};
	const onClickToPage = (value: number | string) => {
		if (typeof value !== 'string') {
			props.onClickToPage && props.onClickToPage(value);
		}
	};
	const renderElmsPg = () =>
		paginationList(page, lastElemIndex).map((value, i) => (
			<li
				className={classnames('page-item', { disabled: value === '...', active: page === value })}
				key={i}
				style={{ width: '30px', margin: '0 6px' }}
			>
				<span className="page-link" onClick={() => onClickToPage(value)}>
					{value}
				</span>
			</li>
		));

	return (
		<nav className="cr-desktop-table__pagination" aria-label="Page navigation example">
			<ul className="pagination">
				<li className="pagination-item" onClick={onClickFirstPage} style={{ width: '30px', margin: '0 10px' }}>
					<span className="page-link" aria-label="Previous">
						<span aria-hidden="true">««</span>
						<span className="sr-only">First</span>
					</span>
				</li>
				<li className="pagination-item" onClick={onClickPrevPage} style={{ width: '30px', margin: '0 10px' }}>
					<span className="page-link" aria-label="Previous">
						<span aria-hidden="true">«</span>
						<span className="sr-only">Previous</span>
					</span>
				</li>
				{renderElmsPg()}
				<li className="pagination-item" onClick={onClickNextPage} style={{ width: '30px', margin: '0 10px' }}>
					<span className="page-link" aria-label="Next">
						<span aria-hidden="true">»</span>
						<span className="sr-only">Next</span>
					</span>
				</li>
				<li className="pagination-item" onClick={onClickLastPage} style={{ width: '30px', margin: '0 10px' }}>
					<span className="page-link" aria-label="Next">
						<span aria-hidden="true">»»</span>
						<span className="sr-only">Last</span>
					</span>
				</li>
			</ul>
		</nav>
	);
};
