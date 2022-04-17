import * as React from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';

interface NewCustomInputProps {
	type: string;
	label: string;
	defaultLabel: string;
	handleChangeInput?: (value: string) => void;
	inputValue: string | number;
	handleFocusInput?: () => void;
	placeholder: string;
	classNameLabel?: string;
	classNameInput?: string;
	autoFocus?: boolean;
	onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
	readOnly?: boolean;
	id?: string;
	handleClick?: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
	isDisabled?: boolean;
	labelVisible?: boolean;
}

interface OnChangeEvent {
	target: {
		value: string;
	};
}
type Props = NewCustomInputProps;

const NewCustomInput: React.FC<Props> = props => {
	const {
		label,
		labelVisible,
		placeholder,
		defaultLabel,
		inputValue,
		classNameLabel,
		type,
		autoFocus,
		readOnly,
		id,
		handleClick,
		isDisabled,
		onKeyPress,
	} = props;

	const handleChangeValue = (e: OnChangeEvent) => {
		props.handleChangeInput && props.handleChangeInput(e.target.value);
	};

	return (
		<React.Fragment>
			<div className="td-custom-input">
				<label className={classNameLabel}>{(labelVisible || inputValue) && (label || defaultLabel)}</label>
				<InputGroup size="lg">
					<FormControl
						size="lg"
						type={type}
						value={inputValue.toString()}
						placeholder={placeholder}
						autoFocus={autoFocus}
						onFocus={props.handleFocusInput}
						onBlur={props.handleFocusInput}
						onChange={e => {
							handleChangeValue(e);
						}}
						readOnly={readOnly}
						id={id}
						onClick={handleClick}
						disabled={isDisabled}
						onKeyPress={onKeyPress}
					/>
				</InputGroup>
			</div>
		</React.Fragment>
	);
};

export { NewCustomInput };
