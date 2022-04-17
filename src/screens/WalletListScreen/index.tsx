import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Decimal, ReactTable } from '../../components';
import { EstimatedValue } from '../../containers/Wallets/EstimatedValue';
import { setDocumentTitle } from '../../helpers';
import {
	walletsFetch,
	currenciesFetch,
	allChildCurrenciesFetch,
	beneficiariesFetch,
	selectWallets,
	selectCurrencies,
	selectAllChildCurrencies,
} from '../../modules';
import NP, { plus } from 'number-precision';
import { toLower, toNumber, toUpper } from 'lodash';
import millify from 'millify';
NP.enableBoundaryChecking(false); // default param is true

export interface WalletItem {
	key: string;
	address?: string;
	currency: string;
	name: string;
	balance?: string;
	locked?: string;
	type: 'fiat' | 'coin';
	fee: number;
	active?: boolean;
	fixed: number;
	iconUrl?: string;
}

export const WalletListScreen = () => {
	const intl = useIntl();

	setDocumentTitle(intl.formatMessage({ id: 'page.body.wallets.setDocumentTitle' }));

	// state
	const [hideSmallBalanceState, setHideSmallBalanceState] = React.useState<boolean>(false);

	// intl
	const withdrawButtonLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw' }), [intl]);
	const depositButtonLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.deposit' }), [intl]);

	// history
	const history = useHistory();

	// dispatch
	const dispatch = useDispatch();
	const dispatchFetchWallets = React.useCallback(() => dispatch(walletsFetch()), [dispatch]);
	const dispatchcFetchCurrencies = React.useCallback(() => dispatch(currenciesFetch()), [dispatch]);
	const dispatchcFetchAllChildCurrencies = React.useCallback(() => dispatch(allChildCurrenciesFetch()), [dispatch]);
	const dispatchFetchBeneficiaries = React.useCallback(() => dispatch(beneficiariesFetch()), [dispatch]);

	// side effect
	React.useEffect(() => {
		dispatchFetchWallets();
		dispatchcFetchCurrencies();
		dispatchcFetchAllChildCurrencies();
		dispatchFetchBeneficiaries();
	}, [dispatchFetchBeneficiaries, dispatchFetchWallets, dispatchcFetchCurrencies, dispatchcFetchAllChildCurrencies]);

	// selector
	const wallets = useSelector(selectWallets);
	const currencies = useSelector(selectCurrencies);
	const allChildCurrencies = useSelector(selectAllChildCurrencies);

	// function
	const findIcon = (code: string): string => {
		const currency = currencies.find((currency: any) => currency.id === code);
		try {
			return require(`../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency !== undefined && currency.icon_url) {
				return currency.icon_url;
			}
			return require('../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	const columns = React.useMemo(
		() => [
			{ Header: intl.formatMessage({ id: 'page.body.wallets.table.coin' }), accessor: 'coin' },
			{ Header: intl.formatMessage({ id: 'page.body.wallets.table.total' }), accessor: 'total' },
			{ Header: intl.formatMessage({ id: 'page.body.wallets.table.available' }), accessor: 'available' },
			{ Header: intl.formatMessage({ id: 'page.body.wallets.table.inOrder' }), accessor: 'in_order' },
			{ Header: intl.formatMessage({ id: 'page.body.wallets.table.action' }), accessor: 'action' },
		],
		[],
	);

	const [searchInputState, setSearchInputState] = React.useState('');

	const convertAmount = (amount: number, fixed: number) => {
		const largeAmountString = (amount: string) => {
			const amountArray = amount.split('');
			const accurency = amountArray.pop();
			const amountString = amountArray.join('');
			return (
				<span>
					<span>{amountString}</span>
					<span className="ml-1" style={{ color: 'var(--yellow)' }}>
						{accurency}
					</span>
				</span>
			);
		};
		return Number(amount) >= 100000000 ? (
			largeAmountString(
				millify(Number(amount), {
					precision: fixed,
				}),
			)
		) : (
			<Decimal fixed={fixed}>{amount}</Decimal>
		);
	};

	const data = wallets
		.filter(wallet => !allChildCurrencies.map(cur => cur.id).includes(wallet.currency))
		.filter(wallet => toLower(wallet.currency).includes(toLower(searchInputState)))
		.map(wallet => {
			const childCurrencies = allChildCurrencies
				.filter(childCurrency => childCurrency.parent_id === wallet.currency)
				.map(childCurrency => childCurrency.id);

			const allChildWallets = wallets.filter(wallet => childCurrencies.includes(wallet.currency));
			const allCurrencies = currencies.filter(currency => childCurrencies.includes(currency.id));

			const totalChildBalances = allChildWallets.map(child => Number(child.balance)).reduce((x, y) => x + y, 0);

			const totalChildLocked = allChildWallets.map(child => Number(child.locked)).reduce((x, y) => x + y, 0);

			const childDepositEnabled = allCurrencies.map(child => child.deposit_enabled);
			const isLeastChildDepositEnabled = childDepositEnabled.find(isEnabled => isEnabled === true);
			const childWithdrawEnabled = allCurrencies.map(child => child.withdrawal_enabled);
			const isLeastChildWithdrawEnabled = childWithdrawEnabled.find(isEnabled => isEnabled === true);
			return {
				...wallet,
				total: plus(toNumber(wallet.balance), toNumber(wallet.locked), totalChildBalances, totalChildLocked),
				balance: plus(toNumber(wallet.balance), totalChildBalances),
				locked: plus(Number(wallet.locked), totalChildLocked),
				isChildDepositEnabled: isLeastChildDepositEnabled,
				isChildWithdrawEnabled: isLeastChildWithdrawEnabled,
			};
		})
		.filter(wallet => (hideSmallBalanceState ? wallet.total > 0 : true))
		.sort((prev_wallet, next_wallet) => {
			//sort desc
			return next_wallet.total - prev_wallet.total;
		})
		.map((wallet, index) => {
			const total = NP.plus(wallet.balance || 0, wallet.locked || 0);
			const currency_icon = (
				<img
					style={{ borderRadius: '50%' }}
					width="30px"
					height="30px"
					src={wallet.iconUrl ? wallet.iconUrl : findIcon(wallet.currency)}
					alt={wallet.currency}
				/>
			);
			const { fixed } = wallets.find(w => w.currency === wallet.currency) || { fixed: 8 };

			const { deposit_enabled, withdrawal_enabled } = currencies.find(
				currency => toLower(currency.id) === toLower(wallet.currency),
			) || { deposit_enabled: false, withdrawal_enabled: false };
			return {
				coin: (
					<div className="d-flex flex-row align-items-center">
						<div>{currency_icon}</div>
						<div className="ml-3">
							<div>{toUpper(wallet.currency)}</div>
							<div>
								<span className="text-secondary">{wallet.name}</span>
							</div>
						</div>
					</div>
				),
				total: <span>{convertAmount(total > 0 ? total : 0, fixed)}</span>,
				available: <span>{convertAmount(wallet.balance > 0 ? wallet.balance : 0, fixed)}</span>,
				in_order: <span className="text-secondary">{convertAmount(wallet.locked > 0 ? wallet.locked : 0, fixed)}</span>,
				action: (
					<div className="text-center">
						<button
							className="deposit-button"
							disabled={!deposit_enabled && !wallet.isChildDepositEnabled}
							style={
								!deposit_enabled && !wallet.isChildDepositEnabled
									? {
											cursor: 'not-allowed',
											color: 'rgba(132, 142, 156, 0.35)',
									  }
									: {}
							}
							onClick={() => history.push({ pathname: '/wallets/deposit/' + toUpper(wallet.currency) })}
						>
							{depositButtonLabel}
						</button>
						<button
							className="withdraw-button"
							style={
								!withdrawal_enabled && !wallet.isChildWithdrawEnabled
									? {
											cursor: 'not-allowed',
											color: 'rgba(132, 142, 156, 0.35)',
									  }
									: {}
							}
							disabled={!withdrawal_enabled && !wallet.isChildWithdrawEnabled}
							onClick={() => history.push({ pathname: '/wallets/withdraw/' + toUpper(wallet.currency) })}
						>
							{withdrawButtonLabel}
						</button>
					</div>
				),
			};
		});

	const renderTable = () => {
		return <ReactTable columns={columns} data={[...data]} />;
	};

	const onChange = e => {
		setSearchInputState(toUpper(e.target.value));
	};

	return (
		<div className="my-3 td-pg-wallets-screen">
			<div className="container-fluid">
				<div className="row td-pg-wallets-screen__header">
					<div className="col-12">
						<EstimatedValue wallets={wallets} />
					</div>
				</div>
				<div className="td-pg-wallets-screen__body" style={[...data].length > 0 ? {} : { paddingBottom: '150px' }}>
					<div className="row mt-3">
						<div className="col-12 d-flex justify-content-between align-items-center flex-row">
							<div className="td-pg-wallets-screen__body__search-input">
								<input
									placeholder={intl.formatMessage({ id: 'page.body.wallets.search.placeholder' })}
									type="text"
									value={searchInputState}
									onChange={e => onChange(e)}
								/>
								<div className="icon-search">
									<svg
										width="18"
										height="18"
										viewBox="0 0 18 18"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"
											fill="#848E9C"
										/>
									</svg>
								</div>
							</div>

							<div className="checkbox-input d-flex flex-row align-items-center">
								<span className="checkbox bounce mr-2">
									<input
										type="checkbox"
										checked={hideSmallBalanceState}
										onChange={e => setHideSmallBalanceState(e.target.checked)}
									/>
									<svg viewBox="0 0 21 21">
										<polyline points="5 10.75 8.5 14.25 16 6"></polyline>
									</svg>
								</span>
								<span className="text-white">
									{intl.formatMessage({ id: 'page.body.plugins.wallet.list.button.hideSmallBalance' })}
								</span>
							</div>
						</div>
					</div>
					<div className="row mt-5">
						<div className="col-12">{renderTable()}</div>
					</div>
				</div>
			</div>
		</div>
	);
};
