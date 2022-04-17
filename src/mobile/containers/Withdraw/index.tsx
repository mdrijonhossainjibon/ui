import { FrownOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import classnames from 'classnames';
import { cleanPositiveFloatInput, formatNumber, precisionRegExp } from 'helpers';
import { IntlProps } from 'index';
import { isEmpty, toNumber, toString } from 'lodash';
import { alertPush, Beneficiary, selectUserInfo } from 'modules';
import * as React from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Beneficiaries } from '../../components';
import { Decimal } from '../../components/Decimal';
export interface WithdrawProps {
	currency: string;
	fee: number;
	onClick: (amount: string, total: string, beneficiary: Beneficiary, otpCode: string) => void;
	fixed: number;
	className?: string;
	type: 'fiat' | 'coin';
	twoFactorAuthRequired?: boolean;
	withdrawAmountLabel?: string;
	withdraw2faLabel?: string;
	withdrawFeeLabel?: string;
	withdrawTotalLabel?: string;
	withdrawButtonLabel?: string;
	withdrawDone: boolean;
	isMobileDevice?: boolean;
	ethFee: number | undefined;
	ethBallance?: string;
	minWithdrawAmount?: string;
	limitWitdraw24h?: string;
	limitWitdraw24hLabel?: string;
	parentWalletBalance?: string;
	parentCurrency: string;
	history: any;
	remains: number;
	limit: number;
	price?: number;
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

interface WithdrawState {
	amount: string;
	beneficiary: Beneficiary;
	otpCode: string;
	withdrawAmountFocused: boolean;
	withdrawCodeFocused: boolean;
	total: string;
}

interface DispatchProps {
	pushAlert: typeof alertPush;
}
interface ReduxProps {
	otp: boolean;
}

class Withdraw extends React.Component<DispatchProps & WithdrawProps & ReduxProps & IntlProps, WithdrawState> {
	public state = {
		amount: '',
		beneficiary: defaultBeneficiary,
		otpCode: '',
		withdrawAmountFocused: false,
		withdrawCodeFocused: false,
		total: '',
	};

	public componentWillReceiveProps(nextProps) {
		const { currency, withdrawDone } = this.props;
		if (
			(nextProps && JSON.stringify(nextProps.currency) !== JSON.stringify(currency)) ||
			(nextProps.withdrawDone && !withdrawDone)
		) {
			this.setState({
				amount: '',
				otpCode: '',
				total: '',
			});
		}
	}

	public translate = (e: string) => {
		return this.props.intl.formatMessage({ id: e });
	};

	public render() {
		const { amount, withdrawAmountFocused, otpCode } = this.state;
		const {
			className,
			currency,
			type,
			twoFactorAuthRequired,
			withdrawAmountLabel,
			withdrawFeeLabel,
			withdrawButtonLabel,
			isMobileDevice,
		} = this.props;

		const cx = classnames('td-withdraw', className);
		const lastDividerClassName = classnames('td-withdraw__divider', {
			'td-withdraw__divider-one': twoFactorAuthRequired,
			'td-withdraw__divider-two': !twoFactorAuthRequired,
		});

		const withdrawAmountClass = classnames('td-withdraw__group__amount', {
			'td-withdraw__group__amount--focused': withdrawAmountFocused,
		});
		const isWithdrawButtonDisabled = isEmpty(amount) || isEmpty(otpCode) || !this.isSafeWithdraw();
		const withdrawButtonClass = classnames(
			'td-withdraw__deep__withdraw-btn',
			isWithdrawButtonDisabled ? 'td-withdraw__deep__withdraw-btn-disabled' : null,
		);

		const redirectToEnable2fa = () => this.props.history.push('/profile/2fa', { enable2fa: !this.props.otp });

		return (
			<div className={cx}>
				{this.props.otp && (
					<div className="td-withdraw-column">
						<div className="td-withdraw__group__address text-title-input">
							<Beneficiaries currency={currency} type={type} onChangeValue={this.handleChangeBeneficiary} />
						</div>
						<div className="td-withdraw__divider td-withdraw__divider-one" />
						<div
							className="td-mobile-withdraw-remains mt-4"
							style={{
								fontSize: '0.75rem',
								color: 'white',
							}}
						>
							<span>
								{`Remains:  
								${formatNumber(toString(this.props.remains))} / `}
								<span
									style={{
										color: 'var(--yellow)',
									}}
								>
									{formatNumber(toString(this.props.limit)) + ` USDT`}
								</span>
							</span>
						</div>

						<div className={withdrawAmountClass}>
							<div className="d-flex flex-row justify-content-between mb-2">
								<span className="text-white text-title-input">
									{this.translate('page.mobile.wallets.currency.withdraw.body.amount')}
								</span>
								<span className="text-white text-title-input">
									{this.translate('page.mobile.wallets.currency.withdraw.body.balance')}:{' '}
									{toNumber(this.props.parentWalletBalance || 0).toFixed(this.props.fixed)}{' '}
									{this.props.parentCurrency.toUpperCase()}
								</span>
							</div>
							<div className="td-withdraw__group__amount-box">
								<CustomInput
									type="number"
									label={
										withdrawAmountLabel ||
										this.translate('page.mobile.wallets.currency.withdraw.body.labelAmount')
									}
									defaultLabel={this.translate('page.mobile.wallets.currency.withdraw.body.labelAmount')}
									inputValue={amount}
									autoFocus
									// placeholder={withdrawAmountLabel || 'Amount'}
									placeholder={
										this.props.minWithdrawAmount === undefined
											? withdrawAmountLabel ||
											  this.translate('page.mobile.wallets.currency.withdraw.body.labelPlaceAmount')
											: this.translate('page.mobile.wallets.currency.withdraw.body.labelPlaceMinAmount') +
											  this.props.minWithdrawAmount +
											  ' ' +
											  currency.toUpperCase()
									}
									classNameInput="td-withdraw__input"
									handleChangeInput={this.handleChangeInputAmount}
									// isInvalid={isEmpty(amount)}
								/>

								<button
									onClick={() =>
										this.handleChangeInputAmount(
											toNumber(this.props.parentWalletBalance || 0).toFixed(this.props.fixed) ?? '',
										)
									}
									className="td-withdraw__group__amount-box__all-btn"
								>
									{this.translate('page.mobile.wallets.currency.withdraw.body.btn.all')}
								</button>
							</div>
							{!this.isSafeWithdraw() && (
								<div style={{ color: 'red', fontSize: '0.8rem', marginTop: ' 0.5rem' }}>
									Total Withdrawal has exceed of remains on Daily{' '}
								</div>
							)}
						</div>
						<div className="my-2 text-desc-input">
							{withdrawFeeLabel} {this.renderFee()}
						</div>
						<div className={lastDividerClassName} />
						{isMobileDevice && twoFactorAuthRequired && this.renderOtpCodeInput()}
					</div>
				)}
				<div className="td-withdraw__deep">
					{this.props.otp ? (
						<button className={withdrawButtonClass} disabled={isWithdrawButtonDisabled} onClick={this.handleClick}>
							{withdrawButtonLabel ? withdrawButtonLabel : 'Withdraw'}
						</button>
					) : (
						<button onClick={() => redirectToEnable2fa()} className="td-withdraw__deep__withdraw-btn">
							{this.translate('page.mobile.wallets.currency.withdraw.body.btn.enable2Fa')}
						</button>
					)}
				</div>
			</div>
		);
	}

