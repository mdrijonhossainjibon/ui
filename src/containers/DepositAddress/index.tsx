import Tabs, { TabPane } from 'rc-tabs';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useIntl } from 'react-intl';
import { LockIcon } from '../../assets/images/LockIcon';
import { DepositBody } from '../../components';
import { getTabName } from '../../helpers';
import {
	ChildCurrency,
	selectChildCurrenciesLoading,
	selectCurrencies,
	selectWalletAddress,
	selectWallets,
	walletsAddressFetch,
	walletsFetch,
} from '../../modules';
import UdonIconGif from '../../assets/images/icon-udonex.gif';
import { toLower, toUpper } from 'lodash';
interface DepositAddressProps {
	currency_id: string;
	selectedCurrencyID: string;
	currencyIcon: string;
	childCurrencies: ChildCurrency[];
	changeCurrency: (selectedCurrencyID: string) => void;
}

export const DepositAddress: React.FC<DepositAddressProps> = (props: DepositAddressProps) => {
	const { currency_id, selectedCurrencyID, childCurrencies, changeCurrency } = props;
	const intl = useIntl();
	const [generateAddressTriggered, setGenerateAddressTriggered] = React.useState(false);
	const dispatch = useDispatch();
	const isFetchChildCurrenciesLoading = useSelector(selectChildCurrenciesLoading);
	const selectedWalletAddress = useSelector(selectWalletAddress);
	const wallets = useSelector(selectWallets) || [];
	const currencies = useSelector(selectCurrencies) || [];
	const mainCurrency = currencies.find(cur => cur.id.toLowerCase() === currency_id.toLowerCase()) || {
		blockchain_key: '',
		deposit_enabled: false,
	};
	const selectedCurrency = currencies.find(cur => cur.id.toLowerCase() === selectedCurrencyID.toLowerCase()) || {
		blockchain_key: '',
		deposit_enabled: false,
	};

	const mainWallet = wallets.find(item => item.currency === currency_id.toLowerCase()) || {
		name: '',
		currency: '',
		balance: '',
		type: '',
		address: '',
	};
	const childWallets = childCurrencies.map(childCurrency => {
		return {
			...childCurrency,
			wallet: wallets.find(item => item.currency === childCurrency.id),
		};
	});
	const isAccountActivated = mainWallet.type === 'fiat' || mainWallet.balance;

	const handleGenerateAddress = (wallet: { address?: string; type?: string; currency: string }) => {
		if (!wallet.address && wallets.length && wallet.type !== 'fiat') {
			dispatch(walletsAddressFetch({ currency: wallet.currency }));
			dispatch(walletsFetch());
			setGenerateAddressTriggered(true);
		}
	};

	React.useEffect(() => {
		dispatch(walletsAddressFetch({ currency: currency_id }));
	}, [currency_id, dispatch]);

	React.useEffect(() => {
		dispatch(walletsAddressFetch({ currency: selectedCurrencyID }));
	}, [selectedCurrencyID, dispatch]);

	React.useEffect(() => {
		dispatch(walletsAddressFetch({ currency: selectedCurrencyID }));
	}, [dispatch, selectedCurrencyID]);

	const Loading = () => {
		return (
			<div hidden={!isFetchChildCurrenciesLoading && selectedWalletAddress !== ''} className="react-tabs__loading">
				<img src={UdonIconGif} alt="loading" />
			</div>
		);
	};

	const renderChildWallets = () => {
		return childWallets.map((childWallet, index) => {
			const currency = currencies.find(cur => toLower(cur.id) === toLower(childWallet.id));
			if (currency && currency.deposit_enabled === false) return null;
			return (
				<TabPane tab={getTabName(childWallet.blockchain_key)} key={childWallet.id}>
					<div style={{ position: 'relative', width: '100%', height: '100%' }}>
						{childWallet.wallet ? (
							<DepositBody
								wallet_index={index + 1}
								wallet={childWallet.wallet}
								isAccountActivated={isAccountActivated}
								handleGenerateAddress={() => {
									if (childWallet.wallet) {
										handleGenerateAddress({
											address: childWallet.wallet.address,
											type: childWallet.wallet.type,
											currency: childWallet.wallet.currency,
										});
									}
								}}
								generateAddressTriggered={generateAddressTriggered}
							/>
						) : null}
						<div hidden={childWallet.deposit_enabled} className="blur-disabled">
							<LockIcon className="pg-blur__content__icon" />
							{intl.formatMessage({
								id: 'page.body.wallets.tabs.deposit.disabled.message',
							})}
						</div>
						<Loading />
						<div className="row mt-5">{renderNote(childWallet.id)}</div>
					</div>
				</TabPane>
			);
		});
	};

	const renderParentWallet = () => {
		const currency = currencies.find(cur => toLower(cur.id) === toLower(mainWallet.currency));
		if (!mainWallet || (currency && currency.deposit_enabled === false)) {
			return null;
		}

		return (
			<TabPane tab={getTabName(mainCurrency.blockchain_key || '')} key={currency_id}>
				<div style={{ position: 'relative', width: '100%', height: '100%' }}>
					<DepositBody
						wallet_index={0}
						wallet={mainWallet}
						isAccountActivated={isAccountActivated}
						handleGenerateAddress={() =>
							handleGenerateAddress({
								address: mainWallet.address,
								type: mainWallet.type,
								currency: mainWallet.currency,
							})
						}
						generateAddressTriggered={generateAddressTriggered}
					/>
					<div hidden={selectedCurrency.deposit_enabled} className="blur-disabled">
						<LockIcon className="pg-blur__content__icon" />
						{intl.formatMessage({
							id: 'page.body.wallets.tabs.deposit.disabled.message',
						})}
					</div>
					<Loading />
					<div className="row mt-5">{renderNote(mainWallet.currency)}</div>
				</div>
			</TabPane>
		);
	};

	const renderNote = (currency: string) => {
		return (
			<div className="col-12 d-flex justify-content-between">
				<p className="pr-5">
					<strong>Send only {toUpper(currency)} to this deposit address.</strong>
					<br />
					Sending coin or token other than {toUpper(currency)} to this address may result in the loss of your deposit.
				</p>
			</div>
		);
	};

	return (
		<div id="deposit-address">
			<div
				className="container d-flex flex-column justify-content-between"
				style={{ padding: '30px', borderRadius: '5px', height: '100%', fontSize: '1.3rem' }}
			>
				<div>
					<div className="row">
						<div className="col-12 d-flex justify-content-between">
							<h4>{intl.formatMessage({ id: 'page.body.wallet.depositNetwork' })}</h4>
							<span>{intl.formatMessage({ id: 'page.body.wallet.avgArrivalTime' }, { min: 5, max: 30 })}</span>
						</div>
					</div>
					<div className="row">
						<div className="col-12">
							<div className="react-tabs">
								<Tabs defaultActiveKey={currency_id} onChange={changeCurrency}>
									{renderParentWallet()}
									{renderChildWallets()}
								</Tabs>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
