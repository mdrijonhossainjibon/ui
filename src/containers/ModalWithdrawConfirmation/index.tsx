import * as React from 'react';
import { Button } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { IntlProps } from '../../index';
import { Modal as MobileModal } from '../../mobile/components/Modal';
import { NewModal } from '../../components';
interface ModalWithdrawConfirmationProps {
	amount: string;
	currency: string;
	onSubmit: () => void;
	onDismiss: () => void;
	rid: string;
	isMobileDevice?: boolean;
	show: boolean;
	ethBallance?: string;
	selectedWalletFee?: string;
	ethFee: number;
	/* isLimitWithdraw24H: boolean; */
}

type Props = ModalWithdrawConfirmationProps & IntlProps;

class ModalWithdraw extends React.Component<Props> {
	public translate = (e: string) => {
		return this.props.intl.formatMessage({ id: e });
	};

	public render() {
		const { show, isMobileDevice, onDismiss } = this.props;

		return isMobileDevice ? (
			<MobileModal title={this.renderHeader()} onClose={this.props.onDismiss} isOpen={this.props.show}>
				<div>{this.renderBody()}</div>
				<div>{this.renderFooter()}</div>
			</MobileModal>
		) : (
			<NewModal show={show} onHide={onDismiss} titleModal={this.renderHeader()} bodyModal={this.renderBody()} />
		);
	}

	private renderHeader = () => {
		return (
			<div className="pg-exchange-modal-submit-header">
				{this.translate('page.body.wallets.tabs.withdraw.modal.confirmation')}
			</div>
		);
	};

	private renderBody = () => {
		const { amount, currency, rid, selectedWalletFee, ethBallance, ethFee } = this.props;
		const formattedCurrency = currency.toUpperCase();

		return (
			<React.Fragment>
				<div className="pg-exchange-modal-submit-body modal-body__withdraw-confirm">
					<p className="text-white">
						{this.translate('page.body.wallets.tabs.withdraw.modal.message1')}
						{amount} {formattedCurrency}
						{this.translate('page.body.wallets.tabs.withdraw.modal.message2')} {rid}
						<br />
						<span hidden={Number(selectedWalletFee) !== 0}>
							{`Your ETH will remain
						${ethBallance} - ${ethFee} =
						${Number(Number(ethBallance) - ethFee).toFixed(5)} ETH`}
						</span>
					</p>
				</div>
				{this.renderFooter()}
			</React.Fragment>
		);
	};

	private renderFooter = () => {
		return (
			<div className="pg-exchange-modal-submit-footer modal-footer__withdraw-confirm">
				<Button
					style={{
						background: '#dc3545',
						border: '1px solid #848E9C',
						borderRadius: '23.5px',
					}}
					block={true}
					className="btn-block mr-1 mt-1 btn-lg"
					onClick={this.props.onDismiss}
					size="lg"
					variant="primary"
				>
					{this.translate('page.body.wallets.tabs.withdraw.modal.button.cancel')}
				</Button>
				<Button
					style={{
						background: 'var(--yellow)',
						border: '1px solid #848E9C',
						borderRadius: '23.5px',
					}}
					block={true}
					className="btn-block mr-1 mt-1 btn-lg"
					onClick={this.props.onSubmit}
					/*  disabled={this.props.isLimitWithdraw24H} */
					size="lg"
					variant="primary"
				>
					{this.translate('page.body.wallets.tabs.withdraw.modal.button.withdraw')}
				</Button>
			</div>
		);
	};
}

// tslint:disable-next-line
export const ModalWithdrawConfirmation = injectIntl(ModalWithdraw) as any;
