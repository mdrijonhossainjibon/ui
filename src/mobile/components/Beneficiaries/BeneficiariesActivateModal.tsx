import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { NewCustomInput } from '../../../components';
import { IntlProps } from '../../../index';
import {
	beneficiariesActivate,
	Beneficiary,
	RootState,
	selectBeneficiariesActivateError,
	selectBeneficiariesActivateSuccess,
	selectMobileDeviceState,
} from '../../../modules';
import { CommonError } from '../../../modules/types';
import { NewModal } from '../NewModal';

interface ReduxProps {
	beneficiariesActivateError?: CommonError;
	beneficiariesActivateSuccess: boolean;
	isMobileDevice: boolean;
}

interface DispatchProps {
	activateAddress: typeof beneficiariesActivate;
}

interface OwnProps {
	beneficiariesAddData: Beneficiary;
	handleToggleConfirmationModal: () => void;
}

interface State {
	confirmationModalCode: string;
	confirmationModalCodeFocused: boolean;
}

type Props = ReduxProps & DispatchProps & OwnProps & IntlProps;

const defaultState = {
	confirmationModalCode: '',
	confirmationModalCodeFocused: false,
};

class BeneficiariesActivateModalComponent extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			...defaultState,
		};
	}

	public componentWillReceiveProps(nextProps: Props) {
		const { beneficiariesActivateError, beneficiariesActivateSuccess } = this.props;

		if (
			(nextProps.beneficiariesActivateError && !beneficiariesActivateError) ||
			(nextProps.beneficiariesActivateSuccess && !beneficiariesActivateSuccess)
		) {
			this.props.handleToggleConfirmationModal();
			this.handleClearModalsInputs();
		}
	}

	public render() {
		const { confirmationModalCode } = this.state;

		const isDisabled = !confirmationModalCode;

		return (
			<NewModal
				show
				onClose={this.props.handleToggleConfirmationModal}
				title={this.translate('page.body.wallets.beneficiaries.confirmationModal.header')}
			>
				<div className="mb-4">
					<div className="d-flex justify-content-center"></div>
					<div className="text-white text-center mt-3 text-desc">
						{this.translate('page.body.wallets.beneficiaries.confirmationModal.body.text')}
					</div>
				</div>
				<div className="mb-4">
					<NewCustomInput
						type="text"
						label={''}
						placeholder={this.translate(
							`page.body.wallets.beneficiaries.confirmationModal.body.confirmationModalCode`,
						)}
						defaultLabel={''}
						handleChangeInput={value => this.handleChangeFieldValue('confirmationModalCode', value)}
						inputValue={this.state.confirmationModalCode}
						handleFocusInput={() => this.handleChangeFieldFocus(`confirmationModalCodeFocused`)}
						classNameLabel="td-email-form__label"
						classNameInput="td-email-form__input"
						autoFocus={true}
					/>
				</div>
				<button disabled={isDisabled} onClick={this.handleSubmitConfirmationModal} className="w-100 green-btn">
					{this.translate('page.body.wallets.beneficiaries.confirmationModal.body.button')}
				</button>
			</NewModal>
		);
	}

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

	private handleSubmitConfirmationModal = () => {
		const { beneficiariesAddData } = this.props;
		const { confirmationModalCode } = this.state;

		if (beneficiariesAddData) {
			const payload = {
				pin: confirmationModalCode,
				id: beneficiariesAddData.id,
			};

			this.props.activateAddress(payload);
		}
	};

	private translate = (id: string) => this.props.intl.formatMessage({ id });
}

const mapStateToProps = (state: RootState): ReduxProps => ({
	beneficiariesActivateError: selectBeneficiariesActivateError(state),
	beneficiariesActivateSuccess: selectBeneficiariesActivateSuccess(state),
	isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
	activateAddress: payload => dispatch(beneficiariesActivate(payload)),
});

// tslint:disable-next-line:no-any
export const BeneficiariesActivateModal = injectIntl(
	connect(mapStateToProps, mapDispatchToProps)(BeneficiariesActivateModalComponent) as any,
) as any;
