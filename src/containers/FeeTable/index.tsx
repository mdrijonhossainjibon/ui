import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { FeeList } from '../../components/FeeList';
import { IntlProps } from '../../index';
import { currenciesFetch, Currency, RootState, selectCurrencies } from '../../modules';

interface ReduxProps {
	currencies: Currency[];
}

interface DispatchProps {
	fetchCurrencies: typeof currenciesFetch;
}

type Props = ReduxProps & IntlProps & DispatchProps;

class FeeTable extends React.Component<Props> {
	public UNSAFE_componentWillMount() {
		const { currencies } = this.props;

		if (currencies.length === 0) {
			this.props.fetchCurrencies();
		}
	}

	public render() {
		const { currencies } = this.props;

		return (
			<div className="container">
				<h1>Udonex Coin List</h1>
				<FeeList currencies={currencies} />
			</div>
		);
	}
}

const mapStateToProps = (state: RootState): ReduxProps => ({
	currencies: selectCurrencies(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
	fetchCurrencies: () => dispatch(currenciesFetch()),
});

export const Fee = injectIntl(connect(mapStateToProps, mapDispatchToProps)(FeeTable)) as any;
