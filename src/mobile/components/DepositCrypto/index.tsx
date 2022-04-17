import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { CopyableTextField } from '../../../components/CopyableTextField';
import { QRCode } from '../../../components/QRCode';

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
}

/**
 *  Component that displays wallet details that can be used to deposit cryptocurrency.
 */
const DepositCrypto: React.FunctionComponent<DepositCryptoProps> = (props: DepositCryptoProps) => {
	/* const QR_SIZE = isMobile ? 80 : 118; */
	const QR_SIZE = 118;
	const {
		data,
		dimensions,
		error,
		textConfirmation,
		textMinDeposit,
		textDepositFee,
		textNote,
		copiableTextFieldText,
		copyButtonText,
		handleOnCopy,
		disabled,
		handleGenerateAddress,
		buttonLabel,
		isAccountActivated,
	} = props;
	const size = dimensions || QR_SIZE;
	const onCopy = !disabled ? handleOnCopy : undefined;
	const className = classnames({ 'td-copyable-text-field__disabled': data === '' });

	const getContent = () => {
		if (isAccountActivated) {
			return (
				<>
					<div className="note">
						<div className="note__mobile-right">
							<p>{textConfirmation}</p>
							<p>{textMinDeposit}</p>
							<p>{textDepositFee}</p>
							<p className="textnote">
								<span className="textnote__mobile-textj">Note:</span>
								<span> {textNote}</span>
							</p>
						</div>
						{data ? (
							<div className="note__mobile-left">
								<QRCode dimensions={size} data={data} />
							</div>
						) : null}
					</div>
					<div>
						<form className={'td-deposit-crypto__copyable'}>
							<fieldset className={'td-copyable-text-field'} onClick={onCopy}>
								<CopyableTextField
									className={'td-deposit-crypto__copyable-area'}
									value={data ? data : error}
									fieldId={data ? 'copy_deposit_1' : 'copy_deposit_2'}
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
			<div className="td-deposit-crypto__create">
				<div className="td-deposit-crypto__create-btn">
					<Button block={true} type="button" onClick={handleGenerateAddress} size="lg" variant="primary">
						{buttonLabel ? buttonLabel : 'Generate deposit address'}
					</Button>
				</div>
			</div>
		);
	};

	return (
		<div className={className}>
			<div className={'td-deposit-crypto'}>{getContent()}</div>
		</div>
	);
};

export { DepositCrypto };
