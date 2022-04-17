import * as React from 'react';
import { IEOItemComponent } from './../../components';
import { IEOItem } from './../../../../modules';
import ReactPaginate from 'react-paginate';
import { useIntl } from 'react-intl';

interface ListItemIEOProps {
	IEOList: Array<IEOItem>;
}
const NUMBER_ITEM_DISPLAY = 12;

export const ListItemIEO: React.FC<ListItemIEOProps> = props => {
	const intl = useIntl();
	const { IEOList } = props;

	const [paginationState, setPaginationState] = React.useState(0);

	const handlePageClick = (selectedItem: { selected: number }) => {
		setPaginationState(selectedItem.selected);
	};

	React.useEffect(() => {
		setPaginationState(0);
	}, [IEOList]);

	return (
		<React.Fragment>
			{IEOList.length > 0 ? (
				<React.Fragment>
					{IEOList.slice(
						paginationState * NUMBER_ITEM_DISPLAY,
						paginationState * NUMBER_ITEM_DISPLAY + NUMBER_ITEM_DISPLAY,
					).map((item, index) => (
						<div className="col-lg-4 col-md-6 mb-5" key={item.id}>
							<IEOItemComponent
								type={item.type}
								currencyId={item.currency_id}
								startDate={item.start_date}
								endDate={item.end_date}
								currencyAvailable={item.currency_available}
								description={item.description}
								bonus={item.bonus}
								remains={Number(item.remains)}
								total={Number(item.total_ieo)}
								id={item.id}
								key={index}
								progress={item.progress}
							/>
						</div>
					))}
					<div className="td-ieo-listing-screen__pagination w-100 d-flex flex-row justify-content-center">
						<ReactPaginate
							previousLabel={'<'}
							nextLabel={'>'}
							breakLabel={'...'}
							breakClassName={'break-me'}
							pageCount={IEOList.length / NUMBER_ITEM_DISPLAY}
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
						<h5>{intl.formatMessage({ id: 'page.ieo.body.noData' })}</h5>
					</div>
				</div>
			)}
		</React.Fragment>
	);
};
