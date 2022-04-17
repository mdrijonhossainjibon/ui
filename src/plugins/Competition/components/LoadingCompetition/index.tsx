import React from 'react';
import { useIntl } from 'react-intl';

interface LoadingCompetitionProps {
	className?: string;
}
export const LoadingCompetition = (props: LoadingCompetitionProps) => {
	const intl = useIntl();
	return (
		<div className={`loading-competition ${props.className} d-flex justify-content-center`}>
			<div className="spinner-border text-warning" role="status">
				<span className="sr-only">{intl.formatMessage({ id: 'page.competition.loading' })}</span>
			</div>
		</div>
	);
};
