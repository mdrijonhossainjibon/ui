import * as React from 'react';
import { CompetitionItemRunning } from '../../components';
import { NewCompetition } from '../../../../modules';
import ReactPaginate from 'react-paginate';
import { useIntl } from 'react-intl';
export interface ListCompetitionProps {
	competitionList: Array<NewCompetition>;
}
const NUMBER_ITEM_DISPLAY = 12;
export const ListCompetitionRunning: React.FC<ListCompetitionProps> = props => {
	const intl = useIntl();
	const { competitionList } = props;
	const [paginationState, setPaginationState] = React.useState(0);

	const handlePageClick = (selectedItem: { selected: number }) => {
		setPaginationState(selectedItem.selected);
	};

	React.useEffect(() => {
		setPaginationState(0);
	}, [competitionList]);

	const EmptyComponent = () => {
		return (
			<div className="col-12">
				<div className="col-12 d-flex justify-content-center">
					<img
						src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
						style={{ marginTop: '3rem' }}
						alt="empty"
					/>
				</div>
				<p className="col-12 text-center text-white h5" style={{ padding: '1rem' }}>
					{intl.formatMessage({ id: 'page.competition.body.noData' })}
				</p>
			</div>
		);
	};
	const renderListingCompetition = () => {
		return (
			<React.Fragment>
				{competitionList
					.slice(paginationState * NUMBER_ITEM_DISPLAY, paginationState * NUMBER_ITEM_DISPLAY + NUMBER_ITEM_DISPLAY)
					.map((item, index) => (
						<div className="col-lg-4 col-md-6 mb-5" key={item.id}>
							<CompetitionItemRunning
								type={item.type}
								currency_id={item.currency_id}
								start_date={item.start_date}
								end_date={item.end_date}
								id={item.id}
								key={index}
								market_ids={item.market_ids}
								status={item.status}
								total_prize={item.total_prize}
								next_update={item.next_update}
							/>
						</div>
					))}
				<div className="td-competition-listing-screen-pagination col-12 w-100 d-flex flex-row justify-content-center">
					<ReactPaginate
						previousLabel={'<'}
						nextLabel={'>'}
						breakLabel={'...'}
						breakClassName={'break-me'}
						pageCount={competitionList.length / NUMBER_ITEM_DISPLAY}
						marginPagesDisplayed={2}
						pageRangeDisplayed={5}
						onPageChange={handlePageClick}
						containerClassName={'pagination'}
						activeClassName={'active'}
						forcePage={paginationState}
					/>
				</div>
			</React.Fragment>
		);
	};
	return (
		<div id="competition-listing" className="w-100 row mb-5">
			{!competitionList.length ? EmptyComponent() : renderListingCompetition()}
		</div>
	);
};
