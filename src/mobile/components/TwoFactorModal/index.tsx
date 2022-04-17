import td from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { CustomInput } from '../../../components/CustomInput';
import { NewModal } from '../NewModal';

export const TwoFactorModalComponent = props => {
	const [code2FA, setCode2FA] = React.useState('');
	const [code2FAFocus, setCode2FAFocus] = React.useState(false);
	const intl = useIntl();

	const handleToggle2FA = shouldFetch => {
		props.handleToggle2FA(code2FA, shouldFetch);
		setCode2FA('');
	};

	const renderModalBody = () => {
		const code2FAClass = td('td-email-form__group', {
			'td-email-form__group--focused': code2FAFocus,
		});

		return (
			<div className="pg-exchange-modal-submit-body pg-exchange-modal-submit-body-2fa">
				<div className="mb-2">
					<span className="pg-exchange-modal-submit-body-2fa__subtitle text-white">
						{intl.formatMessage({ id: 'page.mobile.twoFactorModal.subtitle' })}
					</span>
				</div>
				<div className={code2FAClass}>
					<CustomInput
						type="text"
						label="2FA code"
						placeholder="2FA code"
						defaultLabel=""
						handleFocusInput={() => setCode2FAFocus(true)}
						handleChangeInput={setCode2FA}
						inputValue={code2FA}
						classNameLabel="td-email-form__label"
						classNameInput="td-email-form__input"
						autoFocus={true}
					/>
				</div>
			</div>
		);
	};

	const renderModalFooter = () => {
		const isValid2FA = code2FA.match('^[0-9]{6}$');

		return (
			<div className="pg-exchange-modal-submit-footer mt-3">
				<button className="w-100 green-btn" disabled={!isValid2FA} onClick={() => handleToggle2FA(true)}>
					{intl.formatMessage({ id: 'page.mobile.twoFactorModal.send' })}
				</button>
			</div>
		);
	};

	return (
		<div className="td-mobile-two-fa-modal">
			<NewModal
				show={props.showModal}
				onClose={() => handleToggle2FA(false)}
				title={intl.formatMessage({ id: 'page.mobile.twoFactorModal.title' })}
			>
				{renderModalBody()}
				{renderModalFooter()}
			</NewModal>
		</div>
	);
};

export const TwoFactorModal = React.memo(TwoFactorModalComponent);
