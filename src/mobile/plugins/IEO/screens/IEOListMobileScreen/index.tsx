import { WrapperTabPage } from 'mobile/components';
import { IEOListDataFetch, selectIEOList, selectIEOListLoading } from 'modules';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { ListItemIEO } from '../../containers';

const PAGE_SIZE = 4;

export type statusIEO = 'all' | 'running' | 'upcoming' | 'ended';
export const IEOListMobileScreen = () => {
	const [typeIEOState, setTypeIEOState] = React.useState<statusIEO>('all');
	const [searchInputState, setSearchInputState] = React.useState<string>('');
	const [pageIndexState, setPageIndexState] = React.useState<number>(1);
	const dispatch = useDispatch();
	const listIEO = useSelector(selectIEOList);
	const isLoading = useSelector(selectIEOListLoading);
	const intl = useIntl();

	React.useEffect(() => {
		setPageIndexState(1);
		setSearchInputState('');
	}, [typeIEOState]);

	// React.useEffect(() => {
	// 	typeIEOState !== 'all' && setTypeIEOState('all');
	// }, [searchInputState]);

	React.useEffect(() => {
		dispatch(IEOListDataFetch());
	}, []);

	const filterList = (() => {
		const checkingSearch = item => item.currency_id.toLowerCase().includes(searchInputState.toLowerCase().trim());
		let result = listIEO;
		if (searchInputState.trim()) {
			result = result.filter(checkingSearch);
		}

		if (typeIEOState === 'all') {
			result = result;
		} else {
			result = result.filter(item => item.type === typeIEOState && checkingSearch(item));
		}

		return result;
	})();

	const paginationFilter = () => {
		let result = filterList;
		const startSlice = (pageIndexState - 1) * PAGE_SIZE;
		const endSlice = startSlice + PAGE_SIZE;
		result = result.slice(startSlice, endSlice);

		return result;
	};

	return (
		<div id="ieo-list-mobile-screen">
			<WrapperTabPage
				title={intl.formatMessage({ id: 'page.ieo.header.title' })}
				filterState={typeIEOState}
				setFilterState={setTypeIEOState}
				searchState={searchInputState}
				setSearchState={setSearchInputState}
				totalItem={filterList.length}
				pageIndex={pageIndexState}
				pageSize={PAGE_SIZE}
				isLoading={isLoading}
				onPageChange={pageIndexParam => {
					setPageIndexState(pageIndexParam);
				}}
			>
				{filterList.length ? <ListItemIEO IEOList={paginationFilter()} /> : null}
			</WrapperTabPage>
		</div>
	);
};
