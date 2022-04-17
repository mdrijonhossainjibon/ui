import * as React from 'react';
import { Modal, ModalProps } from 'react-bootstrap';

type cellData = string | number | React.ReactNode | undefined;

interface NewModalProps {
	titleModal: cellData;
	bodyModal: cellData;
}

type Props = NewModalProps & ModalProps;

export const NewModal: React.FC<Props> = ({ titleModal, bodyModal, ...res }) => {
	return (
		<Modal className="td-cpn__modal" animation={false} aria-labelledby="contained-modal-title-vcenter" centered {...res}>
			<Modal.Header className="new__modal-header" closeButton>
				<Modal.Title>{titleModal}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{bodyModal}</Modal.Body>
		</Modal>
	);
};
