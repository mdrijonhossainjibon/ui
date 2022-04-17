import * as React from 'react';
import isEqual from 'react-fast-compare';
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';

interface PaginationComponent {
	toPage: (pageIndex: number) => void;
	nextPageExists?: boolean;
	forcePage?: number;
	pageCount?: number;
}

type Props = PaginationComponent;

const PaginationComponent: React.FC<Props> = ({ nextPageExists, toPage, forcePage = 1, pageCount = 1 }) => {
	const onChangePage: ReactPaginateProps['onPageChange'] = selectedItem => {
		toPage(selectedItem.selected + 1);
	};

	return (
		<div className="td-mobile-cpn-pagination">
			<ReactPaginate
				previousLabel={
					<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M7.41 1.41L6 0L0 6L6 12L7.41 10.59L2.83 6L7.41 1.41Z"
							fill={forcePage !== 0 ? '#fff' : '#848E9C'}
						/>
					</svg>
				}
				nextLabel={
					<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M0.59 1.41L2 0L8 6L2 12L0.59 10.59L5.17 6L0.59 1.41Z"
							fill={forcePage + 1 !== pageCount || nextPageExists ? '#fff' : '#848E9C'}
						/>
					</svg>
				}
				pageClassName="td-mobile-cpn-pagination__list__item"
				nextClassName="td-mobile-cpn-pagination__list__item-next"
				previousClassName="td-mobile-cpn-pagination__list__item-prev"
				breakLabel={'...'}
				breakClassName={'td-mobile-cpn-pagination__list__item-break-me'}
				pageCount={pageCount}
				marginPagesDisplayed={1}
				pageRangeDisplayed={2}
				onPageChange={onChangePage}
				containerClassName={'td-mobile-cpn-pagination__list'}
				activeClassName={'td-mobile-cpn-pagination__list__item--active'}
				forcePage={forcePage}
			/>
		</div>
	);
};

export const PaginationMobile = React.memo(PaginationComponent, isEqual);
