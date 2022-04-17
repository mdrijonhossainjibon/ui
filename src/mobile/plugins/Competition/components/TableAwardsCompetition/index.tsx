import { upperCase } from 'lodash';
import { CompetitionAward } from 'modules';
import React from 'react';
import { EmptyData } from '..';

interface TableAwardProps {
	awards: Array<CompetitionAward>;
}
export const TableAwards = (props: TableAwardProps) => {
	const { awards } = props;
	return (
		<div id="table-award-mobile-competition">
			<table className="table table-dark">
				<thead className="text-center">
					<tr>
						<th scope="col">Rank</th>
						<th scope="col">Award</th>
					</tr>
				</thead>
				<tbody>
					{[...awards].map(item => (
						<React.Fragment key={item.rank}>
							<tr className="text-center">
								<td scope="row">{item.rank}</td>
								<td>{upperCase(item.prize)}</td>
							</tr>
						</React.Fragment>
					))}
				</tbody>
			</table>
			{awards.length > 0 ? null : <EmptyData />}
		</div>
	);
};
