import { selectVerifyLoading, selectVerifySubmitted, VerifyAccount } from 'modules';
import React from 'react';
import { useSelector } from 'react-redux';
import Stick from './Assets/Check.svg';
import Loading from './Assets/spinner.svg';
import Fail from './Assets/fail.png';
import { useIntl } from 'react-intl';
import { startCase } from 'lodash';
import { format } from 'date-fns';

interface VerificationConfirmProps {
	submit: () => void;
	kycData: VerifyAccount;
	isSubmitClicked: boolean;
}
export const MobileVerificationConfirm = (props: VerificationConfirmProps) => {
	const { submit, kycData, isSubmitClicked } = props;

	const {
		nationality,
		fullname,
		date_of_birth,
		residential_address,
		postal_code,
		city,
		document,
		photo_document,
		user_photo,
		document_number,
	} = kycData;

	const intl = useIntl();

	const isSendVerifyKycLoading = useSelector(selectVerifyLoading);
	const isVerifyKycSubmmited = useSelector(selectVerifySubmitted);

	const renderImage = () => {
		if (isSubmitClicked) {
			if (isSendVerifyKycLoading) {
				return <img src={Loading} alt="loading" />;
			} else {
				return isVerifyKycSubmmited ? (
					<img src={Stick} alt="sent" />
				) : (
					<img width="100px" height="100px" src={Fail} alt="fail" />
				);
			}
		}
		return null;
	};
	const renderButton = () => {
		if (!isSubmitClicked) {
			return <button onClick={submit}>{intl.formatMessage({ id: 'kyc.screen.VerificationConfirm.btn' })}</button>;
		}
		return null;
	};
	const renderConfirmText = () => {
		if (isSubmitClicked) {
			if (isSendVerifyKycLoading) {
				return null;
			} else {
				if (isVerifyKycSubmmited) {
					return (
						<div>
							<div className="mobile-verification-confirm__body__heading">
								{intl.formatMessage({ id: 'kyc.screen.VerificationConfirm.heading.1' })}
							</div>
							<div className="mobile-verification-confirm__body__desc mt-3">
								{intl.formatMessage({ id: 'kyc.screen.VerificationConfirm.desc' })}
							</div>
						</div>
					);
				} else {
					return (
						<div className="mobile-verification-confirm__body__heading">
							{intl.formatMessage({ id: 'kyc.screen.VerificationConfirm.heading.2' })}
						</div>
					);
				}
			}
		}

		const getTextIfMissing = (text: string) => {
			if (text) {
				return <span>{text}</span>;
			}
			return <span className="text-danger">{intl.formatMessage({ id: 'kyc.screen.VerificationConfirm.Missing' })}</span>;
		};
		return (
			<div>
				<div className="d-flex justify-content-between">
					<h5>{intl.formatMessage({ id: 'kyc.screen.VerificationConfirm.Nationality' })}: </h5>
					<h5>{getTextIfMissing(nationality)}</h5>
				</div>
				<div className="d-flex justify-content-between">
					<h5>{intl.formatMessage({ id: 'kyc.screen.VerificationConfirm.FullName' })}: </h5>
					<h5>{getTextIfMissing(fullname)}</h5>
				</div>
				<div className="d-flex justify-content-between">
					<h5>{intl.formatMessage({ id: 'kyc.screen.VerificationConfirm.BirthDay' })}: </h5>
					<h5>
						<span>
							{date_of_birth ? (
								format(new Date(date_of_birth), 'yyyy-MM-dd')
							) : (
								<span className="text-danger">
									{intl.formatMessage({ id: 'kyc.screen.VerificationConfirm.Missing' })}
								</span>
							)}
						</span>
					</h5>
				</div>
				<div className="d-flex justify-content-between">
					<h5>{intl.formatMessage({ id: 'kyc.screen.VerificationConfirm.ResidentialAddress' })}: </h5>
					<h5>{getTextIfMissing(residential_address)}</h5>
				</div>
				<div className="d-flex justify-content-between">
					<h5>{intl.formatMessage({ id: 'kyc.screen.VerificationConfirm.City' })}:</h5>
					<h5>{getTextIfMissing(city)}</h5>
				</div>
				<div className="d-flex justify-content-between">
					<h5>{intl.formatMessage({ id: 'kyc.screen.VerificationConfirm.Country' })}: </h5>
					<h5> {getTextIfMissing(nationality)}</h5>
				</div>
				<div className="d-flex justify-content-between">
					<h5>{intl.formatMessage({ id: 'kyc.screen.VerificationConfirm.DocumentType' })}: </h5>
					<h5> {getTextIfMissing(startCase(document))}</h5>
				</div>
				<div className="d-flex justify-content-between">
					<h5>{`${startCase(document)} Number`}: </h5>
					<h5>{getTextIfMissing(document_number)}</h5>
				</div>
				<div className="d-flex justify-content-between">
					<h5>{intl.formatMessage({ id: 'kyc.screen.VerificationConfirm.PostalCode' })}: </h5>
					<h5>{getTextIfMissing(postal_code)}</h5>
				</div>
				<div className="d-flex flex-row justify-content-between">
					<div>
						<h5>{intl.formatMessage({ id: 'kyc.screen.VerificationConfirm.DocumentPhoto' })}: </h5>
						<img width="150px" height="100px" src={photo_document} alt="photo_document" />
					</div>
					<div>
						<h5 className="text-right">
							{intl.formatMessage({ id: 'kyc.screen.VerificationConfirm.SeflfiePhoto' })}:{' '}
						</h5>
						<img width="150px" height="100px" src={user_photo} alt="user_photo" />
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="mobile-verification-confirm mb-5">
			<h2 className="mb-3">{intl.formatMessage({ id: 'kyc.screen.VerificationConfirm.Apply' })}</h2>
			<div className="d-flex justify-content-center">{renderImage()}</div>
			<div className="mobile-verification-confirm__body">
				{renderConfirmText()}
				{renderButton()}
			</div>
		</div>
	);
};
