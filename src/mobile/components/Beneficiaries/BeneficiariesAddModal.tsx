import classnames from 'classnames';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { CustomInput } from '../../components';
import { checkValidBitcoinAddress, checkValidErc20Address } from '../../../helpers';
import { IntlProps } from '../../../index';
import {
	beneficiariesCreate,
	BeneficiaryBank,
	RootState,
	selectBeneficiariesCreateError,
	selectBeneficiariesCreateSuccess,
	selectMobileDeviceState,
} from '../../../modules';
import { CommonError } from '../../../modules/types';
import { NewModal } from '../NewModal';

interface ReduxProps {
	beneficiariesAddError?: CommonError;
	beneficiariesAddSuccess: boolean;
	isMobileDevice: boolean;
}

interface DispatchProps {
	createAddress: typeof beneficiariesCreate;
}

interface OwnProps {
	currency: string;
	type: 'fiat' | 'coin';
	handleToggleAddAddressModal: () => void;
	handleToggleConfirmationModal: () => void;
	blockchainType: string;
}

interface CoinState {
	coinAddress: string;
	coinBeneficiaryName: string;
	coinDescription: string;

	coinAddressFocused: boolean;
	coinBeneficiaryNameFocused: boolean;
	coinDescriptionFocused: boolean;

	isInvalidAddress: boolean;
}

interface FiatState {
	fiatName: string;
	fiatFullName: string;
	fiatAccountNumber: string;
	fiatBankName: string;
	fiatBankSwiftCode: string;
	fiatIntermediaryBankName: string;
	fiatIntermediaryBankSwiftCode: string;

	fiatNameFocused: boolean;
	fiatFullNameFocused: boolean;
	fiatAccountNumberFocused: boolean;
	fiatBankNameFocused: boolean;
	fiatBankSwiftCodeFocused: boolean;
	fiatIntermediaryBankNameFocused: boolean;
	fiatIntermediaryBankSwiftCodeFocused: boolean;
}

type Props = ReduxProps & DispatchProps & OwnProps & IntlProps;
type State = CoinState & FiatState;

const defaultState = {
	coinAddress: '',
	coinBeneficiaryName: '',
	coinDescription: '',
	coinAddressFocused: false,
	coinBeneficiaryNameFocused: false,
	coinDescriptionFocused: false,

	isInvalidAddress: false,

	fiatName: '',
	fiatFullName: '',
	fiatAccountNumber: '',
	fiatBankName: '',
	fiatBankSwiftCode: '',
	fiatIntermediaryBankName: '',
	fiatIntermediaryBankSwiftCode: '',
	fiatNameFocused: false,
	fiatFullNameFocused: false,
	fiatAccountNumberFocused: false,
	fiatBankNameFocused: false,
	fiatBankSwiftCodeFocused: false,
	fiatIntermediaryBankNameFocused: false,
	fiatIntermediaryBankSwiftCodeFocused: false,
};

