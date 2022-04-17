import { CaretDownOutlined } from '@ant-design/icons';
import cr from 'classnames';
import * as React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { FormInput, PasswordStrengthMeter } from '../';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../../helpers';
import { selectMobileDeviceState } from '../../modules/public/globalSettings';

export interface RegisterFormProps {
	isLoading?: boolean;
	title?: string;
	onSignUp: () => void;
	onSignIn?: () => void;
	className?: string;
	image?: string;
	labelSignIn?: string;
	labelSignUp?: string;
	emailLabel?: string;
	passwordLabel?: string;
	confirmPasswordLabel?: string;
	referalCodeLabel?: string;
	termsMessage?: string;
	refId: string;
	password: string;
	email: string;
	confirmPassword: string;
	handleChangeEmail: (value: string) => void;
	handleChangePassword: (value: string) => void;
	handleChangeConfirmPassword: (value: string) => void;
	handleChangeRefId: (value: string) => void;
	hasConfirmed: boolean;
	clickCheckBox: (e) => void;
	validateForm: () => void;
	emailError: string;
	passwordError: string;
	confirmationError: string;
	handleFocusEmail: () => void;
	handleFocusPassword: () => void;
	handleFocusConfirmPassword: () => void;
	handleFocusRefId: () => void;
	// handleDropdown: () => void;
	confirmPasswordFocused: boolean;
	refIdFocused: boolean;
	emailFocused: boolean;
	passwordFocused: boolean;
	captchaType: 'recaptcha' | 'geetest' | 'none';
	renderCaptcha: JSX.Element | null;
	reCaptchaSuccess: boolean;
	geetestCaptchaSuccess: boolean;
	captcha_response: string;
	currentPasswordEntropy: number;
	minPasswordEntropy: number;
	passwordErrorFirstSolved: boolean;
	passwordErrorSecondSolved: boolean;
	passwordErrorThirdSolved: boolean;
	passwordPopUp: boolean;
	myRef: any;
	passwordWrapper: any;
	translate: (id: string) => string;
}

