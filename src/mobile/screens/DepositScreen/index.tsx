import { Blur, DepositFiat, QRCode } from 'components';
import { copy, formatCCYAddress, getTabName } from 'helpers';
import { toLower } from 'lodash';
import toUpper from 'lodash/toUpper';
import {
	alertPush,
	currenciesFetch,
	selectChildCurrencies,
	selectCurrencies,
	selectUserInfo,
	selectWalletAddress,
	selectWallets,
	walletsAddressFetch,
	walletsChildCurrenciesFetch,
	walletsFetch,
} from 'modules';
import Tabs, { TabPane } from 'rc-tabs';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import UdonIconGif from '../../../assets/images/icon-udonex.gif';

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

const DepositSubHeader = props => {
	const history = useHistory();
	const intl = useIntl();

	return (
		<div className="td-mobile-screen-deposit__header">
			<div className="td-mobile-screen-deposit__header__back" onClick={() => history.goBack()}>
				{BackSVG}
			</div>
			<h3 className="td-mobile-wallet-detail__header__title">
				{intl.formatMessage({ id: 'page.body.wallets.tabs.deposit' })}
			</h3>
			<Link className="td-mobile-wallet-detail__header__history" to={`/wallets/history`}>
				{intl.formatMessage({ id: 'page.mobile.wallets.currency.deposit.subHeader.history' })} {HistorySVG}
			</Link>
		</div>
	);
};

const TabBody = props => {
	const { currency } = props;
	const intl = useIntl();
	const user = useSelector(selectUserInfo);
	const selectedWalletAddress = useSelector(selectWalletAddress);
	const wallets = useSelector(selectWallets);
	const currencies = useSelector(selectCurrencies);
	const dispatch = useDispatch();
	React.useEffect(() => {
		dispatch(walletsAddressFetch({ currency: currency }));
	}, [currency, dispatch]);

	const QR_SIZE = 118;
	const walletAddress = formatCCYAddress(currency, selectedWalletAddress);
	const wallet = wallets.find(wallet => wallet.currency === currency) || {
		type: 'fiat',
		balance: undefined,
		address: undefined,
	};
	const isAccountActivated = wallet.type === 'fiat' || wallet.balance;

	const size = QR_SIZE;
	const doCopy = () => {
		copy(`copy_deposit_${currency}`);
		if (walletAddress) {
			dispatch(
				alertPush({
					message: ['page.body.wallets.tabs.deposit.ccy.message.success'],
					type: 'success',
				}),
			);
		}
	};
	const title = intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.fiat.message1' });
	const description = intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.fiat.message2' });
	const currencyItem = currencies.find(cur => cur.id === currency);

	const handleGenerateAddress = () => {
		if (!wallet.address && wallets.length && wallet.type !== 'fiat') {
			dispatch(walletsAddressFetch({ currency: currency }));
			dispatch(walletsFetch());
		}
	};

	React.useEffect(() => {
		dispatch(walletsAddressFetch({ currency: currency }));
	}, [dispatch]);

	const Loading = () => {
		return (
			<div className="react-tabs__loading">
				<img src={UdonIconGif} alt="loading" />
			</div>
		);
	};

	if (!selectedWalletAddress)
		return (
			<div className="d-flex justify-content-center">
				<Loading />
			</div>
		);
	else if (isAccountActivated) {
		if (wallet && wallet.type === 'coin') {
			return (
				<div className="tab-body mr-3 ml-3" hidden={!walletAddress}>
					<div className="py-3 d-flex flew-row justify-content-between align-items-center">
						<div>
							<DepositNotes currency={currency} />
						</div>
						<div>
							<QRCode dimensions={size} data={walletAddress} />
						</div>
					</div>
					<div className="py-3 deposit-address">
						<div className="deposit-address__title">
							{intl.formatMessage({ id: 'page.mobile.wallet.deposit.generate' })}
						</div>
						<input readOnly id={`copy_deposit_${currency}`} className="deposit-address__text" value={walletAddress} />

						<div className="d-flex justify-content-center">
							<button onClick={doCopy} className="deposit-address__copy-btn mt-3">
								{intl.formatMessage({ id: 'page.mobile.copy.text' })}
							</button>
						</div>
					</div>
					<div hidden={currencyItem && currencyItem.deposit_enabled} className="deposit-disabled">
						<Blur text="Deposit is disabled" />
					</div>
				</div>
			);
		} else {
			return <DepositFiat title={title} description={description} uid={user ? user.uid : ''} />;
		}
	} else {
		return (
			<div className="react-tabs__body" hidden={!walletAddress}>
				<div className="py-3 deposit-address">
					<button onClick={handleGenerateAddress} className="deposit-address__copy-btn mt-3">
						{intl.formatMessage({ id: 'page.mobile.wallet.deposit.generate' })}
					</button>
				</div>
			</div>
		);
	}
};

