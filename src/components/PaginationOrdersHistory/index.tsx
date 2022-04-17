import classnames from 'classnames';
import React from 'react';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from 'react-icons/fa';

interface PaginationProps {
	pageIndex: number;
	nextPageExists?: boolean;
	max_page: number;
	onClickToPage: (pageIndexTmp: number) => void;
}

export const Pagination = (paginationProps: PaginationProps) => {
	const { pageIndex, max_page } = paginationProps;

	const renderFirstPage = () => {
		const isDisable = pageIndex === 1;
		const onclickFirstPage = () => {
			if (isDisable) {
				return;
			}
			paginationProps.onClickToPage(1);
		};
		const classname = classnames('history-screen__tabs__content__pagination__content__item__link', {
			'history-screen__tabs__content__pagination__content__item__link--disable': isDisable,
		});

		return (
			<li className="history-screen__tabs__content__pagination__content__item" onClick={onclickFirstPage}>
				<p className={classname}>
					<FaAngleDoubleLeft />
				</p>
			</li>
		);
	};

	const renderPrevPage = () => {
		const isDisable = pageIndex === 1;
		const onClickPrevPage = () => {
			if (isDisable) {
				return;
			}
			paginationProps.onClickToPage(pageIndex - 1);
		};
		const classname = classnames('history-screen__tabs__content__pagination__content__item__link', {
			'history-screen__tabs__content__pagination__content__item__link--disable': isDisable,
		});

		return (
			<li className="history-screen__tabs__content__pagination__content__item" onClick={onClickPrevPage}>
				<p className={classname}>
					<FaAngleLeft />
				</p>
			</li>
		);
	};
	const renderLastPage = () => {
		const isDisable = pageIndex === max_page;
		const onClickLastPage = () => {
			if (isDisable) {
				return;
			}
			paginationProps.onClickToPage(max_page);
		};

		const classname = classnames('history-screen__tabs__content__pagination__content__item__link', {
			'history-screen__tabs__content__pagination__content__item__link--disable': isDisable,
		});

		return (
			<li className="history-screen__tabs__content__pagination__content__item" onClick={onClickLastPage}>
				<p className={classname}>
					<FaAngleDoubleRight />
				</p>
			</li>
		);
	};

	const renderNextPage = () => {
		const isDisable = pageIndex === max_page;
		const onClickNextPage = () => {
			if (isDisable) {
				return;
			}
			paginationProps.onClickToPage(pageIndex + 1);
		};

		const classname = classnames('history-screen__tabs__content__pagination__content__item__link', {
			'history-screen__tabs__content__pagination__content__item__link--disable': isDisable,
		});

		return (
			<li className="history-screen__tabs__content__pagination__content__item" onClick={onClickNextPage}>
				<p className={classname}>
					<FaAngleRight />
				</p>
			</li>
		);
	};

	return (
		<div>
			<nav>
				<ul className="history-screen__tabs__content__pagination__content">
					{renderFirstPage()}
					{renderPrevPage()}
					<div className="ml-2">
						Page <span className="text-white">{pageIndex}</span>
					</div>
					{renderNextPage()}
					{renderLastPage()}
				</ul>
			</nav>
		</div>
	);
};
