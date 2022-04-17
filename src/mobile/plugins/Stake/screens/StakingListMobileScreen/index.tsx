import { useCurrenciesFetch } from 'hooks';
import { WrapperTabPage } from 'mobile/components';
import { selectStakingList, selectStakingListLoading, stakingListFetch } from 'modules';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { StakingList } from '../../containers';

const PAGE_SIZE = 4;
export const StakingListMobileScreen = () => {
	const intl = useIntl();
	// state
	const [filterStackingState, setFilterStackingState] = React.useState<'upcoming' | 'running' | 'all' | 'ended'>('all');
	const [pageIndex, setPageIndex] = React.useState(1);
	const [searchState, setSearchState] = React.useState('');
	// dispatch
	const dispatch = useDispatch();
	const dispatchFetchStakingList = () => dispatch(stakingListFetch());

	useCurrenciesFetch();

	React.useEffect(() => {
		setPageIndex(1);
	}, [filterStackingState]);

	React.useEffect(() => {
		dispatchFetchStakingList();
	}, []);

	React.useEffect(() => {
		filterStackingState !== 'all' && setFilterStackingState('all');
	}, [searchState]);

	// store
	const stakingList = useSelector(selectStakingList);
	const isLoadingStakingList = useSelector(selectStakingListLoading);

	const filterList = (() => {
		let result = stakingList;
		switch (filterStackingState) {
			case 'running':
				result = stakingList.filter(staking => staking.status === 'running');
				break;
			case 'upcoming':
				result = stakingList.filter(staking => staking.status === 'upcoming');
				break;
			case 'ended':
				result = stakingList.filter(staking => staking.status === 'ended');
				break;
			default:
				result = stakingList;
				break;
		}

		if (searchState) {
			result = result.filter(stake => stake.currency_id.toLowerCase().includes(searchState.toLowerCase()));
		}

		return result;
	})();

	const paginationFilter = () => {
		let result = filterList;
		const startSlice = (pageIndex - 1) * PAGE_SIZE;
		const endSlice = startSlice + PAGE_SIZE;
		result = result.slice(startSlice, endSlice);

		return result;
	};

	return (
		<div id="staking-list-mobile-screen">
			<WrapperTabPage
				title={intl.formatMessage({ id: 'page.mobile.stake.title' })}
				filterState={filterStackingState}
				setFilterState={setFilterStackingState}
				searchState={searchState}
				setSearchState={setSearchState}
				totalItem={filterList.length}
				pageIndex={pageIndex}
				pageSize={PAGE_SIZE}
				isLoading={isLoadingStakingList}
				onPageChange={pageIndexParam => {
					setPageIndex(pageIndexParam);
				}}
			>
				{filterList.length ? <StakingList staking_list={paginationFilter()} /> : undefined}
			</WrapperTabPage>
		</div>
	);
};
