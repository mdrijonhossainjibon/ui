import { setDocumentTitle } from 'helpers';
import React from 'react';
import isEqual from 'react-fast-compare';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';

// tslint:disable-next-line: no-empty-interface
interface PromotionDetailComponentProps {}

function setContent(content: string) {
	return {
		__html: content,
	};
}

const PromotionDetailComponent: React.FC<PromotionDetailComponentProps> = props => {
	const intl = useIntl();
	setDocumentTitle('Promotion Detail');
	return (
		<div className="pg-promotion-detail">
			<div className="pg-promotion-detail__item">
				<img
					className="pg-promotion-detail__item__img"
					src="https://th.bing.com/th/id/R.6bbfa3251d25046523f2cd6019aa5649?rik=H69y5zCvLPPf%2bA&pid=ImgRaw&r=0"
					alt="img..."
				/>
				<div className="pg-promotion-detail__item__title">
					{intl.formatMessage({ id: 'page.promotion.detail.title' })}
				</div>

				<div className="pg-promotion-detail__item__btns">
					<a href="/" target="blank">
						<button className="pg-promotion-detail__item__btns__btn-select">
							{intl.formatMessage({ id: 'page.promotion.detail.btn.join' })}
						</button>
					</a>
					<Link to="/promotion/detail/1">
						<button className="pg-promotion-detail__item__btns__btn-detail">
							{intl.formatMessage({ id: 'page.promotion.detail.btn.view' })}
						</button>
					</Link>
				</div>
				<div
					className="pg-promotion-detail__item__content"
					dangerouslySetInnerHTML={setContent(intl.formatMessage({ id: 'page.promotion.detail.content' }))}
				></div>
			</div>
		</div>
	);
};

export const PromotionDetailScreen = React.memo(PromotionDetailComponent, isEqual);
