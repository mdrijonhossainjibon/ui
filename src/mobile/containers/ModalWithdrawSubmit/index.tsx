import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { NewModal } from '../../components';
import { IntlProps } from '../../../index';

interface ModalWithdrawSubmitProps {
	currency: string;
	onSubmit: () => void;
	show: boolean;
	isMobileDevice?: boolean;
}

type Props = ModalWithdrawSubmitProps & IntlProps;

class ModalWithdrawSubmitComponent extends React.Component<Props> {
	public translate = (e: string) => {
		return this.props.intl.formatMessage({ id: e });
	};

	public render() {
		const { show, onSubmit } = this.props;

		return (
			<NewModal title={this.translate('page.modal.withdraw.success')} show={show} onClose={onSubmit}>
				<div>{this.renderBodyModalSubmit()}</div>
				<div className="pg-exchange-modal-submit-footer modal-footer__withdraw-submit">
					<button className="w-100 green-btn" onClick={this.props.onSubmit}>
						{this.translate('page.modal.withdraw.success.button')}
					</button>
				</div>
			</NewModal>
		);
	}

	private renderBodyModalSubmit = () => {
		return (
			<p className="text-center text-white">
				<FormattedMessage id="page.modal.withdraw.success.message.content" />
			</p>
		);
	};
}

export const ModalWithdrawSubmit = injectIntl(ModalWithdrawSubmitComponent);
