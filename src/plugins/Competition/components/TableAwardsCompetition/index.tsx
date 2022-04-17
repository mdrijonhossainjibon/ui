import { upperCase } from 'lodash';
import { CompetitionAward } from 'modules';
import React from 'react';
import { EmptyData } from '..';
import { useIntl } from 'react-intl';

interface TableAwardProps {
	awards: Array<CompetitionAward>;
}
export const TableAwards = (props: TableAwardProps) => {
	const intl = useIntl();
	const { awards } = props;
	return (
		<div id="table-award-competition">
			<table className="table table-dark">
				<thead className="text-center">
					<tr>
						<th scope="col">{intl.formatMessage({ id: 'page.competition.detail.awards.table.rank' })}</th>
						<th scope="col">{intl.formatMessage({ id: 'page.competition.detail.awards.table.award' })}</th>
					</tr>
				</thead>
				<tbody>
					{awards.map(item => (
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
