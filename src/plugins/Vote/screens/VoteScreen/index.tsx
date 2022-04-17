import { setDocumentTitle } from 'helpers';
import * as React from 'react';
import { VoteHistory, VoteNews } from '../../containers';
import { useIntl } from 'react-intl';
// tslint:disable-next-line: no-empty-interface
interface VoteScreenProps {}

export const VoteScreen: React.FC<VoteScreenProps> = ({}) => {
	const intl = useIntl();
	setDocumentTitle(intl.formatMessage({ id: 'page.vote.setDocument' }));
	return (
		<div className="pg-vote mt-3">
			<VoteNews />
			<VoteHistory />
		</div>
	);
};