export const Register = (props: RegisterFormProps) => {
	const isMobileDevice = useSelector(selectMobileDeviceState);
	const history = useHistory();
	const intl = useIntl();

	const [dropdown, setDropdown] = React.useState(false);

	const {
		email,
		confirmPassword,
		refId,
		onSignIn,
		image,
		isLoading,
		// labelSignIn,
		labelSignUp,
		emailLabel,
		confirmPasswordLabel,
		passwordFocused,
		referalCodeLabel,
		termsMessage,
		captchaType,
		geetestCaptchaSuccess,
		hasConfirmed,
		reCaptchaSuccess,
		currentPasswordEntropy,
		passwordPopUp,
		password,
		passwordLabel,
		emailError,
		translate,
		confirmationError,
		emailFocused,
		confirmPasswordFocused,
		refIdFocused,
	} = props;

	const handleDropdown = () => {
		setDropdown(!dropdown);
	};
	const renderFormInput = (): any | boolean => {
		if (dropdown) {
			return (
				<React.Fragment>
					<FormInput
						type="text"
						label={''}
						placeholder={referalCodeLabel || 'Referral code'}
						defaultLabel="Referral code"
						handleChangeInput={props.handleChangeRefId}
						inputValue={refId}
						handleFocusInput={props.handleFocusRefId}
						classNameLabel="d-none"
						classNameInput="cr-sign-up-form__input"
						autoFocus={false}
					/>
				</React.Fragment>
			);
		}
	};
	const disableButton = (): boolean => {
		if (!hasConfirmed || isLoading || !email.match(EMAIL_REGEX) || !password || !confirmPassword) {
			return true;
		}
		if (captchaType === 'recaptcha' && !reCaptchaSuccess) {
			return true;
		}
		if (captchaType === 'geetest' && !geetestCaptchaSuccess) {
			return true;
		}

		return false;
	};

	const renderPasswordInput = () => {
		const passwordGroupClass = cr('cr-sign-up-form__group', {
			'cr-sign-up-form__group--focused': passwordFocused,
		});

		return (
			<div className={passwordGroupClass}>
				<FormInput
					type="password"
					label={passwordLabel || 'Password'}
					placeholder={passwordLabel || 'Password'}
					defaultLabel="Password"
					handleChangeInput={props.handleChangePassword}
					inputValue={password}
					handleFocusInput={props.handleFocusPassword}
					classNameLabel="cr-sign-up-form__label"
					classNameInput="cr-sign-up-form__input"
					autoFocus={false}
				/>
				{password ? (
					<PasswordStrengthMeter
						minPasswordEntropy={props.minPasswordEntropy}
						currentPasswordEntropy={currentPasswordEntropy}
						passwordExist={password !== ''}
						passwordErrorFirstSolved={props.passwordErrorFirstSolved}
						passwordErrorSecondSolved={props.passwordErrorSecondSolved}
						passwordErrorThirdSolved={props.passwordErrorThirdSolved}
						passwordPopUp={passwordPopUp}
						translate={translate}
					/>
				) : null}
			</div>
		);
	};

	const handleSubmitForm = () => {
		props.onSignUp();
	};

	const isValidForm = () => {
		const isEmailValid = props.email.match(EMAIL_REGEX);
		const isPasswordValid = props.password.match(PASSWORD_REGEX);
		const isConfirmPasswordValid = props.password === props.confirmPassword;

		return email && isEmailValid && props.password && isPasswordValid && confirmPassword && isConfirmPasswordValid;
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

	const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();

			handleClick();
		}
	};

	const renderLogIn = () => {
		return (
			<div className="pg-sign-up-screen__login">
				<span>
					{intl.formatMessage({ id: 'page.header.signUp.alreadyRegistered' })}
					<span onClick={() => history.push('/login')} className="pg-sign-up-screen__login-button">
						{intl.formatMessage({ id: 'page.mobile.header.signIn' })}
					</span>
				</span>
			</div>
		);
	};

	const emailGroupClass = cr('cr-sign-up-form__group', {
		'cr-sign-up-form__group--focused': emailFocused,
	});

	const confirmPasswordGroupClass = cr('cr-sign-up-form__group', {
		'cr-sign-up-form__group--focused': confirmPasswordFocused,
	});
	const refIdGroupClass = cr('cr-sign-up-form__group', {
		'cr-sign-up-form__group--focused': refIdFocused,
	});
	const logo = image ? (
		<h1 className="cr-sign-up-form__title">
			<img className="cr-sign-up-form__image" src={image} alt="logo" />
		</h1>
	) : null;

	return (
		<form>
			<div className="cr-sign-up-form" onKeyPress={handleEnterPress}>
				<div className="cr-sign-up-form__form-content">
					{logo}
					<div
						data-bn-type="text"
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							borderRadius: '10px',
						}}
					>
						<div
							data-bn-type="text"
							style={{
								fontSize: '24px',
								lineHeight: '33px',
								color: '#FFFFFF',
								fontWeight: 'bold',
								marginTop: '1rem',
								padding: '1rem',
							}}
						>
							{intl.formatMessage({ id: 'page.header.signUp.create' })}
						</div>
						<div
							data-bn-type="text"
							style={{
								fontSize: '16px',
								textAlign: 'center',
								marginBottom: '18px',
								color: '#696969',
								lineHeight: '22px',
							}}
						>
							{intl.formatMessage({ id: 'page.header.signUp.welcome' })}
						</div>
					</div>
					<div className={emailGroupClass}>
						<FormInput
							type="email"
							label={emailLabel || 'Email'}
							placeholder={emailLabel || 'Email'}
							defaultLabel="Email"
							handleChangeInput={props.handleChangeEmail}
							inputValue={email}
							handleFocusInput={props.handleFocusEmail}
							classNameLabel="cr-sign-up-form__label"
							classNameInput="cr-sign-up-form__input"
							autoFocus={true}
						/>
						{emailError && <div className="cr-sign-up-form__error">{emailError}</div>}
					</div>
					{renderPasswordInput()}
					<div className={confirmPasswordGroupClass}>
						<FormInput
							type="password"
							label={confirmPasswordLabel || 'Confirm Password'}
							placeholder={confirmPasswordLabel || 'Confirm Password'}
							defaultLabel="Confirm Password"
							handleChangeInput={props.handleChangeConfirmPassword}
							inputValue={confirmPassword}
							handleFocusInput={props.handleFocusConfirmPassword}
							classNameLabel="cr-sign-up-form__label"
							classNameInput="cr-sign-up-form__input"
							autoFocus={false}
						/>
						{confirmationError && <div className={'cr-sign-up-form__error'}>{confirmationError}</div>}
					</div>
					<div className={refIdGroupClass}>
						<p style={{ cursor: 'pointer' }} onClick={handleDropdown}>
							{intl.formatMessage({ id: 'page.header.signUp.referalId' })}
							<CaretDownOutlined />
						</p>
						{renderFormInput()}
					</div>

					<Form className="cr-sign-up-form__group" onClick={e => props.clickCheckBox(e)}>
						<Form.Check
							type="checkbox"
							custom
							id="agreeWithTerms"
							checked={hasConfirmed}
							label={termsMessage ? termsMessage : intl.formatMessage({ id: 'page.header.signUp.terms2' })}
						/>
					</Form>
					{props.renderCaptcha}
					<div className="cr-sign-up-form__button-wrapper">
						<Button
							style={{
								background: '#FFB800',
								border: '1px solid #848E9C',
								borderRadius: '23.5px',
							}}
							block={true}
							type="button"
							disabled={disableButton()}
							onClick={e => handleClick(undefined, e)}
							size="lg"
							variant="primary"
						>
							{isLoading ? 'Loading...' : labelSignUp ? labelSignUp : 'Sign up'}
						</Button>

						<div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
							{intl.formatMessage({ id: 'page.header.signUp.already' })}
							<span data-bn-type="link" className="cr-sign-up-form__button-wrapper__login" onClick={onSignIn}>
								{intl.formatMessage({ id: 'page.header.signIn' })}
							</span>
						</div>
					</div>

					{isMobileDevice && renderLogIn()}
				</div>
			</div>
		</form>
	);
};
