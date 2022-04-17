import { message } from 'antd';
import classnames from 'classnames';
import { NewModal } from 'components';
import { toLower, toNumber } from 'lodash';
import * as React from 'react';
import { ProgressBar } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Blur } from '../../../components/Blur';
import { useBeneficiariesFetch, useCurrenciesFetch, useWalletsAddressFetch } from '../../../hooks';
import { ethFeeFetch, selectETHFee, selectWithdrawLimitRemains, withdrawLimitFetchRemains } from '../../../modules';
import { selectCurrencies } from '../../../modules/public/currencies';
import { Beneficiary } from '../../../modules/user/beneficiaries';
import { selectUserInfo } from '../../../modules/user/profile';
import {
	selectChildCurrencies,
	selectWallets,
	selectWithdrawProcess,
	selectWithdrawSuccess,
	walletsWithdrawCcyData,
	walletsWithdrawCcyFetch,
} from '../../../modules/user/wallets';
import { WithdrawComponent } from '../../containers';
import { ModalWithdrawConfirm } from '../ModalWithdrawConfirm';
import FailPNG from './fail.png';
import WaitingPNG from './waiting.png';
import WarningPNG from './warning.png';

const defaultBeneficiary: Beneficiary = {
	id: 0,
	currency: '',
	name: '',
	state: '',
	data: {
		address: '',
	},
};

