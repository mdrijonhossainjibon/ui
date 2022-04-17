import { NewModal } from 'components';
import * as React from 'react';
import { ProgressBar } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { WithdrawInfo, WithdrawAddress, WithdrawHistory } from '../../containers';
import { setDocumentTitle } from '../../helpers';
import {
	selectCurrencies,
	selectWallets,
	selectUserInfo,
	selectETHFee,
	selectChildCurrencies,
	currenciesFetch,
	walletsFetch,
	ethFeeFetch,
	walletsChildCurrenciesFetch,
	allChildCurrenciesFetch,
	marketsFetch,
	beneficiariesFetch,
	withdrawHistoryFetch,
	walletsWithdrawCcyData,
	selectWithdrawProcess,
	walletsWithdrawLimitFetch,
} from '../../modules';
import WarningPNG from './warning.png';
import WaitingPNG from './waiting.png';
import FailPNG from './fail.png';

export const WithdrawScreen = () => {
	// intl
	const intl = useIntl();

	setDocumentTitle(intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw' }));

	const { currency_id } = useParams<{ currency_id: string }>();

	// selectors
	const currencies = useSelector(selectCurrencies);
	const wallets = useSelector(selectWallets) || [];
	const user = useSelector(selectUserInfo);
	const ethFee = useSelector(selectETHFee);
	const childCurrencies = useSelector(selectChildCurrencies);
	const withdrawProcessPercent = useSelector(selectWithdrawProcess);

	const dispatch = useDispatch();
	const dispatchFetchCurrencies = React.useCallback(() => dispatch(currenciesFetch()), [dispatch]);
	const dispatchFetchWallets = React.useCallback(() => dispatch(walletsFetch()), [dispatch]);
	const dispatchFetchEthFee = React.useCallback(() => dispatch(ethFeeFetch()), [dispatch]);
	const dispatchFetchChildCurrencies = React.useCallback(
		() => dispatch(walletsChildCurrenciesFetch({ currency: currency_id })),
		[dispatch, currency_id],
	);
	const dispatchcFetchAllChildCurrencies = React.useCallback(() => dispatch(allChildCurrenciesFetch()), [dispatch]);
	const dispatchFetchMarkets = React.useCallback(() => dispatch(marketsFetch()), [dispatch]);
	const dispatchFetchHistories = React.useCallback(() => dispatch(withdrawHistoryFetch({ currency: currency_id })), [
		dispatch,
		currency_id,
	]);
	const dispatchFetchBeneficiaries = React.useCallback(() => dispatch(beneficiariesFetch()), [dispatch]);

	const history = useHistory();

	// side effects
	React.useEffect(() => {
		dispatchFetchChildCurrencies();
		dispatchFetchMarkets();
		dispatchFetchCurrencies();
		dispatchFetchWallets();
		dispatchFetchEthFee();
		dispatchcFetchAllChildCurrencies();
		dispatchFetchHistories();
		dispatchFetchBeneficiaries();
	}, [
		currency_id,
		dispatchFetchMarkets,
		dispatchFetchCurrencies,
		dispatchFetchWallets,
		dispatchFetchChildCurrencies,
		dispatchFetchEthFee,
		dispatchcFetchAllChildCurrencies,
		dispatchFetchHistories,
		dispatchFetchBeneficiaries,
	]);

	React.useEffect(() => {
		dispatch(walletsWithdrawLimitFetch());
	}, []);

	// method
	const findIcon = (currency_id: string): string => {
		const currency = currencies.find((currency: any) => currency.id === currency_id);
		try {
			return require(`../../../node_modules/cryptocurrency-icons/128/color/${currency_id.toLowerCase()}.png`);
		} catch (err) {
			if (currency) return currency.icon_url;
			return require('../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	const handleClose = () => {
		if (withdrawProcessPercent.isFinishWithdraw) {
			dispatch(walletsWithdrawCcyData({ withdrawProcess: 10, showProcessPopup: false, isFinish: false, reason: '' }));
		}
	};

	const getColorProcess = (percent: number) => {
		switch (percent) {
			case 30:
				return 'info';
			case 80:
				return 'warning';
			case 100:
				return 'success';
			default:
				return 'danger';
		}
	};

	const renderBody = () => {
		if (withdrawProcessPercent.isFinishWithdraw) {
			if (withdrawProcessPercent.status && withdrawProcessPercent.status === 'success') {
				return (
					<div className="row px-4">
						<div className="col-4 d-flex justify-content-center align-items-center">
							<img style={{ display: 'block', margin: 'auto' }} width="80px" src={WaitingPNG} alt="success" />
						</div>
						<div className="col-8 d-flex flex-column justify-content-center align-items-center">
							<h4 className="text-center text-bold mt-3">
								{intl.formatMessage({ id: 'page.body.plugins.wallet.withdraw.body.received' })}
							</h4>
							<p className="text-success text-center">
								{intl.formatMessage({ id: 'page.body.plugins.wallet.withdraw.body.reviewed' })}
							</p>
							<button
								style={{ background: '#28a745', width: '100px' }}
								onClick={handleClose}
								className="btn btn-primary mt-3"
							>
								{intl.formatMessage({ id: 'page.body.plugins.wallet.withdraw.body.close' })}
							</button>
						</div>
					</div>
				);
			} else {
				return (
					<div className="row px-4">
						<div className="col-4 d-flex justify-content-center align-items-center text-center">
							<img style={{ display: 'block', margin: 'auto' }} width="80px" src={FailPNG} alt="fail" />
						</div>
						<div className="col-8 d-flex flex-column justify-content-center align-items-center">
							<h4 className="text-bold mt-3">
								{intl.formatMessage({ id: 'page.body.plugins.wallet.withdraw.body.fail' })}
							</h4>
							<p className="text-danger text-center">
								{intl.formatMessage({ id: 'page.body.plugins.wallet.withdraw.body.otp.fail' })}
							</p>
							<button
								style={{ background: 'var(--yellow)', width: '100px' }}
								onClick={handleClose}
								className="btn btn-primary mt-3"
							>
								{intl.formatMessage({ id: 'page.body.plugins.wallet.withdraw.body.close' })}
							</button>
						</div>
					</div>
				);
			}
		} else {
			return (
				<div>
					<div className="d-flex justify-content-between align-items-center">
						<img width="100px" src={WarningPNG} alt="warning" />
						<h3 className="ml-3">{intl.formatMessage({ id: 'page.body.plugins.wallet.withdraw.body.warning' })}</h3>
					</div>
					<div className="mt-3">
						<ProgressBar
							style={{
								height: '25px',
								background: '#11223f',
								fontSize: '1rem',
								borderRadius: '10px',
							}}
							striped
							variant={getColorProcess(withdrawProcessPercent.percent)}
							animated
							now={withdrawProcessPercent.percent}
							label={`${withdrawProcessPercent.percent}%`}
						/>
					</div>
				</div>
			);
		}
	};

	return (
		<div className="container-fluid mt-3" id="withdraw-screen">
			<div className="d-flex flex-wrap withdraw-container">
				<div className="col-md-6 p-0">
					<WithdrawInfo
						wallets={wallets}
						currency_id={currency_id.toLowerCase()}
						currency_icon={findIcon(currency_id)}
					/>
				</div>
				<div className="col-md-6 p-0 withdraw-container__address">
					<WithdrawAddress
						user={user}
						currency_id={currency_id.toLowerCase()}
						wallets={wallets}
						currencies={currencies}
						ethFee={ethFee}
						childCurrencies={childCurrencies}
					/>
				</div>
			</div>
			<div className="row mt-5">
				<div className="col-12">
					<WithdrawHistory currency_id={currency_id.toLowerCase()} />
				</div>
			</div>
			<div style={{ position: 'fixed', top: '10%', left: '2rem' }}>
				<img
					style={{ cursor: 'pointer' }}
					src="https://img.icons8.com/fluent/48/000000/circled-left.png"
					onClick={() => history.push({ pathname: '/wallets' })}
					alt="Back"
				/>
			</div>
			<div>
				<NewModal
					show={withdrawProcessPercent.showWithdrawProcess}
					onHide={handleClose}
					titleModal={<FormattedMessage id="page.body.plugins.wallet.withdraw.header.process" />}
					bodyModal={renderBody()}
				/>
			</div>
		</div>
	);
};
