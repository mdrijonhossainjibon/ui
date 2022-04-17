import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { DepositAddress, DepositHistory, DepositInfo } from '../../containers';
import { setDocumentTitle } from '../../helpers';
import {
	allChildCurrenciesFetch,
	beneficiariesFetch,
	currenciesFetch,
	Currency,
	depositHistoryFetch,
	marketsFetch,
	selectChildCurrencies,
	selectCurrencies,
	selectWallets,
	walletsChildCurrenciesFetch,
	walletsFetch,
} from '../../modules';
import { useIntl } from 'react-intl';

export const DepositScreen = () => {
	const intl = useIntl();
	setDocumentTitle(intl.formatMessage({ id: 'page.body.wallets.tabs.deposit' }));
	const { currency_id } = useParams<{ currency_id: string }>();

	const [selectedCurrencyID, setSelectedCurrencyID] = React.useState('');

	// selectors
	const currencies = useSelector(selectCurrencies);
	const wallets = useSelector(selectWallets) || [];
	const childCurrencies = useSelector(selectChildCurrencies);
	const dispatch = useDispatch();
	const dispatchFetchCurrencies = React.useCallback(() => dispatch(currenciesFetch()), [dispatch]);
	const dispatchFetchWallets = React.useCallback(() => dispatch(walletsFetch()), [dispatch]);
	const dispatchFetchChildCurrencies = React.useCallback(
		() => dispatch(walletsChildCurrenciesFetch({ currency: currency_id })),
		[dispatch, currency_id],
	);
	const dispatchFetchAllChildCurrencies = React.useCallback(() => dispatch(allChildCurrenciesFetch()), [dispatch]);
	const dispatchFetchMarkets = React.useCallback(() => dispatch(marketsFetch()), [dispatch]);
	const dispatchFetchHistories = React.useCallback(() => dispatch(depositHistoryFetch({ currency: currency_id })), [
		dispatch,
		currency_id,
	]);
	const dispatchFetchBeneficiaries = React.useCallback(() => dispatch(beneficiariesFetch()), [dispatch]);

	const history = useHistory();

	// method
	const findIcon = (currencyID: string): string => {
		// tslint:disable-next-line:no-shadowed-variable
		const currency = currencies.find((currency: Currency) => currency.id === currencyID);
		try {
			return require(`../../../node_modules/cryptocurrency-icons/128/color/${currencyID.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}

			return require('../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	// side effects
	React.useEffect(() => {
		dispatchFetchChildCurrencies();
		dispatchFetchMarkets();
		dispatchFetchCurrencies();
		dispatchFetchWallets();
		dispatchFetchChildCurrencies();
		dispatchFetchAllChildCurrencies();
		dispatchFetchHistories();
		dispatchFetchBeneficiaries();
	}, [
		currency_id,
		dispatchFetchMarkets,
		dispatchFetchCurrencies,
		dispatchFetchWallets,
		dispatchFetchChildCurrencies,
		dispatchFetchAllChildCurrencies,
		dispatchFetchHistories,
		dispatchFetchBeneficiaries,
	]);

	return (
		<div className="container-fluid mt-3" id="deposit-screen">
			<div className="d-flex flex-wrap deposit-container">
				<div className="col-md-6 p-0">
					<DepositInfo
						currency_id={currency_id}
						selectedCurrencyID={selectedCurrencyID ? selectedCurrencyID : currency_id}
						currency_icon={findIcon(currency_id.toLowerCase())}
						changeCurrency={setSelectedCurrencyID}
						wallets={wallets}
					/>
				</div>
				<div className="col-md-6 p-0 deposit-container__address">
					<DepositAddress
						currency_id={currency_id}
						selectedCurrencyID={selectedCurrencyID ? selectedCurrencyID : currency_id}
						changeCurrency={setSelectedCurrencyID}
						currencyIcon={findIcon(currency_id.toLowerCase())}
						childCurrencies={childCurrencies}
					/>
				</div>
			</div>
			<div className="row mt-5 deposit-history">
				<div className="col-12">
					<DepositHistory currency_id={currency_id} />
				</div>
			</div>
			<div style={{ position: 'fixed', top: '10%', left: '2rem' }}>
				<img
					style={{ cursor: 'pointer' }}
					src="https://img.icons8.com/fluent/48/000000/circled-left.png"
					onClick={() => history.push({ pathname: '/wallets' })}
					alt="Back"
				/>
			</div>
		</div>
	);
};
