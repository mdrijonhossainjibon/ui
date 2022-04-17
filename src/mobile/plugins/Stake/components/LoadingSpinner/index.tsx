import * as React from 'react';

interface LoadingSpinnerProps {
	loading: boolean;
}

export const LoadingSpinner = (props: LoadingSpinnerProps) => {
	const { loading } = props;

	return (
		<div id="loading-spinner-mobile">
			{loading ? (
				<div className="loading-spin d-flex justify-content-center align-items-center">
					<div className="text-center">
						<div className="spinner-border" role="status">
							<span className="sr-only">Loading...</span>
						</div>
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
};
