import { GoBackIcon } from 'mobile/assets/icons';
import * as React from 'react';

interface Props {
	backTitle?: string;
	title: string;
	onGoBack: () => void;
}

const SubheaderComponent = (props: Props) => {
	return (
		<div className="td-mobile-subheader">
			<div className="td-mobile-subheader__back">
				<GoBackIcon onClick={props.onGoBack} />
				{/* temporarily closed */}
				<span className="td-mobile-subheader__back-item d-none">{props.backTitle}</span>
			</div>
			<div className="td-mobile-subheader__title">{props.title}</div>
			<div className="td-mobile-subheader__close" />
		</div>
	);
};

const Subheader = React.memo(SubheaderComponent);

export { Subheader };
