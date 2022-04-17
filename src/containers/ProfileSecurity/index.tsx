import classnames from 'classnames';
import { NewCustomInput, NewModal } from 'components';
import { PASSWORD_REGEX } from 'helpers';
import { changePasswordFetch, getKycStatus, selectKycStatus, selectUserInfo, toggle2faFetch } from 'modules';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

// tslint:disable-next-line: no-empty-interface
interface ProfileSecurityProps {}

export const ProfileSecurity: React.FC<ProfileSecurityProps> = () => {
	const intl = useIntl();
	const history = useHistory();
	const dispatch = useDispatch();

	const user = useSelector(selectUserInfo);
	const kycStatus = useSelector(selectKycStatus);

	React.useEffect(() => {
		dispatch(getKycStatus());
	}, []);

	const [showChangeModal, setShowChangeModal] = React.useState(false);
	const [showModal2Fa, setShowModal2Fa] = React.useState(false);
	const [code2Fa, setCode2Fa] = React.useState('');
	const [code2FaFocus, setCode2FaFocus] = React.useState(false);

	const [formPassword, setFormPassword] = React.useState({
		oldPassword: '',
		newPassword: '',
		confirmationPassword: '',
	});

	const [formPasswordFocus, setFormPasswordFocus] = React.useState({
		oldPasswordFocus: false,
		newPasswordFocus: false,
		confirmPasswordFocus: false,
	});

	const handleChange2FaCode = (value: string) => {
		setCode2Fa(value);
	};

	const handleDisable2Fa = () => {
		dispatch(toggle2faFetch({ code: code2Fa, enable: false }));
		setCode2Fa('');
	};

	const handleCloseChange = () => {
		setShowChangeModal(false);
	};
	const handleShowChange = () => {
		setShowChangeModal(true);
	};
	const handleClose2Fa = () => {
		setShowModal2Fa(false);
	};
	const handleShow2Fa = () => {
		setShowModal2Fa(true);
	};

	const handleFieldFocus = (field: string) => {
		setFormPasswordFocus(prev => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	const handleFieldPassword = (field: string, value: string) => {
		setFormPassword(prev => ({
			...prev,
			[field]: value,
		}));
	};

	const isValidForm = () => {
		const { confirmationPassword, oldPassword, newPassword } = formPassword;
		const isNewPasswordValid = newPassword.match(PASSWORD_REGEX);
		const isConfirmPasswordValid = newPassword === confirmationPassword;

		return oldPassword && isNewPasswordValid && isConfirmPasswordValid;
	};

	const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();

		dispatch(
			changePasswordFetch({
				confirm_password: formPassword.confirmationPassword,
				old_password: formPassword.oldPassword,
				new_password: formPassword.newPassword,
			}),
		);
	};

	const renderBodyModalChangePassword = () => {
		if (!showChangeModal) {
			return null;
		}

		const { oldPassword, newPassword, confirmationPassword } = formPassword;
		const { oldPasswordFocus, newPasswordFocus, confirmPasswordFocus } = formPasswordFocus;

		const oldPasswordClass = classnames('td-email-form__group', {
			'td-email-form__group--focused': oldPasswordFocus,
		});

		const newPasswordClass = classnames('td-email-form__group', {
			'td-email-form__group--focused': newPasswordFocus,
		});

		const confirmPasswordClass = classnames('td-email-form__group', {
			'td-email-form__group--focused': confirmPasswordFocus,
		});

		return (
			<form className="td-email-form" onSubmit={handleChangePassword}>
				<div className={oldPasswordClass}>
					<NewCustomInput
						type="password"
						label={intl.formatMessage({ id: 'page.body.profile.header.account.content.password.old' })}
						placeholder={intl.formatMessage({
							id: 'page.body.profile.header.account.content.password.old',
						})}
						defaultLabel="Old password"
						handleChangeInput={value => {
							handleFieldPassword('oldPassword', value);
						}}
						inputValue={oldPassword}
						handleFocusInput={() => {
							handleFieldFocus('oldPasswordFocus');
						}}
						classNameLabel="td-email-form__label"
						classNameInput="td-email-form__input"
						autoFocus={true}
					/>
				</div>
				<div className={newPasswordClass}>
					<NewCustomInput
						type="password"
						label={intl.formatMessage({ id: 'page.body.profile.header.account.content.password.new' })}
						placeholder={intl.formatMessage({
							id: 'page.body.profile.header.account.content.password.new',
						})}
						defaultLabel="New password"
						handleChangeInput={value => {
							handleFieldPassword('newPassword', value);
						}}
						inputValue={newPassword}
						handleFocusInput={() => {
							handleFieldFocus('newPasswordFocus');
						}}
						classNameLabel="td-email-form__label"
						classNameInput="td-email-form__input"
						autoFocus={false}
					/>
				</div>
				<div className={confirmPasswordClass}>
					<NewCustomInput
						type="password"
						label={intl.formatMessage({ id: 'page.body.profile.header.account.content.password.conf' })}
						placeholder={intl.formatMessage({
							id: 'page.body.profile.header.account.content.password.conf',
						})}
						defaultLabel="Password confirmation"
						handleChangeInput={value => {
							handleFieldPassword('confirmationPassword', value);
						}}
						inputValue={confirmationPassword}
						handleFocusInput={() => {
							handleFieldFocus('confirmPasswordFocus');
						}}
						classNameLabel="td-email-form__label"
						classNameInput="td-email-form__input"
						autoFocus={false}
					/>
				</div>
				<div className="td-email-form__button-wrapper d-flex justify-content-center">
					<Button
						disabled={!isValidForm()}
						type="submit"
						style={{
							background: '#FFB800',
							border: '1px solid #848E9C',
							borderRadius: '23.5px',
						}}
						className="w-50 m-auto"
						variant="primary"
						size="lg"
					>
						{intl.formatMessage({ id: 'page.body.profile.header.account.content.password.button.change' })}
					</Button>
				</div>
			</form>
		);
	};

	const handleNavigateTo2fa = () => {
		if (!user.otp) {
			history.push('/security/2fa', { enable2fa: !user.otp });
		} else {
			setShowModal2Fa(false);
		}
	};

	const renderBodyModal2Fa = () => {
		const code2FaClass = classnames('td-email-form__group', {
			'td-email-form__group--focused': code2FaFocus,
		});
		const isValid2Fa = code2Fa.match('^[0-9]{6}$');

		return (
			<form className="td-email-form" onSubmit={handleDisable2Fa}>
				<div className={code2FaClass}>
					<NewCustomInput
						type="text"
						label="2FA code"
						placeholder="2FA code"
						defaultLabel=""
						handleFocusInput={() => {
							setCode2FaFocus(true);
						}}
						handleChangeInput={handleChange2FaCode}
						inputValue={code2Fa}
						classNameLabel="d-none"
						classNameInput="td-email-form__input"
						autoFocus={true}
					/>
				</div>
				<div className="td-email-form__button-wrapper d-flex justify-content-center">
					<Button
						block={true}
						disabled={!isValid2Fa}
						style={{
							background: '#FFB800',
							border: '1px solid #848E9C',
							borderRadius: '23.5px',
						}}
						onClick={handleDisable2Fa}
						className="w-50"
						size="lg"
						variant="primary"
					>
						{intl.formatMessage({
							id: 'page.body.profile.header.account.content.twoFactorAuthentication.disable',
						})}
					</Button>
				</div>
			</form>
		);
	};

	return (
		<div className="td-pg-profile--bg td-pg-profile--radius td-pg-profile__content__item td-pg-profile__security">
			<div className="td-pg-profile__content__item__header">
				<div className="td-pg-profile__content__item__header__title">
					{intl.formatMessage({ id: 'page.profile.security.title.security' })}
				</div>
			</div>
			<div className="td-pg-profile__content__item__content">
				<div className="td-pg-profile__inner">
					<div className="td-pg-profile__security__row-item">
						<div className="td-pg-profile__security__item__left">
							<div className="td-pg-profile__security__row-item__title">
								{intl.formatMessage({ id: 'page.profile.security.enable2FA.title' })}
							</div>
							<div
								className="td-pg-profile__security__row-item__action"
								onClick={user.otp ? handleShow2Fa : handleNavigateTo2fa}
							>
								{user.otp
									? intl.formatMessage({ id: 'page.profile.security.enable2FA.toggle.off' })
									: intl.formatMessage({ id: 'page.profile.security.enable2FA.toggle.on' })}
							</div>
						</div>
						<div className="td-pg-profile__security__item__right">
							<div className="td-pg-profile__security__row-item__title">
								{intl.formatMessage({ id: 'page.profile.security.identify.title' })}
							</div>
							<div
								className="td-pg-profile__security__row-item__action"
								onClick={() => history.push('/profile/kyc')}
							>
								{kycStatus && kycStatus.status === 'verify' ? (
									<span className="text-success" style={{ textDecoration: 'underline green' }}>
										{intl.formatMessage({ id: 'page.body.profile.verification.verified' })}
									</span>
								) : (
									intl.formatMessage({ id: 'page.profile.security.identify.verify' })
								)}
							</div>
						</div>
					</div>
					<div className="td-pg-profile__security__row-item">
						<div className="td-pg-profile__security__item__left">
							<div className="td-pg-profile__security__row-item__title">
								{intl.formatMessage({ id: 'page.profile.security.changePassword.title' })}
							</div>
							<div className="td-pg-profile__security__row-item__action" onClick={handleShowChange}>
								{intl.formatMessage({ id: 'page.profile.security.changePassword.change' })}
							</div>
						</div>
						<div className="td-pg-profile__security__item__right"></div>
					</div>
				</div>
				<NewModal
					show={showChangeModal}
					onHide={handleCloseChange}
					titleModal={<FormattedMessage id="page.body.profile.header.account.content.password.change" />}
					bodyModal={renderBodyModalChangePassword()}
				/>
				<NewModal
					show={showModal2Fa}
					onHide={handleClose2Fa}
					titleModal={
						<FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.modalHeader" />
					}
					bodyModal={renderBodyModal2Fa()}
				/>
			</div>
		</div>
	);
};
