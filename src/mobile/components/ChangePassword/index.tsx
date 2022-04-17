import td from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { CustomInput } from '../../components';
import { PASSWORD_REGEX } from '../../../helpers';

export const ChangePasswordComponent = props => {
	const [oldPassword, setOldPassword] = React.useState('');
	const [newPassword, setNewPassword] = React.useState('');
	const [confirmationPassword, setConfirmationPassword] = React.useState('');
	const [oldPasswordFocus, setOldPasswordFocus] = React.useState(false);
	const [newPasswordFocus, setNewPasswordFocus] = React.useState(false);
	const [confirmPasswordFocus, setConfirmPasswordFocus] = React.useState(false);
	const intl = useIntl();

	const handleChangePassword = () => {
		props.handleChangePassword({
			old_password: oldPassword,
			new_password: newPassword,
			confirm_password: confirmationPassword,
		});

		setOldPassword('');
		setNewPassword('');
		setConfirmationPassword('');
		setOldPasswordFocus(false);
		setNewPasswordFocus(false);
		setConfirmPasswordFocus(false);
	};

	const renderBody = () => {
		const oldPasswordClass = td('td-email-form__group mt-3', {
			'td-email-form__group--focused': oldPasswordFocus,
		});

		const newPasswordClass = td('td-email-form__group mt-3', {
			'td-email-form__group--focused': newPasswordFocus,
		});

		const confirmPasswordClass = td('td-email-form__group mt-3', {
			'td-email-form__group--focused': confirmPasswordFocus,
		});

		return (
			<div className="pg-mobile-change-password__body mt-5">
				<div className={oldPasswordClass}>
					<CustomInput
						type="password"
						label={intl.formatMessage({ id: 'page.body.profile.header.account.content.password.old' })}
						placeholder={intl.formatMessage({ id: 'page.body.profile.header.account.content.password.old' })}
						defaultLabel="Old password"
						handleChangeInput={setOldPassword}
						inputValue={oldPassword}
						handleFocusInput={() => setOldPasswordFocus(true)}
						classNameLabel="td-email-form__label"
						classNameInput="td-email-form__input"
						autoFocus={true}
					/>
				</div>
				<div className={newPasswordClass}>
					<CustomInput
						type="password"
						label={intl.formatMessage({ id: 'page.body.profile.header.account.content.password.new' })}
						placeholder={intl.formatMessage({ id: 'page.body.profile.header.account.content.password.new' })}
						defaultLabel="New password"
						handleChangeInput={setNewPassword}
						inputValue={newPassword}
						handleFocusInput={() => setNewPasswordFocus(true)}
						classNameLabel="td-email-form__label"
						classNameInput="td-email-form__input"
						autoFocus={false}
					/>
				</div>
				<div className={confirmPasswordClass}>
					<CustomInput
						type="password"
						label={intl.formatMessage({ id: 'page.body.profile.header.account.content.password.conf' })}
						placeholder={intl.formatMessage({ id: 'page.body.profile.header.account.content.password.conf' })}
						defaultLabel="Password confirmation"
						handleChangeInput={setConfirmationPassword}
						inputValue={confirmationPassword}
						handleFocusInput={() => setConfirmPasswordFocus(true)}
						classNameLabel="td-email-form__label"
						classNameInput="td-email-form__input"
						autoFocus={false}
					/>
				</div>
			</div>
		);
	};

	const renderFooter = () => {
		const isValidForm = () => {
			const isNewPasswordValid = newPassword.match(PASSWORD_REGEX);
			const isConfirmPasswordValid = newPassword === confirmationPassword;

			return oldPassword && isNewPasswordValid && isConfirmPasswordValid;
		};

		return (
			<div className="pg-mobile-change-password__footer mt-3">
				<button className="w-100" disabled={!isValidForm} onClick={handleChangePassword}>
					{intl.formatMessage({ id: 'page.body.profile.header.account.content.password.button.change' })}
				</button>
			</div>
		);
	};

	return (
		<div className="pg-mobile-change-password">
			{renderBody()}
			{renderFooter()}
		</div>
	);
};

export const ChangePassword = React.memo(ChangePasswordComponent);
