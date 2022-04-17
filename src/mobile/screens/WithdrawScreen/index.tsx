import { getTabName } from 'helpers';
import { WalletWithdrawBody } from 'mobile/components';
import {
	currenciesFetch,
	selectChildCurrencies,
	selectCurrencies,
	selectWallets,
	selectWalletsWithdrawLimit,
	walletsAddressFetch,
	walletsChildCurrenciesFetch,
	walletsFetch,
	walletsWithdrawLimitFetch,
} from 'modules';
import Tabs, { TabPane } from 'rc-tabs';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import VerifySVG from './verify.svg';

const BackSVG = (
	<svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M18 5H3.83L7.41 1.41L6 0L0 6L6 12L7.41 10.59L3.83 7H18V5Z" fill="white" />
	</svg>
);
const HistorySVG = (
	<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M18 7.12H11.22L13.96 4.3C11.23 1.6 6.81 1.5 4.08 4.2C1.35 6.91 1.35 11.28 4.08 13.99C6.81 16.7 11.23 16.7 13.96 13.99C15.32 12.65 16 11.08 16 9.1H18C18 11.08 17.12 13.65 15.36 15.39C11.85 18.87 6.15 18.87 2.64 15.39C-0.859996 11.92 -0.889996 6.28 2.62 2.81C6.13 -0.66 11.76 -0.66 15.27 2.81L18 0V7.12ZM9.5 5V9.25L13 11.33L12.28 12.54L8 10V5H9.5Z"
			fill="white"
		/>
	</svg>
);

const WithdrawSubHeader = props => {
	const history = useHistory();
	const intl = useIntl();

	return (
		<div className="td-mobile-screen-withdraw__header">
			<div className="td-mobile-screen-withdraw__header__back" onClick={() => history.goBack()}>
				{BackSVG}
			</div>
			<h3 className="td-mobile-wallet-detail__header__title">
				{intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw' })}
			</h3>
			<Link className="td-mobile-wallet-detail__header__history" to={`/wallets/history`}>
				{intl.formatMessage({ id: 'page.mobile.wallets.currency.withdraw.history' })} {HistorySVG}
			</Link>
		</div>
	);
};

const WithdrawBody = props => {
	const intl = useIntl();
	const history = useHistory();
	const dispatch = useDispatch();
	const { currency } = props;

	const isWalletsWithdrawLimit = useSelector(selectWalletsWithdrawLimit);
	const wallets = useSelector(selectWallets);
	const currencies = useSelector(selectCurrencies);
	const childs = useSelector(selectChildCurrencies);
	const childIDs = childs.map(child => child.id);
	const listCurrencies = currencies.filter(
		cur => (childIDs.includes(cur.id) || cur.id === currency) && cur.withdrawal_enabled === true,
	);

	const listCurrenciesWallets = listCurrencies.map(currency => {
		const wallet = wallets.find(wallet => wallet.currency === currency.id);

		return {
			id: currency.id,
			currency: currency.id,
			name: currency.name,
			deposit_enabled: currency.deposit_enabled,
			deposit_fee: currency.deposit_fee,
			balance: wallet?.balance,
			locked: wallet?.locked,
			address: wallet?.address,
			type: wallet?.type,
			blockchain_key: currency.blockchain_key,
			icon_url: currency.icon_url,
			explorerAddress: wallet?.explorerAddress,
			explorerTransaction: wallet?.explorerTransaction,
			fee: wallet?.fee,
			fixed: wallet?.fixed,
		};
	});

	const handleChangeTab = (currency: string) => {
		dispatch(walletsAddressFetch({ currency }));
	};

	React.useEffect(() => {
		dispatch(walletsAddressFetch({ currency: currency }));
	}, [currency, dispatch]);

	React.useEffect(() => {
		dispatch(walletsWithdrawLimitFetch());
	}, []);

	const renderWithdrawLimit = () => {
		return (
			<div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center px-5 p-5">
				<div>
					<img src={VerifySVG} alt="kyc" />
				</div>
				<div className="mt-4">
					<h5 className="text-center lh-3">
						{intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.require.kyc' })}
					</h5>
				</div>
				<div>
					<button
						onClick={() => {
							history.push('/profile/kyc');
						}}
						className="btn px-4 py-2"
						style={{ backgroundColor: 'var(--yellow)', fontSize: '1.3rem' }}
					>
						{intl.formatMessage({ id: 'page.body.profile.verification.verify' })}
					</button>
				</div>
			</div>
		);
	};

	return (
		<div className="td-mobile-screen-withdraw__body">
			<div className="td-mobile-screen-withdraw__body__tabs">
				<div className="react-tabs">
					{isWalletsWithdrawLimit ? (
						renderWithdrawLimit()
					) : (
						<Tabs defaultActiveKey={listCurrenciesWallets[0]?.id} onChange={handleChangeTab}>
							{listCurrenciesWallets.map(wallet => (
								<TabPane tab={getTabName(wallet.blockchain_key || '')} key={wallet.id || ''}>
									<WalletWithdrawBody parent_currency={currency} currency={wallet.id} wallet={wallet} />
								</TabPane>
							))}
						</Tabs>
					)}
				</div>
			</div>
		</div>
	);
};

export const WithdrawMobileScreen = () => {
	const { currency = '' } = useParams<{ currency: string }>();
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(currenciesFetch());
		dispatch(walletsFetch());
	}, [dispatch]);
	React.useEffect(() => {
		dispatch(walletsChildCurrenciesFetch({ currency: currency }));
	}, [currency, dispatch]);

	return (
		<div className="td-mobile-screen-withdraw">
			<WithdrawSubHeader currency={currency} />
			<WithdrawBody currency={currency} />
		</div>
	);
};
