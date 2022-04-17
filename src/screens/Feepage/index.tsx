import * as React from 'react';
import { compose } from 'redux';
import { Fee } from '../../containers/FeeTable';

import { injectIntl } from 'react-intl';

import { connect } from 'react-redux';

class FeeStatus extends React.Component {
	public render() {
		return <Fee />;
	}
}

export const FeeScreen = compose(injectIntl, connect(null, null))(FeeStatus) as React.ComponentClass;
