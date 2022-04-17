import React from 'react';
import { NewModal } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { selectWithdrawLimitChecking, withdrawLimitChecking } from 'modules';
import udonLoading from 'assets/icon-udonex.gif';
import status_failed from 'assets/status/fail.png';
import { Button } from 'react-bootstrap';
export interface ModalCheckingWithdrawProps {
	total_amount: number;
	currency_id: string;
	isOpen: boolean;
	turnOffModal: () => void;
	handleChecking: (isOpen: boolean) => void;
	reset: () => void;
}
export const ModalCheckingWithdraw = (props: ModalCheckingWithdrawProps) => {
	const { total_amount, currency_id, isOpen, handleChecking, turnOffModal, reset } = props;
	const dispatch = useDispatch();
	const { payload, loading } = useSelector(selectWithdrawLimitChecking);

	const { isEnough, message } = payload;

	React.useEffect(() => {
		handleChecking(isEnough);
		if (isEnough) {
			turnOffModal();
		}
	}, [isEnough]);
	React.useEffect(() => {
		dispatch(
			withdrawLimitChecking({
				currency_id: currency_id,
				total_withdraw: total_amount,
			}),
		);
	}, [isOpen]);
	const renderHeader = () => {
		return <div className="pg-exchange-modal-submit-header">Checking Order</div>;
	};
	const renderFooter = () => {
		return (
			<div className="pg-exchange-modal-submit-footer mt-5 modal-footer__withdraw-confirm">
				<Button
					style={{
						background: 'var(--yellow)',
						border: '1px solid #848E9C',
						borderRadius: '23.5px',
					}}
					block={true}
					className="btn-block w-50 m-auto btn-lg"
					onClick={() => reset()}
					size="lg"
					variant="primary"
				>
					Okay
				</Button>
			</div>
		);
	};
	const renderBody = () => {
		return (
			<React.Fragment>
				<div className="pg-exchange-modal-submit-body">
					{loading ? (
						<div className="react-tabs__loading d-flex align-items-center justify-content-center">
							<img
								src={udonLoading}
								alt="loading"
								style={{
									width: '40%',
									height: '40%',
								}}
							/>
						</div>
					) : null}
					{!isEnough && !loading ? (
						<div className="d-flex justify-content-center">
							<div className="col-md-4 d-flex ">
								<img
									src={status_failed}
									alt="Status Failed"
									className="m-auto"
									style={{ width: '70%', objectFit: 'contain' }}
								/>
							</div>
							<div
								className="col-md-8"
								style={{
									fontSize: '1.25rem',
									textAlign: 'center',
									color: 'white',
								}}
							>
								{message}
							</div>
						</div>
					) : null}
				</div>
				{renderFooter()}
			</React.Fragment>
		);
	};
	return <NewModal show={isOpen} onHide={reset} titleModal={renderHeader()} bodyModal={renderBody()} />;
};
