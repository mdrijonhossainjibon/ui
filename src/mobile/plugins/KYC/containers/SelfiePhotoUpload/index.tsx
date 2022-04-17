import React from 'react';
import { toString } from 'lodash';
import { useIntl } from 'react-intl';

import check from './Assets/check.svg';
import close from './Assets/close.svg';
import user from './Assets/user_photo_example.jpg';
import camera from './Assets/camera.svg';

interface IdentifyGovernmentPhotoProps {
	inputChange: (key: string, value: string | Date) => void;
	userPhoto: string;
}

export const MobileSelfiePhotoUpload = (props: IdentifyGovernmentPhotoProps) => {
	const { inputChange, userPhoto } = props;
	const intl = useIntl();

	const date = new Date();
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();

	const handelInputfile = async e => {
		const file = e.target.files[0];
		const base64 = await toBase64(file);

		inputChange('user_photo', String(base64));
	};

	const toBase64 = (file: File) => {
		try {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve(toString(reader.result));
				reader.onerror = error => reject(error);
			});
		} catch (error) {
			return '';
		}
	};

	return (
		<div className="mobile-selfie-photo-upload">
			<div className="mobile-selfie-photo-upload__heading">
				<h2 className="mb-5">{intl.formatMessage({ id: 'kyc.screen.IdentifyGovernmentPhoto.heading' })}</h2>
				<h4>{intl.formatMessage({ id: 'kyc.screen.IdentifyGovernmentPhoto.title' })}</h4>
			</div>
			<div className="mobile-selfie-photo-upload__user">
				<div className="row">
					<div className="col-12">
						<div className="mobile-selfie-photo-upload__user__photo-doc">
							<img src={user} alt="selfie" style={{ width: '100%' }} />
							<div className="show_inf_document">
								<p className="get__date">{year + '-' + month + '-' + day}</p>
								<p className="exchange">UDONEX</p>
							</div>
						</div>
					</div>
					<div className="col-12">
						<div className="mobile-selfie-photo-upload__card-require">
							<div className="mobile-selfie-photo-upload__card-require-item">
								<img src={check} alt="check" />
								<div>{intl.formatMessage({ id: 'kyc.screen.IdentifyGovernmentPhoto.require.item.1' })}</div>
							</div>
							<div className="mobile-identify-photo-upload__card-require-item">
								<img src={check} alt="check" />
								<div>{intl.formatMessage({ id: 'kyc.screen.IdentifyGovernmentPhoto.require.item.2' })}</div>
							</div>
							<div className="mobile-identify-photo-upload__card-require-item">
								<img src={close} alt="close" style={{ marginLeft: 4 }} />
								<div>{intl.formatMessage({ id: 'kyc.screen.IdentifyGovernmentPhoto.require.item.3' })}</div>
							</div>
							<div className="mobile-identify-photo-upload__card-require-item">
								<img src={close} alt="close" style={{ marginLeft: 4 }} />
								<div>{intl.formatMessage({ id: 'kyc.screen.IdentifyGovernmentPhoto.require.item.4' })}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="mobile-selfie-photo-upload__photo">
				<div className="mobile-identify-photo-upload__photo-upload">
					{userPhoto && (
						<div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
							<img
								style={{ width: '100%', height: '100%', objectFit: 'contain' }}
								src={userPhoto}
								alt="userPhoto"
							/>
						</div>
					)}
					<div>
						<input type="file" className="form-control" id="file" name="photoGovernment" onChange={handelInputfile} />
						<label htmlFor="file">
							<img src={camera} alt="camera" />
							{userPhoto ? null : (
								<span>{intl.formatMessage({ id: 'kyc.screen.IdentifyGovernmentPhoto.choose.photo' })}</span>
							)}
						</label>
					</div>
				</div>
			</div>
		</div>
	);
};
