import React from 'react';
import { useIntl } from 'react-intl';
interface EmptyDataProps {
	className?: string;
}
export const EmptyData = (props: EmptyDataProps) => {
	const intl = useIntl();
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
