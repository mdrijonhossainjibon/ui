import React from 'react';
import { useIntl } from 'react-intl';

import { useSelector, useDispatch } from 'react-redux';

import P_inf from './icons/p_inf.svg';
import P_add from './icons/p_add.svg';
import P_id from './icons/p_id.svg';
import P_recog from './icons/p_recog.svg';
import P_time from './icons/p_time.svg';
import policy from './icons/policy.svg';
import guide from './icons/guide.svg';
import avatar from './icons/avatarGroup.svg';
import { startCase } from 'lodash';
import { useHistory } from 'react-router';
import { getKycStatus, selectKycStatus } from 'modules';

export const MobileVerifyAccount = () => {
	const history = useHistory();

	const intl = useIntl();

	const dispatch = useDispatch();

	const kycStatus = useSelector(selectKycStatus);

	React.useEffect(() => {
		dispatch(getKycStatus());
	}, []);

	const getVerifyButtonText = () => {
		switch (kycStatus.status) {
			case 'unsent':
				return 'Verify';
			case 'failed':
				return 'Re-Verify';
			case 'process':
				return 'Processing';
			case 'verify':
				return 'Verified';
			case 'blocked':
				return 'Blocked';
			default:
				return 'Unavailable';
		}
	};

	const getVerifyButtonClassName = () => {
		switch (kycStatus.status) {
			case 'unsent':
			case 'failed':
				return 'mobile-verify-account__verify__action';
			case 'verify':
				return 'mobile-verify-account__verify__btn__success';
			default:
				return 'mobile-verify-account__verify__btn__disable';
		}
	};
	const checkVerifyButtonDisabled = () => {
		switch (kycStatus.status) {
			case 'unsent':
			case 'failed':
				return false;

			default:
				return true;
		}
	};

	const renderKycStatusTitle = () => {
		switch (kycStatus.status) {
			case 'verify':
				return (
					<h3 className="text-success text-center font-weight-bold">
						{intl.formatMessage({ id: 'kyc.screen.current.feature.title.verified' })}
					</h3>
				);
			case 'unsent':
			case 'process':
			case 'unavailable':
				return (
					<h3 className="text-center font-weight-bold">
						{intl.formatMessage({ id: 'kyc.screen.current.feature.title.unverified' })}
					</h3>
				);
			case 'blocked':
				return (
					<div>
						<h3 className="text-danger text-center font-weight-bold">{kycStatus.reason}</h3>
						<h3 className="text-center font-weight-bold">
							{intl.formatMessage({ id: 'kyc.screen.current.feature.title.contact' })}
						</h3>
					</div>
				);
			case 'failed':
				return <h3 className="text-danger text-center font-weight-bold">{kycStatus.reason}</h3>;
			default:
				return null;
		}
	};

	return (
		<div className="mobile-verify-account">
			<div className="container">
				<div className="row">
					<div className="col-lg-12">
						<div className="mobile-verify-account-head">
							<h2 className="mobile-verify-account-head__heading">
								{intl.formatMessage({ id: 'kyc.screen.head.deading' })}
							</h2>
							<div className="ml-5">
								<img src={policy} alt="policy" />
							</div>
							<div className="ml-3">
								<img src={guide} alt="guide" />
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<div className="mobile-verify-account__current-feature">
							<h3 className="current-feature__heading">
								{intl.formatMessage({ id: 'kyc.screen.current.feature.heading' })}
							</h3>
							<div className="d-flex justify-content-center">
								<img className="current-feature__image" src={avatar} alt="avatar" />
							</div>
							<div className="current-feature__title">{renderKycStatusTitle()}</div>
							<div className="current-feature__desc" hidden={kycStatus.status === 'verify'}>
								{intl.formatMessage({ id: 'kyc.screen.current.feature.desc' })}
							</div>
						</div>
					</div>
					<div className="col-12">
						<div className="mobile-verify-account__verify">
							<h3 className="mobile-verify-account__verify__title">
								{intl.formatMessage({ id: 'kyc.screen.verify.heading' })}
							</h3>
							<div className="mobile-verify-account__verify__personal">
								<img src={P_inf} alt="infor personal" />
								<div className="personal__title">{intl.formatMessage({ id: 'kyc.screen.verify.title.1' })}</div>
							</div>
							<div className="mobile-verify-account__verify__personal">
								<img src={P_id} alt="infor personal" />
								<div className="personal__title">{intl.formatMessage({ id: 'kyc.screen.verify.title.2' })}</div>
							</div>
							<div className="mobile-verify-account__verify__personal">
								<img src={P_recog} alt="infor personal" />
								<div className="personal__title">{intl.formatMessage({ id: 'kyc.screen.verify.title.3' })}</div>
							</div>
							<button
								disabled={checkVerifyButtonDisabled()}
								className={getVerifyButtonClassName()}
								onClick={() => {
									history.push('/profile/kyc/verify');
								}}
							>
								{startCase(getVerifyButtonText())}
							</button>
							<div className="mobile-verify-account__verify__feature">
								<h4 className="feature__title">
									{intl.formatMessage({ id: 'kyc.screen.verify.feture.title.1' })}
								</h4>
								<div className="feature__content">
									{intl.formatMessage({ id: 'kyc.screen.verify.feture.content.1' })}
								</div>
							</div>
							<div className="mobile-verify-account__verify__feature">
								<h4 className="feature__title">
									{intl.formatMessage({ id: 'kyc.screen.verify.feture.title.2' })}
								</h4>
								<div className="feature__content">
									{intl.formatMessage({ id: 'kyc.screen.verify.feture.content.2' })}
								</div>
							</div>
							<div className="mobile-verify-account__verify__feature">
								<h4 className="feature__title">
									{intl.formatMessage({ id: 'kyc.screen.verify.feture.title.3' })}
								</h4>
								<div className="feature__content">
									{intl.formatMessage({ id: 'kyc.screen.verify.feture.content.3' })}
								</div>
							</div>
							<div className="mobile-verify-account__verify__feature">
								<h4 className="feature__title">
									{intl.formatMessage({ id: 'kyc.screen.verify.feture.title.4' })}
								</h4>
								<div className="feature__content">
									{intl.formatMessage({ id: 'kyc.screen.verify.feture.content.4' })}d
								</div>
							</div>
						</div>
					</div>
					<div className="col-12">
						<div className="mobile-verify-account__verify">
							<h3 className="mobile-verify-account__verify__title">
								{intl.formatMessage({ id: 'kyc.screen.verifyplus.heading' })}
							</h3>
							<div className="mobile-verify-account__verify__personal">
								<img src={P_add} alt="infor personal" />
								<div className="personal__title">
									{intl.formatMessage({ id: 'kyc.screen.verifyplus.title.1' })}
								</div>
							</div>
							<div className="mobile-verify-account__verify__personal">
								<img src={P_time} alt="infor personal" />
								<div className="personal__title">
									{intl.formatMessage({ id: 'kyc.screen.verifyplus.title.2' })}
								</div>
							</div>
							<button className="mobile-verify-account__verify__action mobile-verify-account__verify__btn__unvailable">
								{intl.formatMessage({ id: 'kyc.screen.verifyplus.btn.unavailable' })}
							</button>
							<div className="mobile-verify-account__verify__feature">
								<h4 className="feature__title">
									{intl.formatMessage({ id: 'kyc.screen.verifyplus.feture.title.1' })}
								</h4>
								<div className="feature__content">
									{intl.formatMessage({ id: 'kyc.screen.verifyplus.feture.content.1' })}
								</div>
							</div>
							<div className="mobile-verify-account__verify__feature">
								<h4 className="feature__title">
									{intl.formatMessage({ id: 'kyc.screen.verifyplus.feture.title.2' })}
								</h4>
								<div className="feature__content">
									{intl.formatMessage({ id: 'kyc.screen.verifyplus.feture.content.2' })}
								</div>
							</div>
							<div className="mobile-verify-account__verify__feature">
								<h4 className="feature__title">
									{intl.formatMessage({ id: 'kyc.screen.verifyplus.feture.title.3' })}
								</h4>
								<div className="feature__content">
									{intl.formatMessage({ id: 'kyc.screen.verifyplus.feture.content.3' })}
								</div>
							</div>
							<div className="mobile-verify-account__verify__feature">
								<h4 className="feature__title">
									{intl.formatMessage({ id: 'kyc.screen.verifyplus.feture.title.4' })}
								</h4>
								<div className="feature__content">
									{intl.formatMessage({ id: 'kyc.screen.verifyplus.feture.content.4' })}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