const DepositBody = props => {
	const dispatch = useDispatch();

	const { currency } = props;

	const wallets = useSelector(selectWallets);
	const currencies = useSelector(selectCurrencies);
	const childs = useSelector(selectChildCurrencies);
	const childIDs = childs.map(child => child.id);
	const listCurrencies = currencies.filter(
		cur => (childIDs.includes(cur.id) || cur.id === currency) && cur.deposit_enabled === true,
	);

	const listCurrenciesWallets = listCurrencies.map(currency => {
		const wallet = wallets.find(wallet => wallet.currency === currency.id);
		return {
			id: currency.id,
			name: currency.name,
			deposit_enabled: currency.deposit_enabled,
			deposit_fee: currency.deposit_fee,
			balance: wallet?.balance,
			address: wallet?.address,
			type: wallet?.type,
			blockchain_key: currency.blockchain_key,
			icon_url: currency.icon_url,
		};
	});

	const handleChangeTab = (currency: string) => {
		dispatch(walletsAddressFetch({ currency }));
	};

	React.useEffect(() => {
		dispatch(walletsAddressFetch({ currency: currency }));
	}, [currency, dispatch]);

	return (
		<div className="td-mobile-screen-deposit__body">
			<div className="td-mobile-screen-deposit__body__tabs">
				<div className="react-tabs">
					<Tabs defaultActiveKey={listCurrenciesWallets[0]?.id} onChange={handleChangeTab}>
						{listCurrenciesWallets.map(wallet => (
							<TabPane tab={getTabName(wallet.blockchain_key || '')} key={wallet.id || ''}>
								<TabBody currency={wallet.id} />
							</TabPane>
						))}
					</Tabs>
				</div>
			</div>
		</div>
	);
};

const DepositNotes = props => {
	const intl = useIntl();
	const { currency } = props;
	const currencies = useSelector(selectCurrencies);

	const { min_deposit_amount, deposit_fee } = currencies.find(cur => toLower(cur.id) === toLower(currency)) || {
		min_deposit_amount: null,
		deposit_fee: null,
	};
	return (
		<div className="td-mobile-screen-deposit__notes">
			<div className="td-mobile-screen-deposit__notes__body text-white">
				<p>
					{intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.confirmation' }, { confirmations: 1 })}
				</p>
				<p>
					{intl.formatMessage(
						{ id: 'page.body.wallets.tabs.deposit.ccy.message.mindeposit' },
						{
							min_deposit_amount: (100 * Number(min_deposit_amount)) / (100 - Number(deposit_fee)) ?? 'Unavailble',
							currency: toUpper(currency),
						},
					)}
				</p>
				<p>
					{intl.formatMessage(
						{ id: 'page.body.wallets.tabs.deposit.ccy.message.depositfee' },
						{ deposit_fee: Number(deposit_fee) ?? 'Unavailble', currency: '%' },
					)}
				</p>
				<p>
					<strong style={{ color: '#FF6400' }}>
						{intl.formatMessage({ id: 'page.mobile.wallets.currency.deposit.note.text1' })}
					</strong>
					{intl.formatMessage(
						{ id: 'page.mobile.wallets.currency.deposit.note.text2' },
						{ currency: toUpper(currency) },
					)}
				</p>
			</div>
		</div>
	);
};

export const DepositMobileScreen = () => {
	const { currency = '' } = useParams<{ currency: string }>();
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(walletsAddressFetch({ currency: currency }));
	}, [currency, dispatch]);

	React.useEffect(() => {
		dispatch(currenciesFetch());
		dispatch(walletsFetch());
	}, [dispatch]);
	React.useEffect(() => {
		dispatch(walletsChildCurrenciesFetch({ currency: currency }));
	}, [currency, dispatch]);

	return (
		<div className="td-mobile-screen-deposit">
			<DepositSubHeader currency={currency} />
			<DepositBody currency={currency} />
		</div>
	);
};
