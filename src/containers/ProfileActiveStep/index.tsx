import classnames from 'classnames';
import { selectUserInfo, selectUserLoggedIn, selectWallets } from 'modules';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';

// tslint:disable-next-line: no-empty-interface
interface ProfileActiveStepProps {}

export const ProfileActiveStep: React.FC<ProfileActiveStepProps> = () => {
	const history = useHistory();
	const isLoggedIn = useSelector(selectUserLoggedIn);
	const user = useSelector(selectUserInfo);
	const wallet = useSelector(selectWallets);
	const intl = useIntl();

	const isExistBalance =
		wallet.reduce((prev, current) => {
			const result = prev + (current.balance ? +current.balance : 0);

			return result;
		}, 0) > 0;

	const svgActive = (
		<svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M3.99993 7.8L1.19993 5L0.266602 5.93334L3.99993 9.66667L11.9999 1.66667L11.0666 0.733337L3.99993 7.8Z"
				fill="white"
			/>
		</svg>
	);

	const handleNavigateTo2fa = () => {
		if (!user.otp) {
			history.push('/security/2fa', { enable2fa: !user.otp });
		}
	};

	const handleToWallet = () => {
		history.push('/wallets');
	};

	return (
		<div className="td-pg-profile--radius td-pg-profile__active-step">
			<h1 className="td-pg-profile__active-step__tile">
				{intl.formatMessage({ id: 'page.profile.activeStep.title.welcome' })}
			</h1>
			<span className="td-pg-profile__active-step__desc">
				{intl.formatMessage({ id: 'page.profile.activeStep.desc.just' })}
			</span>
			<div className="td-pg-profile__active-step__content d-flex">
				<div className="td-pg-profile__active-step__content__item">
					<span
						className={classnames('td-pg-profile__active-step__content__item__step', {
							'td-pg-profile__active-step__content__item__step--active': isLoggedIn,
						})}
					>
						{isLoggedIn ? svgActive : '1'}
					</span>
					<h5 className="td-pg-profile__active-step__content__item__title">
						{intl.formatMessage({ id: 'page.profile.activeStep.step1.tile.register' })}
					</h5>
				</div>
				<div className="td-pg-profile__active-step__content__item">
					<span
						className={classnames('td-pg-profile__active-step__content__item__step', {
							'td-pg-profile__active-step__content__item__step--active': isLoggedIn && user.otp,
						})}
					>
						{user.otp ? svgActive : '2'}
					</span>
					<h5 className="td-pg-profile__active-step__content__item__title">
						{intl.formatMessage({ id: 'page.profile.activeStep.step2.title.2fa' })}
					</h5>
					<span className="td-pg-profile--color--second td-pg-profile__active-step__content__item__desc">
						{intl.formatMessage({ id: 'page.profile.activeStep.step2.desc.secure' })}
					</span>
					{!user.otp ? (
						<Button
							style={{
								background: '#FFB800',
								border: '1px solid #848E9C',
								borderRadius: '23.5px',
							}}
							size="sm"
							className="td-pg-profile__active-step__content__item__action mt-3"
							onClick={handleNavigateTo2fa}
						>
							{intl.formatMessage({ id: 'page.profile.activeStep.btn.verify' })}
						</Button>
					) : null}
				</div>
				<div className="td-pg-profile__active-step__content__item">
					<span
						className={classnames('td-pg-profile__active-step__content__item__step', {
							'td-pg-profile__active-step__content__item__step--active': user.otp && isExistBalance,
						})}
					>
						{isExistBalance ? svgActive : '3'}
					</span>
					<h5 className="td-pg-profile__active-step__content__item__title">
						{intl.formatMessage({ id: 'page.profile.activeStep.step3.title.deposit' })}
					</h5>
					<span className="td-pg-profile--color--second td-pg-profile__active-step__content__item__desc">
						{intl.formatMessage({ id: 'page.profile.activeStep.step3.desc.addCash' })}
					</span>
					{user.otp && !isExistBalance ? (
						<Button
							style={{
								background: '#FFB800',
								border: '1px solid #848E9C',
								borderRadius: '23.5px',
							}}
							size="sm"
							className="td-pg-profile__active-step__content__item__action mt-3"
							onClick={handleToWallet}
						>
							{intl.formatMessage({ id: 'page.profile.activeStep.btn.toWallet' })}
						</Button>
					) : null}
				</div>
			</div>
			<img
				className="td-pg-profile__active-step__mask-icon"
				src={require('assets/images/profile/maskIconToStep.svg')}
				alt=""
			/>
		</div>
	);
};
