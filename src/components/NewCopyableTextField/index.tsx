import '@openware/cryptofont';
import classnames from 'classnames';
import * as React from 'react';
import { Button, InputGroup } from 'react-bootstrap';
import { NewCustomInput } from '../';
import { copy } from '../../helpers';

export interface NewCopyableTextFieldProps {
	/**
	 * Text value that will be copied to the clipboard
	 */
	value: string;
	/**
	 * Additional class name for styling. By default element receives `td-button` class
	 * @default empty
	 */
	className?: string;
	/**
	 * String value that makes copy field be unique
	 */
	fieldId: string;
	/**
	 * @default 'Copy'
	 *  Renders text of the label of copy button component
	 */
	copyButtonText?: string;
	/**
	 * @default 'false'
	 * If true, Button will be disabled.
	 */
	disabled?: boolean;
	label?: string;
}

/**
 * Text field component with ability to copy inner text.
 */
export const NewCopyableTextField: React.FC<NewCopyableTextFieldProps> = props => {
	const { value, className, disabled, fieldId, copyButtonText, label } = props;
	React.useEffect(() => {
		if (!fieldId) {
			throw new Error('CopyableTextField must contain `fieldId` prop');
		}
	}, [fieldId]);

	const doCopy = () => copy(fieldId);
	const cx = classnames('td-copyable-text-field', className);

	return (
		<div className={cx}>
			<InputGroup>
				<NewCustomInput
					id={String(fieldId)}
					readOnly={true}
					inputValue={value}
					handleClick={doCopy}
					type="text"
					isDisabled={disabled}
					label={label || ''}
					defaultLabel={label || ''}
					placeholder={label || ''}
				/>
				<InputGroup.Append>
					<Button onClick={doCopy} disabled={disabled} size="lg" variant="primary">
						{copyButtonText ? copyButtonText : 'Copy'}
					</Button>
				</InputGroup.Append>
			</InputGroup>
		</div>
	);
};
