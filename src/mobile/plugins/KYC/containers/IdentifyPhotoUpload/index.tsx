import React from 'react';
import { toString } from 'lodash';
import { useIntl } from 'react-intl';

import card_good from './Assets/card_good.svg';
import card_bad1 from './Assets/card_bad.svg';
import card_bad2 from './Assets/card_bad2.svg';
import card_bad3 from './Assets/card_bad3.svg';
import camera from './Assets/camera.svg';
import check from './Assets/check.svg';
import close from './Assets/close.svg';

interface IdentifyGovernmentProps {
	inputChange: (key: string, value: string | Date) => void;
	photoDocument: string;
}

export const MobileIdentifyPhotoUpload = (props: IdentifyGovernmentProps) => {
	const { inputChange, photoDocument } = props;
	const intl = useIntl();

	const handelInputfile = e => {
		const file = e.target.files[0];
		toBase64(file).then((file: string) => {
			inputChange('photo_document', file);
		});
	};

	const toBase64 = (file: File): Promise<string> =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(toString(reader.result));
			reader.onerror = error => reject(error);
		});

	return (
		<div className="mobile-identify-photo-upload">
			<div className="mobile-identify-photo-upload__form">
				<h2 className="mb-5">{intl.formatMessage({ id: 'kyc.screen.IdentifyGovernment.heading' })}</h2>
			</div>
			<div className="mobile-identify-photo-upload__card">
				<div className="d-flex flex-row">
					<div>
						<img src={card_good} alt="card" />
					</div>
					<div>
						<img src={card_bad1} alt="card" />
					</div>
					<div>
						<img src={card_bad2} alt="card" />
					</div>
					<div>
						<img src={card_bad3} alt="card" />
					</div>
				</div>
			</div>
			<div className="mobile-identify-photo-upload__card-require">
				<div className="mobile-identify-photo-upload__card-require-item">
					<img src={check} alt="check" />
					<div>{intl.formatMessage({ id: 'kyc.screen.IdentifyGovernment.require.item.1' })}</div>
				</div>
				<div className="mobile-identify-photo-upload__card-require-item">
					<img src={check} alt="check" />
					<div>{intl.formatMessage({ id: 'kyc.screen.IdentifyGovernment.require.item.2' })}</div>
				</div>
				<div className="mobile-identify-photo-upload__card-require-item">
					<img src={check} alt="check" />
					<div>{intl.formatMessage({ id: 'kyc.screen.IdentifyGovernment.require.item.3' })}</div>
				</div>
				<div className="mobile-identify-photo-upload__card-require-item">
					<img src={check} alt="check" />
					<div>{intl.formatMessage({ id: 'kyc.screen.IdentifyGovernment.require.item.4' })}</div>
				</div>
				<div className="mobile-identify-photo-upload__card-require-item">
					<img src={close} alt="close" style={{ marginLeft: 4 }} />
					<div>{intl.formatMessage({ id: 'kyc.screen.IdentifyGovernment.require.item.5' })}</div>
				</div>
				<div className="mobile-identify-photo-upload__card-require-item">
					<img src={close} alt="close" style={{ marginLeft: 4 }} />
					<div>{intl.formatMessage({ id: 'kyc.screen.IdentifyGovernment.require.item.6' })}</div>
				</div>
			</div>
			<hr />
			<div className="mobile-identify-photo-upload__photo">
				<div className="mobile-identify-photo-upload__photo-upload">
					{photoDocument && (
						<div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
							<img
								style={{ width: '100%', height: '100%', objectFit: 'contain' }}
								src={photoDocument}
								alt="photo_document"
							/>
						</div>
					)}
					<div>
						<input type="file" className="form-control" id="file" name="photoGovernment" onChange={handelInputfile} />
						<label htmlFor="file">
							<img src={camera} alt="camera" />
							{photoDocument ? null : (
								<span>{intl.formatMessage({ id: 'kyc.screen.IdentifyGovernment.choose.photo' })}</span>
							)}
						</label>
					</div>
				</div>
			</div>
		</div>
	);
};