class BeneficiariesAddModalComponent extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			...defaultState,
		};
	}

	public componentWillReceiveProps(nextProps: Props) {
		const { beneficiariesAddError, beneficiariesAddSuccess } = this.props;

		if (
			(nextProps.beneficiariesAddError && !beneficiariesAddError) ||
			(nextProps.beneficiariesAddSuccess && !beneficiariesAddSuccess)
		) {
			this.props.handleToggleAddAddressModal();
			this.handleClearModalsInputs();
		}

		if (nextProps.beneficiariesAddSuccess && !beneficiariesAddSuccess) {
			this.props.handleToggleConfirmationModal();
		}
	}

	public render() {
		const { type, isMobileDevice } = this.props;

		const addModalClass = classnames('beneficiaries-add-address-modal', {
			'beneficiaries-add-address-modal--coin': type === 'coin',
			'beneficiaries-add-address-modal--fiat': type === 'fiat',
			'td-modal': !isMobileDevice,
		});
		const { coinAddress, coinBeneficiaryName, isInvalidAddress } = this.state;

		const isCoinButtonDisabled = !coinAddress || !coinBeneficiaryName || isInvalidAddress;

		const { fiatName, fiatFullName, fiatAccountNumber, fiatBankName } = this.state;

		const isFiatButtonDisabled = !fiatName || !fiatFullName || !fiatAccountNumber || !fiatBankName;
		return (
			<NewModal
				show
				onClose={this.props.handleToggleAddAddressModal}
				title={this.props.intl.formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.header' })}
			>
				<div className={addModalClass} hidden={type !== 'coin'} style={{ fontSize: '12px' }}>
					{isInvalidAddress ? (
						<p style={{ fontSize: '12px', color: 'red' }}>
							** Please enter <strong>{String(this.props.blockchainType).toUpperCase()}</strong> address
						</p>
					) : null}
					{this.renderEnterCoinAddressInput('coinAddress')}
					{this.renderAddAddressModalBodyItem('coinBeneficiaryName')}
					{this.renderAddAddressModalBodyItem('coinDescription', true)}
					<button
						disabled={isCoinButtonDisabled}
						className="w-100 green-btn green-btn-mt"
						onClick={this.handleSubmitAddAddressCoinModal}
					>
						{this.translate('page.body.wallets.beneficiaries.addAddressModal.body.button')}
					</button>
				</div>
				<div hidden={type === 'coin'}>
					{this.renderAddAddressModalBodyItem('fiatName')}
					{this.renderAddAddressModalBodyItem('fiatFullName')}
					{this.renderAddAddressModalBodyItem('fiatAccountNumber')}
					{this.renderAddAddressModalBodyItem('fiatBankName')}
					{this.renderAddAddressModalBodyItem('fiatBankSwiftCode', true)}
					{this.renderAddAddressModalBodyItem('fiatIntermediaryBankName', true)}
					{this.renderAddAddressModalBodyItem('fiatIntermediaryBankSwiftCode', true)}
					<button
						disabled={isFiatButtonDisabled}
						hidden={type === 'coin'}
						onClick={this.handleSubmitAddAddressFiatModal}
						className="w-100 green-btn"
					>
						{this.translate('page.body.wallets.beneficiaries.addAddressModal.body.button')}
					</button>
				</div>
			</NewModal>
		);
	}

	private renderAddAddressModalBodyItem = (field: string, optional?: boolean) => {
		const focusedClass = classnames('td-email-form__group', {
			'td-email-form__group--focused': this.state[`${field}Focused`],
			'td-email-form__group--optional': optional,
		});

		return (
			<div key={field} className={focusedClass}>
				<CustomInput
					type="text"
					label={this.translate(`page.body.wallets.beneficiaries.addAddressModal.body.${field}`)}
					placeholder={this.translate(`page.body.wallets.beneficiaries.addAddressModal.body.${field}`)}
					defaultLabel={field}
					handleChangeInput={value => this.handleChangeFieldValue(field, value)}
					inputValue={this.state[field]}
					handleFocusInput={() => this.handleChangeFieldFocus(`${field}Focused`)}
					classNameLabel="td-email-form__label"
					classNameInput="td-email-form__input"
					autoFocus={true}
					isInvalid={false}
				/>
			</div>
		);
	};

	private renderEnterCoinAddressInput = (field: string, optional?: boolean) => {
		const focusedClass = classnames('td-email-form__group', {
			'td-email-form__group--focused': this.state[`${field}Focused`],
			'td-email-form__group--optional': optional,
		});

		const { isInvalidAddress } = this.state;

		return (
			<div key={field} className={focusedClass}>
				<CustomInput
					type="text"
					label={this.translate(`page.body.wallets.beneficiaries.addAddressModal.body.${field}`)}
					placeholder={this.translate(`page.body.wallets.beneficiaries.addAddressModal.body.${field}`)}
					defaultLabel={field}
					handleChangeInput={value => this.handleChangeAddAddressFieldValue(field, value)}
					inputValue={this.state[field]}
					handleFocusInput={() => this.handleChangeFieldFocus(`${field}Focused`)}
					classNameLabel="td-email-form__label"
					classNameInput="td-email-form__input"
					autoFocus={true}
					isInvalid={isInvalidAddress}
				/>
			</div>
		);
	};

	private handleChangeAddAddressFieldValue = (key: string, value: string) => {
		const { blockchainType } = this.props;
		let isValid = true;

		switch (blockchainType) {
			case 'eth-main':
				isValid = checkValidErc20Address(value);
				this.setState({
					isInvalidAddress: !isValid,
				});
				break;
			case 'bsc-main':
				isValid = checkValidErc20Address(value);
				this.setState({
					isInvalidAddress: !isValid,
				});
				break;
			case 'btc-main':
				isValid = checkValidBitcoinAddress(value);
				this.setState({
					isInvalidAddress: !isValid,
				});
				break;
			case 'doge-main':
				isValid = checkValidBitcoinAddress(value);
				this.setState({
					isInvalidAddress: !isValid,
				});
				break;
			default:
				break;
		}

		// @ts-ignore
		this.setState({
			[key]: value,
		});
	};

	private handleChangeFieldValue = (key: string, value: string) => {
		// @ts-ignore
		this.setState({
			[key]: value,
		});
	};

	private handleChangeFieldFocus = (key: string) => {
		// @ts-ignore
		this.setState(prev => ({
			[key]: !prev[key],
		}));
	};

	private handleClearModalsInputs = () => {
		this.setState({
			...defaultState,
		});
	};

	private handleSubmitAddAddressCoinModal = () => {
		const { currency } = this.props;
		const { coinAddress, coinBeneficiaryName, coinDescription } = this.state;

		// tslint:disable-next-line:no-any
		let payload: any = {
			currency: currency || '',
			name: coinBeneficiaryName,
			data: JSON.stringify({
				address: coinAddress,
			}),
		};

		if (coinDescription) {
			payload = {
				...payload,
				description: coinDescription,
			};
		}

		this.props.createAddress(payload);
	};

	private handleSubmitAddAddressFiatModal = () => {
		const { currency } = this.props;
		const {
			fiatName,
			fiatFullName,
			fiatAccountNumber,
			fiatBankName,
			fiatBankSwiftCode,
			fiatIntermediaryBankName,
			fiatIntermediaryBankSwiftCode,
		} = this.state;

		let data: BeneficiaryBank = {
			full_name: fiatFullName,
			account_number: fiatAccountNumber,
			bank_name: fiatBankName,
		};

		if (fiatBankSwiftCode) {
			data = {
				...data,
				bank_swift_code: fiatBankSwiftCode,
			};
		}

		if (fiatIntermediaryBankName) {
			data = {
				...data,
				intermediary_bank_name: fiatIntermediaryBankName,
			};
		}

		if (fiatIntermediaryBankSwiftCode) {
			data = {
				...data,
				intermediary_bank_swift_code: fiatIntermediaryBankSwiftCode,
			};
		}

		const payload = {
			currency: currency || '',
			name: fiatName,
			data: JSON.stringify(data),
		};

		this.props.createAddress(payload);
	};

	private translate = (id: string) => this.props.intl.formatMessage({ id });
}

const mapStateToProps = (state: RootState): ReduxProps => ({
	beneficiariesAddError: selectBeneficiariesCreateError(state),
	beneficiariesAddSuccess: selectBeneficiariesCreateSuccess(state),
	isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
	createAddress: payload => dispatch(beneficiariesCreate(payload)),
});

// tslint:disable-next-line:no-any
export const BeneficiariesAddModal = injectIntl(
	connect(mapStateToProps, mapDispatchToProps)(BeneficiariesAddModalComponent) as any,
) as any;
