import React from 'react';
import { Progress } from 'antd';
import { useIntl } from 'react-intl';
import { nationalities } from 'translations/nationalities';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { TypeOfKycDocument, VerifyAccount, verifyAccountUser } from 'modules';

import BackSVG from './back.svg';
import CheckSVG from './check.svg';
import { useHistory } from 'react-router';
import {
	MobileIdentifyInformation,
	MobileAddressInformation,
	MobileIdentifyVerification,
	MobileIdentifyPhotoUpload,
	MobileSelfiePhotoUpload,
	MobileVerificationConfirm,
} from '../../containers';
const DEFAULT_KYC_STEP = 1;

export const MobilePersonalVerify = () => {
	// intl
	const intl = useIntl();

	// history
	const history = useHistory();

	// dispatch
	const dispatch = useDispatch();

	const [userVerifyAccount, setUserVerifyAccount] = React.useState<VerifyAccount>({
		nationality: '',
		fullname: '',
		date_of_birth: '',
		residential_address: '',
		postal_code: '',
		city: '',
		country: '',
		document: TypeOfKycDocument.Passport,
		photo_document: '',
		user_photo: '',
		document_number: '',
	});
	const [step, setStep] = React.useState<number>(DEFAULT_KYC_STEP);
	const [isClickedSubmit, setIsClickedSubmit] = React.useState(false);
	const [disableContinue, setDisableContinue] = React.useState(false);
	const inputChange = (key: string, value: string | Date) => {
		setUserVerifyAccount({
			...userVerifyAccount,
			[key]: value,
		});
	};

	const isDisableContinueButton = (step: number, verify: VerifyAccount) => {
		var xssRegex = new RegExp('<(|/|[^/>][^>]+|/[^>][^>]+)>');
		setDisableContinue(true);

		switch (step) {
			case 1:
				const isValidNationally = verify.nationality.length;
				const isValidFullName = !xssRegex.test(verify.fullname) && verify.fullname.length > 0;
				const isValidBirthDay = new Date() > (verify.date_of_birth ? new Date(verify.date_of_birth) : new Date());
				return !isValidNationally || !isValidFullName || !isValidBirthDay;
			case 2:
				const isValidAddress = !xssRegex.test(verify.residential_address) && verify.residential_address.length > 5;
				const isValidPostalCode = !xssRegex.test(verify.postal_code) && verify.postal_code.length;
				const isValidPostalCity = !xssRegex.test(verify.city) && verify.city.length;
				return !isValidAddress || !isValidPostalCode || !isValidPostalCity;
			case 3:
				const isValidDocumentNumber = !xssRegex.test(verify.document_number) && verify.document_number.length;
				return !isValidDocumentNumber;
			case 4:
				const isValidPhotoDocument = verify.photo_document !== '';
				return !isValidPhotoDocument;
			case 5:
				const isValidSefiePhoto = verify.user_photo !== '';
				return !isValidSefiePhoto;
			default:
				return false;
		}
	};

	React.useEffect(() => {
		const disable = isDisableContinueButton(step, userVerifyAccount);
		setDisableContinue(disable);
	}, [step, userVerifyAccount]);

	const goNextStep = () => {
		if (step < 6 && !disableContinue) {
			setStep(step + 1);
		}
	};

	const goBackStep = () => {
		if (step > 1) {
			setStep(step - 1);
		}
	};

	const handleNavigateVerifyHome = () => {
		history.push('/profile/kyc');
	};

	const submit = () => {
		setIsClickedSubmit(true);
		dispatch(verifyAccountUser(userVerifyAccount));
	};

	const continueButtonClassName = classNames(
		disableContinue ? 'mobile-personal-verify__bottom__button__disabled' : 'mobile-personal-verify__bottom__button__enabled',
	);

	const renderSwitchStep = () => {
		return (
			<div className="mobile-personal-verify__modal">
				<div className="mb-3 d-flex flex-row justify-content-between">
					<button
						className="btn"
						style={{ backgroundColor: 'var(--yellow)' }}
						hidden={step === 1}
						onClick={isClickedSubmit ? handleNavigateVerifyHome : goBackStep}
					>
						<img width={20} height={20} src={BackSVG} alt="back" />
					</button>
					<button
						className="btn"
						style={{ backgroundColor: 'var(--yellow)' }}
						hidden={step !== 6 || isClickedSubmit}
						onClick={submit}
					>
						<img width={20} height={20} src={CheckSVG} alt="submit" />
					</button>
				</div>
				{renderFormModal()}
				{step < 6 ? (
					<div className="d-flex flex-row justify-content-between align-items-center mt-3">
						<div className="w-100 pr-3">
							<Progress percent={(step - 1) * 20} size="small" />
						</div>
						<div>
							<button className={continueButtonClassName} onClick={goNextStep} disabled={disableContinue}>
								{intl.formatMessage({ id: 'kyc.screen.goNextStep' })}
							</button>
						</div>
					</div>
				) : null}
			</div>
		);
	};

	const renderFormModal = () => {
		const {
			fullname,
			postal_code,
			city,
			residential_address,
			photo_document,
			user_photo,
			document_number,
			document,
		} = userVerifyAccount;

		switch (step) {
			case 1:
				return (
					<MobileIdentifyInformation
						inputChange={inputChange}
						nationality={nationalities[0]}
						fullName={fullname}
						dateOfBirth={new Date()}
					/>
				);
			case 2:
				return (
					<MobileAddressInformation
						inputChange={inputChange}
						residentialAddress={residential_address}
						city={city}
						postalCode={postal_code}
					/>
				);
			case 3:
				return (
					<MobileIdentifyVerification
						inputChange={inputChange}
						documentType={document}
						documentNumber={document_number}
					/>
				);
			case 4:
				return <MobileIdentifyPhotoUpload inputChange={inputChange} photoDocument={photo_document} />;
			case 5:
				return <MobileSelfiePhotoUpload inputChange={inputChange} userPhoto={user_photo} />;
			case 6:
				return (
					<MobileVerificationConfirm isSubmitClicked={isClickedSubmit} kycData={userVerifyAccount} submit={submit} />
				);
			default:
				return null;
		}
	};
	return (
		<div className="mobile-personal-verify">
			<div className="container">
				<div className="row">
					<div className="col-12">{renderSwitchStep()}</div>
				</div>
			</div>
		</div>
	);
};
