import cr from 'classnames';
import { FormInput } from '../../components';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { EMAIL_REGEX } from '../../helpers';
import { selectMobileDeviceState } from '../../modules/public/globalSettings';

export interface EmailFormProps {
	title?: string;
	buttonLabel?: string;
	errorMessage?: string;
	isLoading?: boolean;
	OnSubmit: () => void;
	className?: string;
	emailLabel?: string;
	email: string;
	message: string;
	emailError: string;
	emailFocused: boolean;
	placeholder?: string;
	validateForm: () => void;
	handleInputEmail: (value: string) => void;
	handleFieldFocus: () => void;
	handleReturnBack: () => void;
}

const EmailForm = React.memo((props: EmailFormProps) => {
	const isMobileDevice = useSelector(selectMobileDeviceState);

	const { title, buttonLabel, isLoading, emailLabel, message, email, emailFocused, emailError } = props;

	const handleCancel = () => {
		props.handleReturnBack();
	};

	const handleSubmitForm = () => {
		props.OnSubmit();
	};

	const isValidForm = () => {
		const isEmailValid = email.match(EMAIL_REGEX);

		return email && isEmailValid;
	};

	const handleClick = (label?: string, e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
		if (e) {
			e.preventDefault();
		}
		if (!isValidForm()) {
			props.validateForm();
		} else {
			handleSubmitForm();
		}
	};

	const emailGroupClass = cr('cr-email-form__group', {
		'cr-email-form__group--focused': emailFocused,
	});

	return (
		<form>
			<div className="cr-email-form">
				{!isMobileDevice && (
					<div className="cr-email-form__options-group">
						<div className="cr-email-form__option">
							<div className="cr-email-form__option-inner">
								{title || 'Forgot password'}
								<div className="cr-email-form__cros-icon" onClick={handleCancel}>
									<CloseIcon className="close-icon" />
								</div>
							</div>
						</div>
					</div>
				)}
				<div className="cr-email-form__form-content">
					<div className="cr-email-form__header">{message}</div>
					<div className={emailGroupClass}>
						<FormInput
							type="email"
							label={emailLabel || 'Email'}
							placeholder={emailLabel || 'Email'}
							defaultLabel="Email"
							handleChangeInput={props.handleInputEmail}
							inputValue={email}
							handleFocusInput={props.handleFieldFocus}
							classNameLabel="cr-email-form__label"
							classNameInput="cr-email-form__input"
							autoFocus={true}
						/>
						{emailError && <div className="cr-email-form__error">{emailError}</div>}
					</div>
					<div className="cr-email-form__button-wrapper">
						<Button
							style={{
								background: '#FFB800',
								border: '1px solid #848E9C',
								borderRadius: '23.5px',
							}}
							block={true}
							type="button"
							disabled={isLoading || !email.match(EMAIL_REGEX)}
							onClick={e => handleClick(undefined, e)}
							size="lg"
							variant="primary"
						>
							{isLoading ? 'Loading...' : buttonLabel ? buttonLabel : 'Send'}
						</Button>
					</div>
				</div>
			</div>
		</form>
	);
});

export { EmailForm };