	private renderFee = () => {
		const { fee, fixed, currency, ethFee } = this.props;

		return (
			<React.Fragment>
				<span hidden={Number(fee) === 0}>
					<Decimal fixed={fixed}>{fee}</Decimal>
					{' ' + currency.toUpperCase()}
				</span>
				<span hidden={Number(fee) !== 0}>
					<Decimal fixed={fixed}>{ethFee}</Decimal>
					{' ETH'}
				</span>
			</React.Fragment>
		);
	};

	private renderOtpCodeInput = () => {
		const { otpCode, withdrawCodeFocused } = this.state;
		const { withdraw2faLabel } = this.props;
		const withdrawCodeClass = classnames('td-withdraw__group__code', {
			'td-withdraw__group__code--focused': withdrawCodeFocused,
		});

		return (
			<React.Fragment>
				<div className={withdrawCodeClass} style={{ position: 'relative', marginTop: '1rem' }}>
					<div className="text-white mb-2 text-title-input">
						{this.translate('page.mobile.wallets.currency.withdraw.body.2fa.title')}
					</div>
					<CustomInput
						type="number"
						label={withdraw2faLabel || this.translate('page.mobile.wallets.currency.withdraw.body.2fa.label')}
						placeholder={withdraw2faLabel || this.translate('page.mobile.wallets.currency.withdraw.body.2fa.label')}
						defaultLabel={this.translate('page.mobile.wallets.currency.withdraw.body.2fa.label')}
						handleChangeInput={this.handleChangeInputOtpCode}
						inputValue={otpCode}
						handleFocusInput={() => this.handleFieldFocus('code')}
						classNameLabel="td-withdraw__label"
						classNameInput="td-withdraw__input"
						autoFocus={false}
						// isInvalid={isEmpty(otpCode)}
					/>
				</div>
				<div className="td-withdraw__divider td-withdraw__divider-two" />
			</React.Fragment>
		);
	};

