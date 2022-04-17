import React from 'react';

interface NewModalProps {
	show: boolean;
	onClose: () => void;
	children: JSX.Element[] | JSX.Element;
	title: string;
}

export const NewModal = (props: NewModalProps) => {
	const { show, onClose, children, title } = props;
	const showHideClassName = show ? 'td-mobile-new-modal__blur display-block' : 'td-mobile-new-modal__blur display-none';

	return (
		<div className="td-mobile-new-modal">
			<div className={showHideClassName}>
				<section className="td-mobile-new-modal__main">
					<h5 className="td-mobile-new-modal__header">{title}</h5>
					<div className="td-mobile-new-modal__main__body">{children}</div>
					<button type="button" className="td-mobile-new-modal__main__close-btn" onClick={onClose}>
						<span aria-hidden="true">×</span>
						<span className="sr-only">Close</span>
					</button>
				</section>
			</div>
		</div>
	);
};
