import React from 'react';
import { Modal, Progress } from 'antd';
import { useIntl } from 'react-intl';

import {
	IdentifyInformation,
	AddressInformation,
	IdentifyVerification,
	IdentifyGovernment,
	IdentifyGovernmentPhoto,
	VerificationConfirm,
} from '../../components';
import { nationalities } from 'translations/nationalities';
import BackSVG from './back.svg';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { TypeOfKycDocument, VerifyAccount, verifyAccountUser } from 'modules';
import { useHistory } from 'react-router';
const DEFAULT_KYC_STEP = 1;
interface PersonalVerifyProps {
	show: boolean;
	setIsModalVisible: (visable: boolean) => void;
}

export const PersonalVerify = (props: PersonalVerifyProps) => {
	const { show } = props;
	const intl = useIntl();

	// router
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
		document_number: '',
		photo_document: '',
		user_photo: '',
	});
	const [step, setStep] = React.useState<number>(DEFAULT_KYC_STEP);
	const [disableContinue, setDisableContinue] = React.useState(false);
	const [isSubmitClicked, setIsSubmitClicked] = React.useState(false);
	const inputChange = (key: string, value: string | Date) => {
		setUserVerifyAccount({
			...userVerifyAccount,
			[key]: value,
		});
	};
	const handleCancel = () => {
		props.setIsModalVisible(false);
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

	const handleNavigateVerifyHome = () => {
		history.push('/profile/kyc');
	};

	const goBackStep = () => {
		if (step > 1) {
			setStep(step - 1);
		}
	};

	const submit = () => {
		setIsSubmitClicked(true);
		dispatch(verifyAccountUser(userVerifyAccount));
	};

	const continueButtonClassName = classNames(
		disableContinue ? 'personal-verify__bottom__button__disabled' : 'personal-verify__bottom__button__enabled',
	);

	const renderSwitchStep = () => {
		return (
			<Modal title="Basic Modal" visible={show} onCancel={handleCancel}>
				<div className="personal-verify__modal">
					<div className="mb-3" style={{ height: '30px' }}>
						<button
							className="btn"
							style={{ backgroundColor: 'var(--yellow)' }}
							hidden={step === 1 || step === 6}
							onClick={isSubmitClicked ? handleNavigateVerifyHome : goBackStep}
						>
							<img width={20} height={20} src={BackSVG} alt="back" />
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
			</Modal>
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
					<IdentifyInformation
						inputChange={inputChange}
						nationality={nationalities[0]}
						fullName={fullname}
						dateOfBirth={new Date()}
					/>
				);
			case 2:
				return (
					<AddressInformation
						inputChange={inputChange}
						residentialAddress={residential_address}
						city={city}
						postalCode={postal_code}
					/>
				);
			case 3:
				return (
					<IdentifyVerification inputChange={inputChange} documentType={document} documentNumber={document_number} />
				);
			case 4:
				return <IdentifyGovernment inputChange={inputChange} photoDocument={photo_document} />;
			case 5:
				return <IdentifyGovernmentPhoto inputChange={inputChange} userPhoto={user_photo} />;
			case 6:
				return <VerificationConfirm kycData={userVerifyAccount} submit={submit} isSubmitClicked={isSubmitClicked} />;
			default:
				return null;
		}
	};

	return <div className="personal-verify">{renderSwitchStep()}</div>;
};
