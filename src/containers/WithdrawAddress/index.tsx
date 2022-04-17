import { User } from '@sentry/browser';
import { message } from 'antd';
import { toLower } from 'lodash';
import Tabs, { TabPane } from 'rc-tabs';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ModalWithdrawConfirmation, ModalWithdrawSubmit, Withdraw, WithdrawProps } from '..';
import UdonIconGif from '../../assets/images/icon-udonex.gif';
import { LockIcon } from '../../assets/images/LockIcon';
import { WalletItemProps } from '../../components';
import { getTabName } from '../../helpers';
import { useEthFeeFetch } from '../../hooks';
import {
	Beneficiary,
	ChildCurrency,
	Currency,
	ETHFee,
	selectChildCurrenciesLoading,
	selectETHFee,
	selectWalletsWithdrawLimit,
	selectWithdrawLimitRemains,
	Wallet,
	walletsAddressFetch,
	walletsWithdrawCcyFetch,
	withdrawLimitFetchRemains,
} from '../../modules';
import VerifySVG from './verify.svg';

interface WithdrawAddressProps {
	currency_id: string;
	wallets: Wallet[];
	currencies: Currency[];
	user: User;
	ethFee: ETHFee[];
	childCurrencies: ChildCurrency[];
}

const defaultBeneficiary: Beneficiary = {
	id: 0,
	currency: '',
	name: '',
	state: '',
	data: {
		address: '',
	},
};

interface WalletsState {
	otpCode: string;
	amount: string;
	beneficiary: Beneficiary;
	withdrawSubmitModal: boolean;
	withdrawConfirmModal: boolean;
	withdrawCheckModal: boolean;
	bchAddress?: string;
	filteredWallets?: WalletItemProps[] | null;
	tab: string;
	withdrawDone: boolean;
	total: string;
	currentTabIndex: number;
	generateAddressTriggered: boolean;
}

