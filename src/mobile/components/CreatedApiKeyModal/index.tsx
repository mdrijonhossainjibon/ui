import * as React from 'react';
import { useIntl } from 'react-intl';
import { CopyableTextField } from '../CopyableTextField';
import { copy } from '../../../helpers';
import { WarningIcon } from '../../assets/images/WarningIcon';
import { NewModal } from '../NewModal';

export const CreatedApiKeyModalComponent = props => {
	const [apiKey, setApiKey] = React.useState({ kid: '', secret: '' });
	const intl = useIntl();

	React.useEffect(() => {
		if (props.apiKey) {
			setApiKey(props.apiKey);
		}
	}, [props.apiKey]);

	const renderModalBody = () => {
		return (
			<div className="td-mobile-modal__body">
				<div className="td-mobile-modal__body__fieldset">
					<fieldset onClick={() => copy('access-key-id')}>
						<CopyableTextField
							className="pg-copyable-text-field__input"
							fieldId={'access-key-id'}
							value={apiKey.kid || ''}
							copyButtonText={intl.formatMessage({ id: 'page.body.profile.content.copyLink' })}
							label={intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.access_key' })}
						/>
					</fieldset>
				</div>
				<div className="td-mobile-modal__body__fieldset">
					<fieldset onClick={() => copy('secret-key-id')}>
						<CopyableTextField
							className="pg-copyable-text-field__input"
							fieldId={'secret_key-id'}
							value={apiKey.secret || ''}
							copyButtonText={intl.formatMessage({ id: 'page.body.profile.content.copyLink' })}
							label={intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.secret_key' })}
						/>
					</fieldset>
				</div>
				<div className="td-mobile-modal__body__title">
					<WarningIcon />
					<span>{intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.secret_key' })}</span>
				</div>
				<div className="td-mobile-modal__body__note">
					<p>
						{intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.secret_key_info' })}&nbsp;
						{intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.secret_key_store' })}
					</p>
					<p>
						{intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.note' })}&nbsp;
						{intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.note_content' })}
					</p>
				</div>
			</div>
		);
	};

	const renderModalFooter = () => {
		return (
			<div className="td-mobile-modal__footer">
				<button className="w-100 green-btn" onClick={props.closeCreatedApiKeyModal}>
					{intl.formatMessage({ id: 'page.mobile.createdApiKeyModal.confirm' })}
				</button>
			</div>
		);
	};

	return (
		<div className="pg-mobile-created-api-key-modal">
			<NewModal
				show={props.showModal}
				onClose={props.closeCreatedApiKeyModal}
				title={intl.formatMessage({ id: 'page.mobile.createdApiKeyModal.title' })}
			>
				{renderModalBody()}
				{renderModalFooter()}
			</NewModal>
		</div>
	);
};

export const CreatedApiKeyModal = React.memo(CreatedApiKeyModalComponent);
