import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { CopyableTextField } from '..';
import { QRCode } from '../QRCode';
/* import { isMobile } from 'react-device-detect'; */

export interface DepositCryptoProps {
	/**
	 * Data which is used to generate QR code
	 */
	data: string;
	/**
	 * Define if wallet account has been activated
	 */
	isAccountActivated: boolean;
	/**
	 * Generate wallet address for selected wallet
	 */
	handleGenerateAddress: () => void;
	/**
	 * Data which is used to display error if data is undefined
	 */
	error: string;
	/**
	 * Defines the size of QR code component.
	 * @default 118
	 */
	dimensions?: number;
	/**
	 *  Renders text of a component
	 */
	textConfirmation?: string;
	textMinDeposit?: string;
	textNote?: string;
	textDepositFee?: string;
	/**
	 * @default 'Deposit by Wallet Address'
	 * Renders text of the label of CopyableTextField component
	 */
	copiableTextFieldText?: string;
	/**
	 * @default 'Copy'
	 *  Renders text of the label of copy button component
	 */
	copyButtonText?: string;
	/**
	 * Renders text alert about success copy address
	 */
	handleOnCopy: () => void;
	/**
	 * @default 'false'
	 * If true, Button in CopyableTextField will be disabled.
	 */
	disabled?: boolean;
	/**
	 * Generate address button label
	 */
	buttonLabel?: string;

	wallet_index: number;
}

/**
 *  Component that displays wallet details that can be used to deposit cryptocurrency.
 */
const DepositCrypto: React.FunctionComponent<DepositCryptoProps> = (props: DepositCryptoProps) => {
	/* const QR_SIZE = isMobile ? 80 : 118; */
	const QR_SIZE = 200;
	const {
		data,
		dimensions,
		error,
		copiableTextFieldText,
		copyButtonText,
		handleOnCopy,
		disabled,
		handleGenerateAddress,
		buttonLabel,
		isAccountActivated,
		wallet_index,
	} = props;
	const size = dimensions || QR_SIZE;
	const onCopy = !disabled ? handleOnCopy : undefined;
	const className = classnames({ 'cr-copyable-text-field__disabled': data === '' });

	const getContent = () => {
		if (isAccountActivated) {
			return (
				<>
					<div className="d-flex justify-content-center">{data ? <QRCode dimensions={size} data={data} /> : null}</div>
					<div>
						<form className={'cr-deposit-crypto__copyable'}>
							<fieldset className={'cr-copyable-text-field'} onClick={onCopy}>
								<CopyableTextField
									className={'cr-deposit-crypto__copyable-area'}
									value={data ? data : error}
									fieldId={data ? 'copy_deposit_' + wallet_index : 'copy_deposit_2'}
									copyButtonText={copyButtonText}
									disabled={disabled}
									label={copiableTextFieldText ? copiableTextFieldText : 'Deposit by Wallet Address'}
								/>
							</fieldset>
						</form>
					</div>
				</>
			);
		}

		return (
			<div className="cr-deposit-crypto__create">
				<div className="cr-deposit-crypto__create-btn">
					<Button
						style={{
							background: '#FFB800',
							border: '1px solid #848E9C',
							borderRadius: '23.5px',
						}}
						block={true}
						type="button"
						onClick={handleGenerateAddress}
						size="lg"
						variant="primary"
					>
						{buttonLabel ? buttonLabel : 'Generate deposit address'}
					</Button>
				</div>
			</div>
		);
	};

	return (
		<div className={className}>
			<div className={'cr-deposit-crypto'}>{getContent()}</div>
		</div>
	);
};

export { DepositCrypto };
