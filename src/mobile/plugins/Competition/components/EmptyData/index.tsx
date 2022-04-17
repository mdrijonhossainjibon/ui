import React from 'react';
interface EmptyDataProps {
	className?: string;
}
export const EmptyData = (props: EmptyDataProps) => {
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
