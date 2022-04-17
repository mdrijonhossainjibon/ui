import * as React from 'react';
import { CompetitionItemNoneRunning } from '../../components';
import { ListCompetitionProps } from '../ListCompetitionRunning';

export const ListCompetitionNoneRunning: React.FC<ListCompetitionProps> = props => {
	const { competitionList } = props;

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
					No Data
				</p>
			</div>
		);
	};
	const renderListingCompetition = () => {
		return (
			<div className="mobile-listing-competition-running">
				{competitionList.map((item, index) => (
					<div style={{ minWidth: '80vw' }} key={item.id}>
						<CompetitionItemNoneRunning
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
			</div>
		);
	};
	return (
		<div id="competition-listing" className="w-100 pb-5">
			{!competitionList.length ? EmptyComponent() : renderListingCompetition()}
		</div>
	);
};
