import React from 'react';

interface LoadingCompetitionProps {
	className?: string;
}
export const LoadingCompetition = (props: LoadingCompetitionProps) => {
	return (
		<div className={`loading-competition ${props.className} d-flex justify-content-center`}>
			<div className="spinner-border text-warning" role="status">
				<span className="sr-only">Loading...</span>
			</div>
		</div>
	);
};
