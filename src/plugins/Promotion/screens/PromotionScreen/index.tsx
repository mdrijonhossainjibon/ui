import { setDocumentTitle } from 'helpers';
import React from 'react';
import isEqual from 'react-fast-compare';
import { PromotionItemComponent } from '../../components';
import { useIntl } from 'react-intl';

// tslint:disable-next-line: no-empty-interface
interface PromotionComponentProps {}
const PromotionComponent: React.FC<PromotionComponentProps> = props => {
	const intl = useIntl();
	setDocumentTitle(intl.formatMessage({ id: 'page.promotion.setDocumentTitle' }));
	return (
		<div className="pg-promotion-list">
			<PromotionItemComponent />
			<PromotionItemComponent />
			<PromotionItemComponent />
		</div>
	);
};
export const PromotionScreen = React.memo(PromotionComponent, isEqual);
