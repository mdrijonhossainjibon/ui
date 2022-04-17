import classnames from 'classnames';
import * as React from 'react';
import { Dropdown } from 'react-bootstrap';

type DropdownElem = number | string | React.ReactNode;

interface DropdownComponentProps {
	/**
	 * List of options
	 */
	list: DropdownElem[];
	/**
	 * Selection callback function
	 * @default empty
	 */
	onSelect?: (index: number) => void;
	/**
	 *  By default class name 'cr-dropwdown'
	 *  This property gives an additional class name
	 *  @default empty
	 */
	className?: string;
	/**
	 * Value for placeholder of Dropdown components
	 * @default empty
	 */
	placeholder?: string;
	/**
	 * Value for disabling contentEditable property
	 * @default false
	 */
	disableContentEditable?: boolean;
}

/**
 *  Cryptobase Dropdown that overrides default dropdown with list of options.
 */

const convertToString = (elem: DropdownElem) => {
	if (elem !== undefined && elem !== null) {
		return elem.toString();
	}

	return '';
};

const DropdownComponent: React.FC<DropdownComponentProps> = props => {
	const [selected, setSelected] = React.useState<string>(props.placeholder || convertToString(props.list[0]));
	const setSelectedIndex = React.useState<string>('0')[1];

	React.useEffect(() => {
		if (props.placeholder) {
			setSelected(props.placeholder);
			setSelectedIndex('0');
		}
	}, [props.placeholder]);

	const handleSelect = (elem: DropdownElem, index: number) => {
		props.onSelect && props.onSelect(index);
		setSelected(convertToString(elem));
		setSelectedIndex(index.toString());
	};

	const cx = classnames('td-dropdown', props.className, {
		'td-dropdown--default': selected === props.placeholder,
	});

	const renderElem = (elem: DropdownElem, index: number) => {
		return (
			<Dropdown.Item key={index} onSelect={(eventKey: any, e?: React.SyntheticEvent<unknown>) => handleSelect(elem, index)}>
				{elem}
			</Dropdown.Item>
		);
	};

	return (
		<div className={cx}>
			<Dropdown>
				<Dropdown.Toggle variant="primary" id="dropdown-basic">
					{selected}
				</Dropdown.Toggle>
				<Dropdown.Menu>{props.list.map(renderElem)}</Dropdown.Menu>
			</Dropdown>
		</div>
	);
};

export const NewDropdown = DropdownComponent;