export const WithdrawAddress: React.FC<WithdrawAddressProps> = (props: WithdrawAddressProps) => {
	const { currency_id, wallets, currencies, childCurrencies } = props;
	const [currencyState, setCurrencyState] = React.useState(currency_id);
	const intl = useIntl();
	const dispatch = useDispatch();
	const history = useHistory();

	React.useEffect(() => {
		setCurrencyState(currency_id);
	}, [currency_id]);

	useEthFeeFetch();

	React.useEffect(() => {
		dispatch(
			withdrawLimitFetchRemains({
				currency_id: currencyState,
			}),
		);
	}, [currencyState]);

	// selectors
	const ethFees = useSelector(selectETHFee);
	const isWalletsWithdrawLimit = useSelector(selectWalletsWithdrawLimit);
	const isFetchChildCurrenciesLoading = useSelector(selectChildCurrenciesLoading);
	console.log('isFetchChildCurrenciesLoading: ', isFetchChildCurrenciesLoading);

	const { payload } = useSelector(selectWithdrawLimitRemains);
	const { remains, limit } = payload;
	// state
	const [withdrawState, setState] = React.useState<WalletsState>({
		withdrawSubmitModal: false,
		withdrawConfirmModal: false,
		withdrawCheckModal: false,
		otpCode: '',
		amount: '',
		beneficiary: defaultBeneficiary,
		tab: intl.formatMessage({ id: 'page.body.wallets.tabs.deposit' }),
		withdrawDone: false,
		total: '',
		currentTabIndex: 0,
		generateAddressTriggered: false,
	});

	// side effects
	React.useEffect(() => {
		dispatch(walletsAddressFetch({ currency: currency_id }));
	}, [dispatch, currency_id]);

	const childWallets = childCurrencies.map(childCurrency => {
		return {
			...childCurrency,
			wallet: wallets.find(item => item.currency === childCurrency.id) || {
				name: '',
				currency: '',
				balance: '',
				type: 'coin',
				address: '',
				fee: 0,
				explorerTransaction: '',
				explorerAddress: '',
				fixed: 0,
			},
		};
	});

	const wallet = wallets.find(item => item.currency === currency_id.toLowerCase()) || {
		name: '',
		currency: '',
		balance: '',
		type: 'coin',
		address: '',
		fee: 0,
		explorerTransaction: '',
		explorerAddress: '',
		fixed: 0,
	};
	const selectedWallet = wallets.find(item => item.currency === currencyState.toLowerCase()) || {
		name: '',
		currency: '',
		balance: '',
		type: 'coin',
		address: '',
		fee: 0,
		explorerTransaction: '',
		explorerAddress: '',
		fixed: 0,
	};
	const currencyItem = currencies.find(currency => currency.id.toLowerCase() === currency_id.toLowerCase()) || {
		blockchain_key: '',
		withdrawal_enabled: false,
	};
	const currencyFee = ethFees.find(cur => cur.currency_id === currency_id);
	const ethFee = currencyFee ? currencyFee.fee : undefined;
	const selectedWalletFee = selectedWallet ? selectedWallet.fee : wallet.fee;
	const ethWallet = wallets.find(wallet => wallet.currency.toLowerCase() === 'eth');
	const ethBallance = ethWallet ? ethWallet.balance : undefined;
	let confirmationAddress = '';
	if (wallet) {
		confirmationAddress =
			wallet.type === 'fiat'
				? withdrawState.beneficiary.name
				: withdrawState.beneficiary.data
				? (withdrawState.beneficiary.data.address as string)
				: '';
	}

	const redirectToEnable2fa = () => history.push('/security/2fa', { enable2fa: true });

	const toggleConfirmModal = (
		amount?: string,
		total?: string,
		beneficiary?: Beneficiary,
		otpCode?: string,
		isOpen?: boolean,
	) => {
		setState({
			...withdrawState,
			amount: amount || '',
			beneficiary: beneficiary ? beneficiary : defaultBeneficiary,
			otpCode: otpCode ? otpCode : '',
			withdrawConfirmModal: isOpen === undefined ? !withdrawState.withdrawConfirmModal : isOpen,
			total: total || '',
			withdrawDone: false,
		});
	};

	const isOtpDisabled = () => {
		return (
			<React.Fragment>
				<p className="pg-wallet__enable-2fa-message">
					{intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.enable2fa' })}
				</p>
				<Button
					style={{
						background: 'var(--system-yellow)',
						border: '1px solid #848E9C',
						borderRadius: '23.5px',
					}}
					block={true}
					onClick={redirectToEnable2fa}
					size="lg"
					variant="primary"
				>
					{intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.enable2faButton' })}
				</Button>
			</React.Fragment>
		);
	};

	const isTwoFactorAuthRequired = (level: number, is2faEnabled: boolean) => {
		return level > 1 || (level === 1 && is2faEnabled);
	};

	const renderWithdrawContent = (wallet: Wallet) => {
		const {
			user: { level, otp },
			currencies,
		} = props;

		const { currency, type, fee } = wallet;

		const fixed = (wallet || { fixed: 0 }).fixed;

		const selectedCurrency = currencies.find(cur => cur.id === currency);
		const minWithdrawAmount =
			selectedCurrency && selectedCurrency.min_withdraw_amount ? selectedCurrency.min_withdraw_amount : undefined;
		const parentCurrency = currencies.find(currency => currency.id === currency_id);
		const limitWitdraw24h = parentCurrency ? parentCurrency.withdraw_limit_24h : undefined;
		const selected_price = currencies.find(item => item.id === currencyState);

		const withdrawProps: WithdrawProps = {
			withdrawDone: withdrawState.withdrawDone,
			currency: currencyState,
			fee: fee,
			onClick: toggleConfirmModal,
			twoFactorAuthRequired: isTwoFactorAuthRequired(level, otp),
			fixed,
			type,
			withdrawAmountLabel: intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.amount' }),
			withdraw2faLabel: intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' }),
			withdrawFeeLabel: intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' }),
			withdrawTotalLabel: intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.total' }),
			withdrawButtonLabel: intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.button' }),
			ethFee,
			ethBallance: ethBallance,
			minWithdrawAmount,
			limitWitdraw24h,
			limitWitdraw24hLabel: 'USDT',
			remains: remains,
			limit: limit,
			price: selected_price?.price,
		};

		return otp ? <Withdraw {...withdrawProps} /> : isOtpDisabled();
	};

	const toggleSubmitModal = () => {
		setState({
			...withdrawState,
			withdrawSubmitModal: !withdrawState.withdrawSubmitModal,
			withdrawDone: true,
		});
	};

	const handleWithdraw = () => {
		const { otpCode, amount, beneficiary } = withdrawState;
		if (!wallet) {
			return;
		}
		const { currency, fee } = selectedWallet ? selectedWallet : wallet;

		// Withdraw by eth fee
		const { user, ethFee: eth_fee, wallets } = props;
		const ethWallet = wallets.find(wallet => wallet.currency.toLowerCase() === 'eth');
		const ethBallance = ethWallet ? ethWallet.balance : undefined;
		const currencyFee = eth_fee.find(cur => cur.currency_id === currency);

		if (fee === 0) {
			if (!(currencyFee && currencyFee.fee)) {
				message.error(intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.ethFee.message.err.wrong' }));
				return;
			}
			if (!(ethBallance && Number(ethBallance) >= Number(currencyFee.fee))) {
				message.error(intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.ethFee.message.err.notEnough' }));
				return;
			}
		}

		const withdrawRequest = {
			uid: user.uid,
			fee: fee.toString(),
			amount,
			currency: currencyState,
			otp: otpCode,
			beneficiary_id: String(beneficiary.id),
		};

		dispatch(walletsWithdrawCcyFetch(withdrawRequest));
		toggleConfirmModal();
	};

	const renderWithdrawLimit = () => {
		return (
			<div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center px-5 pt-5">
				<div className="w-50 d-flex flex-column justify-content-center align-items-center">
					<div>
						<img src={VerifySVG} alt="kyc" />
					</div>
					<div className="mt-4">
						<h3 className="text-center lh-3">
							{intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.require.kyc' })}
						</h3>
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
			</div>
		);
	};

	const renderLockWithdraw = () => {
		return (
			<div
				style={{
					position: 'relative',
					width: '100%',
					height: '300px',
				}}
			>
				<div className="blur-disabled">
					<LockIcon className="pg-blur__content__icon" />
					{intl.formatMessage({
						id: 'page.body.wallets.tabs.withdraw.disabled.message',
					})}
				</div>
			</div>
		);
	};

	const renderChildWalletTabPanels = () => {
		return childWallets
			? childWallets.map(childWallet => {
					const currency = currencies.find(cur => toLower(cur.id) === toLower(childWallet.id));
					if (currency && currency.deposit_enabled === false) return null;
					return (
						<TabPane tab={getTabName(childWallet.blockchain_key)} key={childWallet.id}>
							{childWallet.wallet && childWallet.withdrawal_enabled
								? renderWithdrawContent(childWallet.wallet)
								: renderLockWithdraw()}
						</TabPane>
					);
			  })
			: null;
	};
	return (
		<div id="withdraw-address">
			<div
				className="container d-flex flex-column justify-content-between"
				style={{ padding: '30px', borderRadius: '5px', height: '100%', fontSize: '1.3rem' }}
			>
				<div>
					<div className="row">
						<div className="col-12">
							<h4>{intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.netWork' })}</h4>
						</div>
					</div>
					<div className="row">
						<div className="col-12">
							<div className="react-tabs">
								{isWalletsWithdrawLimit ? (
									renderWithdrawLimit()
								) : (
									<Tabs defaultActiveKey={currency_id} onTabClick={setCurrencyState}>
										{wallet && currencyItem && currencyItem.withdrawal_enabled ? (
											<TabPane tab={getTabName(currencyItem.blockchain_key || '')} key={currency_id}>
												{renderWithdrawContent(wallet)}
											</TabPane>
										) : null}

										{renderChildWalletTabPanels()}
									</Tabs>
								)}
								{isFetchChildCurrenciesLoading ? (
									<div className="react-tabs__loading">
										<img src={UdonIconGif} alt="loading" />
									</div>
								) : null}
							</div>
						</div>
					</div>
				</div>
			</div>

			<ModalWithdrawSubmit show={withdrawState.withdrawSubmitModal} currency={currency_id} onSubmit={toggleSubmitModal} />
			<ModalWithdrawConfirmation
				show={withdrawState.withdrawConfirmModal}
				amount={withdrawState.total}
				currency={currencyState}
				rid={confirmationAddress}
				onSubmit={handleWithdraw}
				onDismiss={toggleConfirmModal}
				selectedWalletFee={selectedWalletFee}
				ethFee={ethFee}
				ethBallance={ethBallance}
			/>
		</div>
	);
};
