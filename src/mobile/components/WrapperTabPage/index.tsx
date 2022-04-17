import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { PaginationMobile } from '../Pagination';
import { LoadingMobile } from './../Loading';

// tslint:disable-next-line: no-empty-interface
interface WrapperTabPageProps {
	title: string;

	filterState: 'upcoming' | 'running' | 'all' | 'ended';
	setFilterState: React.Dispatch<React.SetStateAction<'upcoming' | 'running' | 'all' | 'ended'>>;

	searchState: string;
	setSearchState: React.Dispatch<React.SetStateAction<string>>;

	pageSize?: number;
	isLoading?: boolean;
	totalItem: number;
	pageIndex: number;
	onPageChange: (pageIndex: number) => void;
}

export const WrapperTabPage: React.FC<WrapperTabPageProps> = props => {
	const {
		title,
		filterState,
		setFilterState,
		searchState,
		setSearchState,
		pageSize = 6,
		totalItem,
		pageIndex,
		onPageChange,
		isLoading,
	} = props;
	const intl = useIntl();

	const [activeInput, setActiveInput] = React.useState(false);

	const toggleIcon = () => {
		setActiveInput(!activeInput);
		if (!activeInput) {
			setSearchState('');
		}
	};

	const renderHeader = () => {
		const upcomingButtonClassName = classnames(
			'td-mobile-cpn-wrapper-tab-page__header__buttons-btn',
			filterState === 'upcoming' ? 'td-mobile-cpn-wrapper-tab-page__header__buttons__upcoming' : '',
		);
		const runningButtonClassName = classnames(
			'td-mobile-cpn-wrapper-tab-page__header__buttons-btn',
			filterState === 'running' ? 'td-mobile-cpn-wrapper-tab-page__header__buttons__running' : '',
		);
		const allButtonClassName = classnames(
			'td-mobile-cpn-wrapper-tab-page__header__buttons-btn',
			filterState === 'all' ? 'td-mobile-cpn-wrapper-tab-page__header__buttons__all' : '',
		);

		const endedButtonClassName = classnames(
			'td-mobile-cpn-wrapper-tab-page__header__buttons-btn',
			filterState === 'ended' ? 'td-mobile-cpn-wrapper-tab-page__header__buttons__ended' : '',
		);

		return (
			<div className="container td-mobile-cpn-wrapper-tab-page__header">
				<div className="container td-mobile-cpn-wrapper-tab-page__header__top-container">
					<h3 className="td-mobile-cpn-wrapper-tab-page__header__top-container__h3">{title}</h3>
					<div
						className="td-mobile-cpn-wrapper-tab-page__header__top-container__search"
						id={activeInput ? 'active' : 'non-active'}
					>
						<input
							placeholder={intl.formatMessage({ id: 'page.ieo.header.search.placeholder' })}
							type="text"
							value={searchState}
							onChange={e => setSearchState(e.target.value)}
						/>
						<div className="icon-search" onClick={toggleIcon}>
							{activeInput ? (
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM15 13.59L13.59 15L10 11.41L6.41 15L5 13.59L8.59 10L5 6.41L6.41 5L10 8.59L13.59 5L15 6.41L11.41 10L15 13.59Z"
										fill="white"
									/>
								</svg>
							) : (
								<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"
										fill="#848E9C"
									/>
								</svg>
							)}
						</div>
					</div>
				</div>

				<div className="td-mobile-cpn-wrapper-tab-page__header__buttons">
					<button onClick={() => setFilterState('all')} className={allButtonClassName}>
						{intl.formatMessage({ id: 'page.ieo.header.search.btn.all' })}{' '}
						<span hidden={filterState !== 'all'}></span>
					</button>
					<button onClick={() => setFilterState('upcoming')} className={upcomingButtonClassName}>
						{intl.formatMessage({ id: 'page.ieo.header.search.btn.coming' })}{' '}
						<span hidden={filterState !== 'upcoming'}></span>
					</button>
					<button onClick={() => setFilterState('running')} className={runningButtonClassName}>
						{intl.formatMessage({ id: 'page.ieo.header.search.btn.running' })}{' '}
						<span hidden={filterState !== 'running'}></span>
					</button>
					<button onClick={() => setFilterState('ended')} className={endedButtonClassName}>
						{intl.formatMessage({ id: 'page.ieo.header.search.btn.ended' })}{' '}
						<span hidden={filterState !== 'ended'}></span>
					</button>
				</div>
			</div>
		);
	};

	const renderChildren = () => {
		if (isLoading) {
			return <LoadingMobile />;
		}

		return props.children ? (
			<React.Fragment>
				{props.children}
				<PaginationMobile forcePage={pageIndex - 1} toPage={onPageChange} pageCount={Math.ceil(totalItem / pageSize)} />
			</React.Fragment>
		) : (
			<React.Fragment>
				<div className="td-mobile-cpn-wrapper-tab-page__body__empty w-100 text-center">
					<img
						className="td-mobile-cpn-wrapper-tab-page__body__empty__img"
						src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
						alt="no-data"
					/>
					<div className="w-100 text-center mt-2">
						<h5>{intl.formatMessage({ id: 'page.ieo.body.noData' })}</h5>
					</div>
				</div>
			</React.Fragment>
		);
	};

	return (
		<div className="td-mobile-cpn-wrapper-tab-page">
			{renderHeader()}
			<div
				style={{ position: 'relative', paddingRight: '0px', paddingLeft: '0px' }}
				className="m-auto container td-mobile-cpn-wrapper-tab-page__body"
			>
				<div>{renderChildren()}</div>
			</div>
		</div>
	);
};
