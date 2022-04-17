import { Button, Form, Input } from 'antd';
import { ERROR_EMPTY_PASSWORD, ERROR_INVALID_EMAIL, isEmail, setDocumentTitle } from 'helpers';
import { GoBackIcon } from 'mobile/assets/icons';
import { TwoFactorModal } from 'mobile/components';
import {
	selectSignInRequire2FA,
	selectSignUpRequireVerification,
	selectUserLoggedIn,
	signIn,
	signInError,
	signInRequire2FA,
	signUpRequireVerification,
} from 'modules';
import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

export const NewSignInMobileScreen: FC = () => {
	const intl = useIntl();
	const history = useHistory();
	const dispatch = useDispatch();

	const isLoggedIn = useSelector(selectUserLoggedIn);
	const requireEmailVerification = useSelector(selectSignUpRequireVerification);
	const require2FA = useSelector(selectSignInRequire2FA);
	const [email, setEmail] = useState<string>('');
	const [emailError, setEmailError] = useState<string>('');
	const setEmailFocused = useState(false)[1];
	const [password, setPassword] = useState<string>('');
	const [passwordError, setPasswordError] = useState<string>('');
	const setPasswordFocused = useState(false)[1];

	React.useEffect(() => {
		setDocumentTitle(intl.formatMessage({ id: 'page.header.signIn' }));
		dispatch(signInError({ code: 0, message: [''] }));
		dispatch(signUpRequireVerification({ requireVerification: false }));
	}, []);

	React.useEffect(() => {
		if (isLoggedIn) {
			history.push('/wallets');
		}
	}, [isLoggedIn]);

	React.useEffect(() => {
		if (requireEmailVerification) {
			history.push('/email-verification', { email });
		}
	}, [requireEmailVerification]);

	const onSubmit = (e: any) => {
		dispatch(
			signIn({
				email,
				password,
			}),
		);
	};

	const canSubmit = (): boolean => {
		return Boolean(email && password && isEmail(email));
	};

	const handle2FASignIn = (code2Fa: string, shouldFetch: boolean) => {
		if (shouldFetch) {
			dispatch(
				signIn({
					email,
					password,
					otp_code: code2Fa,
				}),
			);
		} else {
			dispatch(signInRequire2FA({ require2fa: false }));
		}
	};

	const handleStatusPassword = (): '' | 'success' | 'error' => {
		if (password && !passwordError) {
			return 'success';
		} else if (passwordError) {
			return 'error';
		}

		return '';
	};

	const handleChangePassword: React.ChangeEventHandler<HTMLInputElement> = e => {
		setPassword(e.target.value);
		!e.target.value ? setPasswordError(intl.formatMessage({ id: ERROR_EMPTY_PASSWORD })) : setPasswordError('');
	};

	const handlePasswordFocus = () => {
		setPasswordFocused(prev => {
			if (prev && !password) {
				setPasswordError(intl.formatMessage({ id: ERROR_EMPTY_PASSWORD }));
			}

			return !prev;
		});
	};

	const handleChangeEmail: React.ChangeEventHandler<HTMLInputElement> = e => {
		setEmail(e.target.value);
		!isEmail(e.target.value) ? setEmailError(intl.formatMessage({ id: ERROR_INVALID_EMAIL })) : setEmailError('');
	};

	const handleEmailFocus = () => {
		setEmailFocused(prev => {
			prev && !email && setEmailError(intl.formatMessage({ id: ERROR_INVALID_EMAIL }));

			return !prev;
		});
	};

	const handleStatusEmail = (): '' | 'success' | 'error' => {
		if (email && !emailError) {
			return 'success';
		} else if (emailError) {
			return 'error';
		}

		return '';
	};

	const renderForm = () => {
		return (
			<Form className="td-mobile-screen-login__body__form w-100" layout="vertical" onFinish={onSubmit}>
				<h4 className="td-mobile-screen-login__body__form__title">
					{intl.formatMessage({ id: 'page.mobile.home.signIn.signIn' })}
				</h4>
				<span className="td-mobile-screen-login__body__form__description">
					{intl.formatMessage({ id: 'page.mobile.home.signIn.wanningCheck' })}
				</span>
				<div className="td-mobile-screen-login__body__form__site">
					<div className="td-mobile-screen-login__body__form__site__lock">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="css-1mb79dz">
							<path
								d="M16.27 10.5V8.07C16.27 5.82 14.45 4 12.2 4S8.13 5.82 8.13 8.07v2.43H6v8.94h12.43V10.5h-2.16zm-3.07 6.46h-2v-4h2v4zm1.07-6.46h-4.14V8.07c0-1.14.93-2.07 2.07-2.07 1.14 0 2.07.93 2.07 2.07v2.43z"
								fill="currentColor"
							></path>
						</svg>
					</div>
					<div className="td-mobile-screen-login__body__form__site__name">
						<span>https://</span>
						papercash.one
					</div>
				</div>
				<Form.Item
					className="td-mobile-screen-login__body__form__label"
					label={intl.formatMessage({ id: 'page.mobile.home.signIn.email' })}
					name="email"
					hasFeedback
					help={emailError === '' ? undefined : emailError}
					validateStatus={handleStatusEmail()}
				>
					<Input
						className="td-mobile-screen-login__body__form__label__input"
						value={email}
						placeholder={intl.formatMessage({ id: 'page.mobile.home.signIn.emailInput' })}
						onChange={handleChangeEmail}
						onClick={handleEmailFocus}
						onBlur={handleEmailFocus}
					/>
				</Form.Item>

				<Form.Item
					className="td-mobile-screen-login__body__form__label mb-4"
					label={intl.formatMessage({ id: 'page.mobile.home.signIn.password' })}
					name="password"
					hasFeedback
					help={passwordError === '' ? undefined : passwordError}
					validateStatus={handleStatusPassword()}
				>
					<Input.Password
						className="td-mobile-screen-login__body__form__label__input"
						value={password}
						placeholder={intl.formatMessage({ id: 'page.mobile.home.signIn.passwordInput' })}
						onChange={handleChangePassword}
						onClick={handlePasswordFocus}
						onBlur={handlePasswordFocus}
					/>
				</Form.Item>

				<Form.Item className="td-mobile-screen-login__body__form__submit">
					<Button
						className="td-mobile-screen-login__body__form__submit__btn"
						htmlType="submit"
						type="primary"
						disabled={!canSubmit()}
					>
						{intl.formatMessage({ id: 'page.mobile.home.signIn.signIn' })}
					</Button>
				</Form.Item>

				<div className="td-mobile-screen-login__body__form__links">
					<Link to="/forgot_password">{intl.formatMessage({ id: 'page.mobile.home.signIn.forgotPassword' })}</Link>
					<Link to="/register">{intl.formatMessage({ id: 'page.mobile.home.signIn.register' })}</Link>
				</div>
			</Form>
		);
	};

	return (
		<div>
			<div className="td-mobile-screen-login">
				<div className="td-mobile-screen-login__header">
					<GoBackIcon onClick={() => history.goBack()} />
				</div>
				<div className="td-mobile-screen-login__body">
					<TwoFactorModal
						showModal={Boolean(require2FA)}
						buttonLabel={intl.formatMessage({ id: 'page.header.signIn' })}
						handleToggle2FA={handle2FASignIn}
					/>
					{renderForm()}
				</div>
				<div className="td-mobile-screen-login__footer">
					{intl.formatMessage({ id: 'page.mobile.home.signIn.footer' })}
				</div>
			</div>
		</div>
	);
};
