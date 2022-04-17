import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';

interface PromotionItemProps {}
export const PromotionItemComponent: React.FC<PromotionItemProps> = props => {
	const intl = useIntl();
	return (
		<div className="cpn-promotion-item">
			<img
				className="cpn-promotion-item__img"
				src="https://th.bing.com/th/id/R.6bbfa3251d25046523f2cd6019aa5649?rik=H69y5zCvLPPf%2bA&pid=ImgRaw&r=0"
				alt="img..."
			/>
			<div className="cpn-promotion-item__title">{intl.formatMessage({ id: 'page.promotion.item.title' })}</div>
			<div className="cpn-promotion-item__btns">
				<a href="/" target="blank">
					<button className="cpn-promotion-item__btns__btn-select">
						{intl.formatMessage({ id: 'page.promotion.item.btn.join' })}
					</button>
				</a>
				<Link to="/promotion/detail/1">
					<button className="cpn-promotion-item__btns__btn-detail">
						{intl.formatMessage({ id: 'page.promotion.item.btn.view' })}
					</button>
				</Link>
			</div>
		</div>
	);
};