const WalletWithdrawBodyComponent = props => {
	const [withdrawData, setWithdrawData] = React.useState({
		amount: '',
		beneficiary: defaultBeneficiary,
		otpCode: '',
		withdrawConfirmModal: false,
		total: '',
		withdrawDone: false,
	});

	const intl = useIntl();
	const dispatch = useDispatch();
	const user = useSelector(selectUserInfo);
	const wallets = useSelector(selectWallets);
	const currencies = useSelector(selectCurrencies);

	const withdrawSuccess = useSelector(selectWithdrawSuccess);
	const { currency, fee, type } = props.wallet;
	const fixed = (props.wallet || { fixed: 0 }).fixed;
	console.log(fixed);
	const withdrawAmountLabel = React.useMemo(
		() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.amount' }),
		[intl],
	);
	const withdraw2faLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' }), [
		intl,
	]);
	const withdrawFeeLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' }), [
		intl,
	]);
	const withdrawTotalLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.total' }), [
		intl,
	]);
	const withdrawButtonLabel = React.useMemo(
		() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.button' }),
		[intl],
	);
	const currencyItem = (currencies && currencies.find(item => item.id === currency)) || {
		id: '',
		withdraw_limit_24h: undefined,
		min_withdraw_amount: undefined,
		withdrawal_enabled: false,
	};

	const ethFee = useSelector(selectETHFee);
	React.useEffect(() => {
		dispatch(ethFeeFetch());
	}, [dispatch]);

	React.useEffect(() => {
		dispatch(
			withdrawLimitFetchRemains({
				currency_id: props.currency,
			}),
		);
	}, [props.currency]);
	const { payload } = useSelector(selectWithdrawLimitRemains);
	const { remains, limit } = payload;
	const isTwoFactorAuthRequired = (level: number, is2faEnabled: boolean) => {
		return level > 1 || (level === 1 && is2faEnabled);
	};
	const getConfirmationAddress = () => {
		let confirmationAddress = '';

		if (props.wallet) {
			confirmationAddress =
				props.wallet.type === 'fiat'
					? withdrawData.beneficiary.name
					: withdrawData.beneficiary.data
					? (withdrawData.beneficiary.data.address as string)
					: '';
		}

		return confirmationAddress;
	};
	const toggleConfirmModal = (amount?: string, total?: string, beneficiary?: Beneficiary, otpCode?: string) => {
		setWithdrawData((state: any) => ({
			amount: amount || '',
			beneficiary: beneficiary || defaultBeneficiary,
			otpCode: otpCode || '',
			withdrawConfirmModal: !state.withdrawConfirmModal,
			total: total || '',
			withdrawDone: false,
		}));
	};
	const toggleSubmitModal = () => {
		setWithdrawData(state => ({ ...state, withdrawDone: true }));
	};
	const handleWithdraw = () => {
		const { otpCode, amount, beneficiary } = withdrawData;
		if (!props.wallet) {
			return;
		}

		if (toNumber(fee) === 0) {
			if (!(feeCurrency && feeCurrency.fee)) {
				message.error(intl.formatMessage({ id: 'page.mobile.wallets.currency.withdraw.error.unvailable' }));

				return;
			}
			if (!(ethBallance && Number(ethBallance) >= Number(feeCurrency.fee))) {
				message.error(intl.formatMessage({ id: 'page.mobile.wallets.currency.withdraw.error.notEnough' }));

				return;
			}
		}
		const withdrawRequest = {
			uid: user.uid,
			fee: fee,
			amount,
			currency: toLower(currency),
			otp: otpCode,
			beneficiary_id: String(beneficiary.id),
		};
		dispatch(walletsWithdrawCcyFetch(withdrawRequest));
		toggleConfirmModal();
	};

	React.useEffect(() => {
		if (withdrawSuccess) {
			toggleSubmitModal();
		}
	}, [withdrawSuccess]);

	useWalletsAddressFetch(currency);
	useBeneficiariesFetch();
	useCurrenciesFetch();

	const minWithdrawAmount = currencyItem && currencyItem.min_withdraw_amount ? currencyItem.min_withdraw_amount : undefined;

	const className = classnames('td-mobile-wallet-withdraw-body', {
		'td-mobile-wallet-withdraw-body--disabled': currencyItem && !currencyItem.withdrawal_enabled,
	});

	const ethWallet = wallets.find(wallet => wallet.currency.toLowerCase() === 'eth');
	const ethBallance = ethWallet ? ethWallet.balance : undefined;
	const selectedWallet = wallets.find(wallet => wallet.currency.toLowerCase() === currency.toLowerCase());
	const selectedWalletFee = selectedWallet ? selectedWallet.fee : undefined;

	const feeCurrency = ethFee.find(cur => cur.currency_id === currency);
	const childCurrencies = useSelector(selectChildCurrencies);
	const childCurrency = childCurrencies.find(child => child.id === currency) || { parent_id: '' };
	const parentCurrencyId = childCurrency.parent_id;
	const parentCurrency = currencies.find(cur => cur.id === parentCurrencyId) || { id: '', withdraw_limit_24h: undefined };
	const limitWitdraw24h = parentCurrency ? parentCurrency.withdraw_limit_24h : undefined;

	const parentWalletBalance = wallets.find(wallet => wallet.currency === props.parent_currency);
	const withdrawProcessPercent = useSelector(selectWithdrawProcess);

	const selected_price = currencies.find(item => item.id === currency);
	const handleClose = () => {
		if (withdrawProcessPercent.isFinishWithdraw) {
			dispatch(walletsWithdrawCcyData({ withdrawProcess: 10, showProcessPopup: false, isFinish: false, reason: '' }));
		}
	};

	const getColorProcess = (percent: number) => {
		switch (percent) {
			case 30:
				return 'info';
			case 80:
				return 'warning';
			case 100:
				return 'success';
			default:
				return 'danger';
		}
	};

	const renderBody = () => {
		if (withdrawProcessPercent.isFinishWithdraw) {
			if (withdrawProcessPercent.status && withdrawProcessPercent.status === 'success') {
				return (
					<div className="row px-4">
						<div className="col-4 d-flex justify-content-center align-items-center">
							<img style={{ display: 'block', margin: 'auto' }} width="80px" src={WaitingPNG} alt="success" />
						</div>
						<div className="col-8 d-flex flex-column justify-content-center align-items-center">
							<h4 className="text-center text-bold mt-3">
								{intl.formatMessage({ id: 'page.body.plugins.wallet.withdraw.body.received' })}
							</h4>
							<p className="text-success text-center">
								{intl.formatMessage({ id: 'page.body.plugins.wallet.withdraw.body.reviewed' })}
							</p>
							<button
								style={{ background: '#28a745', width: '100px' }}
								onClick={handleClose}
								className="btn btn-primary mt-3"
							>
								{intl.formatMessage({ id: 'page.body.plugins.wallet.withdraw.body.close' })}
							</button>
						</div>
					</div>
				);
			} else {
				return (
					<div className="row px-4">
						<div className="col-4 d-flex justify-content-center align-items-center text-center">
							<img style={{ display: 'block', margin: 'auto' }} width="80px" src={FailPNG} alt="fail" />
						</div>
						<div className="col-8 d-flex flex-column justify-content-center align-items-center">
							<h4 className="text-bold mt-3">
								{intl.formatMessage({ id: 'page.body.plugins.wallet.withdraw.body.fail' })}
							</h4>
							<p className="text-danger text-center">
								{intl.formatMessage({ id: 'page.body.plugins.wallet.withdraw.body.otp.fail' })}
							</p>
							<button
								style={{ background: 'var(--yellow)', width: '100px' }}
								onClick={handleClose}
								className="btn btn-primary mt-3"
							>
								{intl.formatMessage({ id: 'page.body.plugins.wallet.withdraw.body.close' })}
							</button>
						</div>
					</div>
				);
			}
		} else {
			return (
				<div>
					<div className="d-flex justify-content-between align-items-center">
						<img width="100px" src={WarningPNG} alt="warning" />
						<h3 className="ml-3">{intl.formatMessage({ id: 'page.body.plugins.wallet.withdraw.body.warning' })}</h3>
					</div>
					<div className="mt-3">
						<ProgressBar
							style={{
								height: '25px',
								background: '#11223f',
								fontSize: '1rem',
								borderRadius: '10px',
							}}
							striped
							variant={getColorProcess(withdrawProcessPercent.percent)}
							animated
							now={withdrawProcessPercent.percent}
							label={`${withdrawProcessPercent.percent}%`}
						/>
					</div>
				</div>
			);
		}
	};

	return (
		<div className={className}>
			<WithdrawComponent
				isMobileDevice
				ethFee={feeCurrency ? feeCurrency.fee : undefined}
				fee={fee}
				ethBallance={ethBallance}
				minWithdrawAmount={minWithdrawAmount}
				type={type}
				fixed={fixed}
				currency={currency}
				onClick={toggleConfirmModal}
				withdrawAmountLabel={withdrawAmountLabel}
				withdraw2faLabel={withdraw2faLabel}
				withdrawFeeLabel={withdrawFeeLabel}
				withdrawTotalLabel={withdrawTotalLabel}
				withdrawDone={withdrawData.withdrawDone}
				withdrawButtonLabel={withdrawButtonLabel}
				twoFactorAuthRequired={isTwoFactorAuthRequired(user.level, user.otp)}
				limitWitdraw24h={currencyItem.withdraw_limit_24h ? currencyItem.withdraw_limit_24h : limitWitdraw24h}
				limitWitdraw24hLabel={parentCurrencyId ? parentCurrencyId.toUpperCase() : currencyItem.id.toUpperCase()}
				parentWalletBalance={parentWalletBalance?.balance}
				parentCurrency={props.parent_currency}
				limit={limit}
				remains={remains}
				price={selected_price?.price}
			/>
			<div hidden={currencyItem.withdrawal_enabled} className="withdraw-disabled">
				<Blur text={intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.disabled.message' })} />
			</div>

			<div className="td-mobile-wallet-withdraw-body__confirmation">
				<ModalWithdrawConfirm
					ethBallance={ethBallance}
					selectedWalletFee={selectedWalletFee}
					ethFee={feeCurrency ? feeCurrency.fee : undefined}
					isMobileDevice
					show={withdrawData.withdrawConfirmModal}
					amount={withdrawData.total}
					currency={currency}
					rid={getConfirmationAddress()}
					onSubmit={handleWithdraw}
					onDismiss={toggleConfirmModal}
				/>
			</div>
			<div>
				<NewModal
					show={withdrawProcessPercent.showWithdrawProcess}
					onHide={handleClose}
					titleModal={<FormattedMessage id="page.body.plugins.wallet.withdraw.header.process" />}
					bodyModal={renderBody()}
				/>
			</div>
		</div>
	);
};

const WalletWithdrawBody = React.memo(WalletWithdrawBodyComponent);

export { WalletWithdrawBody };