	private handleClick = () => {
		const { ethBallance, ethFee, fee } = this.props;
		const { amount, beneficiary } = this.state;
		const { minWithdrawAmount } = this.props;

		const isPending = beneficiary.state && beneficiary.state.toLowerCase() === 'pending';

		if (Number(amount) < Number(minWithdrawAmount)) {
			this.props.pushAlert({ message: ['page.body.wallets.tabs.withdraw.amount.larger'], type: 'error' });
			return;
		}
		if (!beneficiary) {
			this.props.pushAlert({ message: ['page.body.wallets.tabs.withdraw.beneficiary.incorrect'], type: 'error' });
			return;
		}

		if (isPending) {
			this.props.pushAlert({ message: ['page.body.wallets.tabs.withdraw.beneficiary.pending'], type: 'error' });
			return;
		}
		if (Number(this.props.remains) === 0) {
			this.props.pushAlert({ message: ['page.body.wallets.tabs.withdraw.limit24'], type: 'error' });
			return;
		}

		if (fee === 0) {
			// fee is zero, let use eth fee
			if (!ethBallance) {
				Modal.error({
					centered: true,
					icon: <FrownOutlined />,
					title: this.translate('page.mobile.wallets.currency.withdraw.body.ethBallance.title'),
					content: this.translate('page.mobile.wallets.currency.withdraw.body.ethBallance.content'),
				});

				return;
			}
			if (!ethFee || ethFee <= 0) {
				Modal.warning({
					centered: true,
					icon: <FrownOutlined />,
					title: this.translate('page.mobile.wallets.currency.withdraw.body.ethFee.title'),
					content: this.translate('page.mobile.wallets.currency.withdraw.body.ethFee.content'),
				});

				return;
			}
			if (Number(ethBallance) < Number(ethFee)) {
				Modal.warning({
					centered: true,
					icon: <FrownOutlined />,
					title: this.translate('page.mobile.wallets.currency.withdraw.body.bothEth.title'),
					content: this.props.intl.formatMessage(
						{ id: 'page.mobile.wallets.currency.withdraw.body.bothEth.content' },
						{
							numberToken: (Number(ethFee) - Number(ethBallance)).toFixed(5),
						},
					),
				});

				return;
			}
		}
		this.setState({
			...this.state,
			amount: '',
			otpCode: '',
		});
		this.props.onClick(this.state.amount, this.state.total, this.state.beneficiary, this.state.otpCode);
	};

	private handleFieldFocus = (field: string) => {
		switch (field) {
			case 'amount':
				this.setState(prev => ({
					withdrawAmountFocused: !prev.withdrawAmountFocused,
				}));
				break;
			case 'code':
				this.setState(prev => ({
					withdrawCodeFocused: !prev.withdrawCodeFocused,
				}));
				break;
			default:
				break;
		}
	};
	private isSafeWithdraw = () => {
		return toNumber(this.state.total) * toNumber(this.props.price) <= this.props.remains;
	};
	private handleChangeInputAmount = (value: string) => {
		const { fixed } = this.props;
		const convertedValue = cleanPositiveFloatInput(String(value));
		this.setState({
			amount: value,
		});
		if (convertedValue.match(precisionRegExp(fixed))) {
			const amount = convertedValue !== '' ? Number(parseFloat(convertedValue).toFixed(fixed)) : '';
			const total = amount !== '' ? (amount - this.props.fee).toFixed(fixed) : '';

			if (Number(total) <= 0) {
				this.setTotal((0).toFixed(fixed));
			} else {
				this.setTotal(total);
			}

			this.setState({
				amount: convertedValue,
			});
		}
	};

	private setTotal = (value: string) => {
		this.setState({ total: value });
	};

	private handleChangeBeneficiary = (value: Beneficiary) => {
		this.setState({
			beneficiary: value,
		});
	};

	private handleChangeInputOtpCode = (otpCode: string) => {
		this.setState({ otpCode });
	};
}

export interface CustomInputProps {
	type: string;
	label: string;
	defaultLabel: string;
	handleChangeInput?: (value: string) => void;
	inputValue: string | number;
	handleFocusInput?: () => void;
	placeholder: string;
	classNameLabel?: string;
	classNameInput?: string;
	autoFocus?: boolean;
	onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
	readOnly?: boolean;
	id?: string;
	handleClick?: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
	isDisabled?: boolean;
	labelVisible?: boolean;
	isInvalid?: boolean;
}

const mapStateToProps = state => ({
	otp: selectUserInfo(state).otp,
});

const mapDispatchToProps = dispatch => ({
	pushAlert: payload => dispatch(alertPush(payload)),
});

// tslint:disable-next-line no-any
const WithdrawComponent = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(Withdraw as any))) as any;

export { WithdrawComponent };

interface OnChangeEvent {
	target: {
		value: string;
	};
}
type Props = CustomInputProps;

class CustomInput extends React.Component<Props> {
	public render() {
		const {
			placeholder,
			inputValue,
			type,
			autoFocus,
			readOnly,
			id,
			handleClick,
			isDisabled,
			onKeyPress,
			isInvalid,
		} = this.props;

		return (
			<React.Fragment>
				<div className="custom-input">
					<InputGroup size="lg">
						<FormControl
							size="lg"
							type={type}
							value={inputValue.toString()}
							placeholder={placeholder}
							autoFocus={autoFocus}
							onFocus={this.props.handleFocusInput}
							onBlur={this.props.handleFocusInput}
							onChange={e => this.handleChangeValue(e)}
							readOnly={readOnly}
							id={id}
							onClick={handleClick}
							disabled={isDisabled}
							onKeyPress={onKeyPress}
							isInvalid={isInvalid}
						/>
					</InputGroup>
				</div>
			</React.Fragment>
		);
	}

	private handleChangeValue = (e: OnChangeEvent) => {
		this.props.handleChangeInput && this.props.handleChangeInput(e.target.value);
	};
}
