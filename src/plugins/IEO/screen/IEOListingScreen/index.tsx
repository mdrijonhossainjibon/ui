import classNames from 'classnames';
import * as React from 'react';
import { ListItemIEO } from './../../containers';
import { useDispatch, useSelector } from 'react-redux';
import { selectIEOList, IEOListDataFetch, selectIEOListLoading } from './../../../../modules';
import { toLower } from 'lodash';
import UdonIconGif from './../../assets/loadingUdonex.gif';
import { setDocumentTitle } from 'helpers';
import { useIntl } from 'react-intl';

export type typeIEO = 'all' | 'ended' | 'running' | 'upcoming';
export const IEOListingScreen = () => {
	const intl = useIntl();
	setDocumentTitle(intl.formatMessage({ id: 'page.ieo.documentTitle' }));
	const [typeIEO, setTypeIEO] = React.useState<typeIEO>('all');
	const [searchInputState, setSearchInputState] = React.useState<string>('');
	const handleViewListIEO = (type: typeIEO) => {
		setTypeIEO(type);
		setSearchInputState('');
	};
	const dispatch = useDispatch();
	const renderActiveButtonAllClasses = classNames('upcoming', typeIEO === 'all' ? 'button--all' : '');
	const renderActiveButtonUpcomingClasses = classNames('upcoming', typeIEO === 'upcoming' ? 'button--upcoming' : '');
	const renderActiveButtonRunningClasses = classNames('running', typeIEO === 'running' ? 'button--running' : '');
	const renderActiveButtonEndedClasses = classNames('ended', typeIEO === 'ended' ? 'button--ended' : '');

	const isLoadingIEO = useSelector(selectIEOListLoading);
	const listIEO = useSelector(selectIEOList);
	const upcomingList = listIEO.filter(ieo => ieo.type === 'upcoming');
	const runningList = listIEO.filter(ieo => ieo.type === 'ongoing');
	const endedList = listIEO.filter(ieo => ieo.type === 'ended');

	React.useEffect(() => {
		dispatch(IEOListDataFetch());
	}, []);

	const renderIEOList = () => {
		if (searchInputState !== '') {
			return (
				<ListItemIEO IEOList={[...listIEO].filter(ieo => toLower(ieo.currency_id).includes(toLower(searchInputState)))} />
			);
		}
		return typeIEO === 'upcoming' ? (
			<ListItemIEO IEOList={[...upcomingList]} />
		) : typeIEO === 'running' ? (
			<ListItemIEO IEOList={[...runningList]} />
		) : typeIEO === 'ended' ? (
			<ListItemIEO IEOList={[...endedList]} />
		) : (
			<ListItemIEO IEOList={[...listIEO]} />
		);
	};

	return (
		<div className="td-ieo-listing-screen">
			<div className="container-fluid ieo-listing-screen__header">
				<h3>{intl.formatMessage({ id: 'page.ieo.header.title' })}</h3>
				<div className="ieo-listing-screen__header__function flex-wrap" style={{ paddingRight: '0px' }}>
					<div className="ieo-listing-screen__header__function__input">
						<input
							name="function-search"
							type="text"
							value={searchInputState}
							placeholder={intl.formatMessage({ id: 'page.ieo.header.search.placeholder' })}
							onChange={e => {
								setSearchInputState(e.target.value);
							}}
						/>
						<div className="icon-search">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"
									fill="#848E9C"
								/>
							</svg>
						</div>
					</div>
					<div className="ieo-listing-screen__header__function__mode-display-ieo">
						<button
							type="button"
							className={renderActiveButtonAllClasses}
							onClick={() => {
								handleViewListIEO('all');
							}}
							style={{ borderRadius: ' 100px 0px 0px 100px' }}
						>
							{intl.formatMessage({ id: 'page.ieo.header.search.btn.all' })}
						</button>
						<button
							type="button"
							className={renderActiveButtonUpcomingClasses}
							onClick={() => {
								handleViewListIEO('upcoming');
							}}
						>
							{intl.formatMessage({ id: 'page.ieo.header.search.btn.coming' })}
						</button>
						<button
							type="button"
							className={renderActiveButtonRunningClasses}
							onClick={() => {
								handleViewListIEO('running');
							}}
						>
							{intl.formatMessage({ id: 'page.ieo.header.search.btn.running' })}
						</button>
						<button
							type="button"
							className={renderActiveButtonEndedClasses}
							onClick={() => {
								handleViewListIEO('ended');
							}}
							style={{ borderRadius: ' 0px 100px 100px 0px' }}
						>
							{intl.formatMessage({ id: 'page.ieo.header.search.btn.ended' })}
						</button>
					</div>
				</div>
			</div>
			<div className="row td-ieo-listing-screen__body mt-3">
				{isLoadingIEO ? (
					<div className="td-ieo-listing-screen__body-loading mt-3">
						<img src={UdonIconGif} alt="loading" />
						<h3 className="mr-4">{intl.formatMessage({ id: 'page.ieo.body.loading' })}</h3>
					</div>
				) : (
					renderIEOList()
				)}
			</div>
		</div>
	);
};
