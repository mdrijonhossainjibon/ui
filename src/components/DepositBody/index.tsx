// import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { LockIcon } from '../../assets/images/LockIcon';
import { formatCCYAddress } from '../../helpers';
import { alertPush, selectCurrencies, selectUserInfo, selectWalletAddress } from '../../modules';
import { DepositCrypto } from '../DepositCrypto';
import { DepositFiat } from '../DepositFiat';

const BlurDisable = styled.div`
	position: absolute;
	content: '';
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	align-items: center;
	-webkit-backdrop-filter: blur(10px);
	backdrop-filter: blur(10px);
	background: var(--body-background-color-level-6);
	display: flex;
	height: 100%;
	justify-content: center;
	z-index: 10;
	flex-direction: column;
`;

const WalletDepositBodyComponent = props => {
	const intl = useIntl();
	const currencies = useSelector(selectCurrencies);
	const user = useSelector(selectUserInfo);
	const selectedWalletAddress = useSelector(selectWalletAddress);
	const dispatch = useDispatch();

	const label = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.address' }), [intl]);
	const handleOnCopy = () => {
		dispatch(alertPush({ message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success' }));
	};

	React.useEffect(() => {
		props.handleGenerateAddress();
	}, []);

	const renderDeposit = (isAccountActivated: boolean) => {
		const { addressDepositError, wallet } = props;

		const translate = (id: string) => intl.formatMessage({ id });

		const currencyItem = (currencies && currencies.find(item => item.id === wallet.currency)) || {
			min_confirmations: 6,
			min_deposit_amount: 6,
			deposit_fee: 6,
			deposit_enabled: false,
		};

		const textDepositFee = `${intl.formatMessage(
			{ id: 'page.body.wallets.tabs.deposit.ccy.message.depositfee' },
			{ deposit_fee: Number(currencyItem.deposit_fee) ?? 'Unavailble', currency: '%' },
		)}`;

		const error = addressDepositError
			? intl.formatMessage({ id: addressDepositError.message[0] })
			: intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.error' });

		const walletAddress = formatCCYAddress(wallet.currency, selectedWalletAddress);
		const buttonLabel = `
              ${translate('page.body.wallets.tabs.deposit.ccy.button.generate')} ${wallet.currency.toUpperCase()} ${translate(
			'page.body.wallets.tabs.deposit.ccy.button.address',
		)}`;

		const title = intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.fiat.message1' });

		const description = intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.fiat.message2' });

		// const blurCryptoClassName = classnames('pg-blur-deposit-crypto', {
		//   'pg-blur-deposit-crypto--active': isAccountActivated,
		// });

		if (wallet.type === 'coin') {
			return (
				<div style={{ position: 'relative' }}>
					{currencyItem && !currencyItem.deposit_enabled ? (
						<BlurDisable>
							<LockIcon className="pg-blur__content__icon" />
							{translate('page.body.wallets.tabs.deposit.disabled.message')}
						</BlurDisable>
					) : null}

					<DepositCrypto
						wallet_index={props.wallet_index}
						data={walletAddress}
						handleOnCopy={handleOnCopy}
						error={error}
						textDepositFee={textDepositFee}
						disabled={walletAddress === ''}
						copiableTextFieldText={`${wallet.currency.toUpperCase()} ${label}`}
						copyButtonText={intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.button' })}
						handleGenerateAddress={props.handleGenerateAddress}
						buttonLabel={buttonLabel}
						isAccountActivated={isAccountActivated}
					/>
				</div>
			);
		} else {
			return (
				<React.Fragment>
					{currencyItem && !currencyItem.deposit_enabled ? (
						<BlurDisable>
							<LockIcon className="pg-blur__content__icon" />
							{translate('page.body.wallets.tabs.deposit.disabled.message')}
						</BlurDisable>
					) : null}
					<DepositFiat title={title} description={description} uid={user ? user.uid : ''} />
				</React.Fragment>
			);
		}
	};

	return <div className="cr-wallet-deposit-body">{renderDeposit(props.isAccountActivated)}</div>;
};

const DepositBody = React.memo(WalletDepositBodyComponent);

export { DepositBody };
