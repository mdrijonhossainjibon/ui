import * as React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectStakingListLoading, Stake } from '../../../../modules';
import { LoadingSpinner, StakingItem } from '../../components';
import ReactPaginate from 'react-paginate';
import { useIntl } from 'react-intl';

interface StakingListProps {
	stakes: Stake[];
}

const NUMBER_ITEM_DISPLAY = 12;

export const StakingList: React.FC<StakingListProps> = (props: StakingListProps) => {
	const intl = useIntl();
	const { stakes } = props;
	const isLoadingStakingList = useSelector(selectStakingListLoading);

	const [paginationState, setPaginationState] = useState(0);

	const handlePageClick = (selectedItem: { selected: number }) => {
		setPaginationState(selectedItem.selected);
	};

	React.useEffect(() => {
		setPaginationState(0);
	}, [stakes]);

	return (
		<React.Fragment>
			{stakes.length > 0 ? (
				<React.Fragment>
					{stakes
						.reverse()
						.slice(paginationState * NUMBER_ITEM_DISPLAY, paginationState * NUMBER_ITEM_DISPLAY + NUMBER_ITEM_DISPLAY)
						.map((stake: Stake) => (
							<div className="col-lg-4 col-md-6 mb-5" key={stake.stake_id}>
								<StakingItem
									key={stake.stake_id}
									stake_id={stake.stake_id}
									currency_id={stake.currency_id}
									staking_name={stake.staking_name}
									rewards={stake.rewards}
									active={stake.active}
									status={stake.status}
									description={stake.description}
									start_time={stake.start_time}
									end_time={stake.end_time}
									ref_link={stake.ref_link}
									total_amount={stake.total_amount}
									cap_amount={stake.cap_amount}
									cap_amount_per_user={stake.cap_amount_per_user}
									min_amount={stake.min_amount}
								/>
							</div>
						))}
					<div id="stake-list-pagination" className="w-100 d-flex flex-row justify-content-center">
						<ReactPaginate
							previousLabel={'<'}
							nextLabel={'>'}
							breakLabel={'...'}
							breakClassName={'break-me'}
							pageCount={stakes.length / NUMBER_ITEM_DISPLAY}
							marginPagesDisplayed={2}
							pageRangeDisplayed={5}
							onPageChange={handlePageClick}
							containerClassName={'pagination'}
							activeClassName={'active'}
							forcePage={paginationState}
						/>
					</div>
				</React.Fragment>
			) : (
				<div style={{ marginTop: '50px', width: '100vw' }}>
					<div className="w-100 text-center">
						<img
							src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
							alt="no-data"
						/>
					</div>
					<div className="w-100 text-center mt-2">
						<h5>{intl.formatMessage({ id: 'page.stake.body.noData' })}</h5>
					</div>
				</div>
			)}

			<div hidden={!isLoadingStakingList} style={{ marginTop: '200px' }}>
				<LoadingSpinner loading={isLoadingStakingList} />
			</div>
		</React.Fragment>
	);
};
