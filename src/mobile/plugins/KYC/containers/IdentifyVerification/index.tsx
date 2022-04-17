import React from 'react';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import { TypeOfKycDocument } from 'modules';
import { startCase } from 'lodash';

interface IdentifyVerificationProps {
	inputChange: (key: string, value: string | Date) => void;
	documentNumber: string;
	documentType: TypeOfKycDocument;
}

export const MobileIdentifyVerification = (props: IdentifyVerificationProps) => {
	const { inputChange, documentNumber, documentType } = props;
	const intl = useIntl();

	const handleSelectPassport = () => {
		inputChange('document', TypeOfKycDocument.Passport);
	};
	const handleSelectDriver = () => {
		inputChange('document', TypeOfKycDocument.Driver);
	};
	const handleSelectIdentifyCard = () => {
		inputChange('document', TypeOfKycDocument.IdentifyCard);
	};
	const passportClassName = classNames(documentType === TypeOfKycDocument.Passport ? 'passport__actived' : '');
	const driverClassName = classNames(documentType === TypeOfKycDocument.Driver ? 'driver__actived' : '');
	const identifyCardClassName = classNames(documentType === TypeOfKycDocument.IdentifyCard ? 'identify__actived' : '');

	return (
		<div className="mobile-identify-verification">
			<div className="mobile-identify-verification__form">
				<h2 className="mb-5">{intl.formatMessage({ id: 'kyc.screen.IdentifyVerification.heading' })}</h2>
			</div>
			<div className="mt-3">
				<div className="form-group">
					<label className="text-white" htmlFor="name">
						{`${startCase(documentType)} Number`}
					</label>
					<input
						autoFocus
						type="text"
						className="form-control"
						name="residential_address"
						onChange={e => inputChange('document_number', e.target.value)}
						value={documentNumber}
						placeholder={`Enter your ${startCase(documentType)} number`}
					/>
				</div>
			</div>
			<div className="mobile-identify-verification__document-photo-type">
				<div className="document-photo-type__group" onClick={handleSelectPassport}>
					<div className="document-photo-type__group__name">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								className={passportClassName}
								d="M20 6H12L10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM14 18V15H10V11H14V8L19 13L14 18Z"
								fill="#848E9C"
							/>
						</svg>
						<p className={passportClassName} style={{ marginLeft: 10 }}>
							{intl.formatMessage({ id: 'kyc.screen.IdentifyVerification.passport' })}
						</p>
					</div>
					<div className="document-photo-type__group__stick">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								className={passportClassName}
								d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"
								fill="#848E9C"
							/>
						</svg>
					</div>
				</div>
				<div className="document-photo-type__group" onClick={handleSelectDriver}>
					<div className="document-photo-type__group__name">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								className={driverClassName}
								d="M20 6H12L10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM14 18V15H10V11H14V8L19 13L14 18Z"
								fill="#848E9C"
							/>
						</svg>
						<p className={driverClassName} style={{ marginLeft: 10 }}>
							{intl.formatMessage({ id: 'kyc.screen.IdentifyVerification.Driver’sLicense' })}
						</p>
					</div>
					<div className="document-photo-type__group__stick">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								className={driverClassName}
								d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"
								fill="#848E9C"
							/>
						</svg>
					</div>
				</div>
				<div className="document-photo-type__group" onClick={handleSelectIdentifyCard}>
					<div className="document-photo-type__group__name">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								className={identifyCardClassName}
								d="M20 6H12L10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM14 18V15H10V11H14V8L19 13L14 18Z"
								fill="#848E9C"
							/>
						</svg>
						<p className={identifyCardClassName} style={{ marginLeft: 10 }}>
							{intl.formatMessage({ id: 'kyc.screen.IdentifyVerification.IdentityCard' })}
						</p>
					</div>
					<div className="document-photo-type__group__stick">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								className={identifyCardClassName}
								d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"
								fill="#848E9C"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
};
