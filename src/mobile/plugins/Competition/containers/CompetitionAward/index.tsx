import { fetchCompetitionAward, selectCompetitionAward } from 'modules';
import { LoadingCompetition, TableAwards } from '../../components';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

export const CompetitionAward = (props: { competition_id: number }) => {
	const { competition_id } = props;
	const awards = useSelector(selectCompetitionAward);
	const dispatch = useDispatch();
	const templateRanking = [
		{ competition_id: competition_id, rank: 1, prize: '00,000 CX' },
		{ competition_id: competition_id, rank: 2, prize: '00,000 CX' },
		{ competition_id: competition_id, rank: 3, prize: '00,000 CX' },
		{ competition_id: competition_id, rank: 4, prize: '00,000 CX' },
		{ competition_id: competition_id, rank: 5, prize: '00,000 CX' },
		{ competition_id: competition_id, rank: 6, prize: '00,000 CX' },
		{ competition_id: competition_id, rank: 7, prize: '00,000 CX' },
		{ competition_id: competition_id, rank: 8, prize: '00,000 CX' },
		{ competition_id: competition_id, rank: 9, prize: '00,000 CX' },
		{ competition_id: competition_id, rank: 10, prize: '00,000 CX' },
	];
	const [prizesState, setPrizesState] = React.useState(templateRanking);
	React.useEffect(() => {
		dispatch(fetchCompetitionAward({ competition_id }));
	}, []);
	React.useEffect(() => {
		if (!awards.loading) setPrizesState(awards.payload);
	}, [awards.loading]);
	const renderTable = () => {
		const listTable: JSX.Element[] = [];
		for (let i = 0; i < prizesState.length / 10; i++) {
			listTable.push(
				<div className="col-md-6 col-sm-12" key={i}>
					<TableAwards awards={prizesState.slice(i * 10, (i + 1) * 10)} />
				</div>,
			);
		}
		return listTable;
	};
	const backgroundLoadingClassName = classNames('competition-background-loading');
	return (
		<React.Fragment>
			{awards.payload.length ? (
				<div
					className={`competition-ranking-awards row mt-2  d-flex justify-content-center d-flex position-relative ${
						awards.loading ? backgroundLoadingClassName : ''
					}`}
				>
					{awards.loading ? <LoadingCompetition className="competition-loading" /> : null}
					{renderTable()}
				</div>
			) : null}
		</React.Fragment>
	);
};
