import * as React from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';

export interface FormInputProps {
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
type Props = FormInputProps;

class FormInput extends React.Component<Props> {
	public render() {
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
		} = this.props;

		return (
			<React.Fragment>
				<div className="custom-input">
					<label className={classNameLabel}>{(labelVisible || inputValue) && (label || defaultLabel)}</label>
					<InputGroup size="lg">
						<FormControl
							style={{
								backgroundColor: '#11223F',
								border: ' 1px solid #627493',
								borderRadius: '50px',
								paddingLeft: '2rem',
								height: '47px',
							}}
							size="lg"
							type={type}
							value={inputValue.toString()}
							placeholder={placeholder}
							autoFocus={autoFocus}
							onFocus={this.props.handleFocusInput}
							onBlur={this.props.handleFocusInput}
							onChange={e => this.handleChangeValue(e)}
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
	}

	private handleChangeValue = (e: OnChangeEvent) => {
		this.props.handleChangeInput && this.props.handleChangeInput(e.target.value);
	};
}

export { FormInput };
