import { toLower, toUpper } from 'lodash';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { WalletItemProps } from '../../../components/WalletItem';
import { VALUATION_PRIMARY_CURRENCY, VALUATION_SECONDARY_CURRENCY } from '../../../constants';
import { estimateUnitValue, estimateValue } from '../../../helpers/estimateValue';
import { IntlProps } from '../../../index';
import {
	currenciesFetch,
	Currency,
	marketsFetch,
	marketsTickersFetch,
	RootState,
	selectCurrencies,
	selectMarkets,
	selectMarketTickers,
	selectUserLoggedIn,
} from '../../../modules';
import { Market, Ticker } from '../../../modules/public/markets';
import { rangerConnectFetch, RangerConnectFetch } from '../../../modules/public/ranger';
import { RangerState } from '../../../modules/public/ranger/reducer';
import { selectRanger } from '../../../modules/public/ranger/selectors';

interface EstimatedValueProps {
	wallets: WalletItemProps[];
	hello: string;
}

interface ReduxProps {
	currencies: Currency[];
	markets: Market[];
	tickers: {
		[key: string]: Ticker;
	};
	rangerState: RangerState;
	userLoggedIn: boolean;
}

interface DispatchProps {
	fetchCurrencies: typeof currenciesFetch;
	fetchMarkets: typeof marketsFetch;
	fetchTickers: typeof marketsTickersFetch;
	rangerConnect: typeof rangerConnectFetch;
}

type Props = DispatchProps & ReduxProps & EstimatedValueProps & IntlProps;

class EstimatedValueContainer extends React.Component<Props> {
	public componentDidMount(): void {
		const {
			currencies,
			fetchCurrencies,
			fetchMarkets,
			fetchTickers,
			markets,
			rangerState: { connected },
			userLoggedIn,
		} = this.props;

		if (markets.length === 0) {
			fetchMarkets();
			fetchTickers();
		}

		if (currencies.length === 0) {
			fetchCurrencies();
		}

		if (!connected) {
			this.props.rangerConnect({ withAuth: userLoggedIn });
		}
	}

	public componentWillReceiveProps(next: Props) {
		const { currencies, fetchCurrencies, fetchMarkets, fetchTickers, markets } = this.props;

		if (next.markets.length === 0 && next.markets !== markets) {
			fetchMarkets();
			fetchTickers();
		}

		if (next.currencies.length === 0 && next.currencies !== currencies) {
			fetchCurrencies();
		}
	}

	// method
	public findIcon = (currencyID: string): string => {
		const { currencies } = this.props;
		const currency = currencies.find((currency: Currency) => currency.id === currencyID);
		try {
			return require(`../../../../node_modules/cryptocurrency-icons/128/color/${currencyID.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}

			return require('../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	public render(): React.ReactNode {
		const { currencies, markets, tickers, wallets } = this.props;
		const estimatedValue = estimateValue(VALUATION_PRIMARY_CURRENCY, currencies, wallets, markets, tickers);
		const currency = currencies.find((currency: Currency) => currency.id === toLower(VALUATION_PRIMARY_CURRENCY)) || {
			name: '',
		};
		return (
			<div className="pg-estimated-value">
				<div className="pg-estimated-value__container">
					<div className="text-white ml-3">{this.translate('page.body.wallets.estimated_value')}</div>
					<div className="mt-3 d-flex flex-row">
						<div className="value-container d-flex flex-row align-items-center">
							<div>
								<img
									style={{ borderRadius: '50%' }}
									width="50px"
									height="50px"
									src={this.findIcon(toLower(VALUATION_PRIMARY_CURRENCY))}
									alt={VALUATION_PRIMARY_CURRENCY}
								/>
							</div>
							<div className="ml-3">
								<div>{currency?.name}</div>
								<div>
									<span className="value">{estimatedValue}</span>
									<span className="value-sign ml-3">{toUpper(VALUATION_PRIMARY_CURRENCY)}</span>
								</div>
							</div>
						</div>
						{VALUATION_SECONDARY_CURRENCY && this.renderSecondaryCurrencyValuation(estimatedValue)}
					</div>
				</div>
			</div>
		);
	}

	public translate = (key: string) => this.props.intl.formatMessage({ id: key });

	private renderSecondaryCurrencyValuation = (estimatedValue: string) => {
		const { currencies, markets, tickers } = this.props;
		const estimatedValueSecondary = estimateUnitValue(
			VALUATION_SECONDARY_CURRENCY,
			VALUATION_PRIMARY_CURRENCY,
			+estimatedValue,
			currencies,
			markets,
			tickers,
		);
		const currency = currencies.find((currency: Currency) => currency.id === toLower(VALUATION_SECONDARY_CURRENCY)) || {
			name: '',
		};
		return (
			<div className="value-container d-flex flex-row align-items-center">
				<div>
					<img
						width="50px"
						height="50px"
						src={this.findIcon(toLower(VALUATION_SECONDARY_CURRENCY))}
						alt={VALUATION_SECONDARY_CURRENCY}
					/>
				</div>
				<div className="ml-3">
					<div>{currency?.name}</div>
					<div>
						<span className="value">{estimatedValueSecondary}</span>
						<span className="value-sign ml-3">{toUpper(VALUATION_SECONDARY_CURRENCY)}</span>
					</div>
				</div>
			</div>
		);
	};
}

const mapStateToProps = (state: RootState): ReduxProps => ({
	currencies: selectCurrencies(state),
	markets: selectMarkets(state),
	tickers: selectMarketTickers(state),
	rangerState: selectRanger(state),
	userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
	fetchCurrencies: () => dispatch(currenciesFetch()),
	fetchMarkets: () => dispatch(marketsFetch()),
	fetchTickers: () => dispatch(marketsTickersFetch()),
	rangerConnect: (payload: RangerConnectFetch['payload']) => dispatch(rangerConnectFetch(payload)),
});

// tslint:disable-next-line:no-any
export const EstimatedValue = injectIntl(connect(mapStateToProps, mapDispatchToProps)(EstimatedValueContainer)) as any;
