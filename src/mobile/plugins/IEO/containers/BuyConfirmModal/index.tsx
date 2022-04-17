import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import NP from 'number-precision';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrencies } from 'modules';
import { useIntl } from 'react-intl';

interface BuyConfirmModalProps {
	visible: boolean;
	onHiddenModal: () => void;
	onBuy: () => void;
	quantity: number;
	ieoID: string;
	baseBalance: number;
	baseCurrency: string;
	quoteBalance: number;
	quoteCurrency: string;
	quoteTotal: number;
	bonus: number;
}

export const BuyConfirmModal: React.FC<BuyConfirmModalProps> = (props: BuyConfirmModalProps) => {
	const currencies = useSelector(selectCurrencies);
	const intl = useIntl();

	const {
		onHiddenModal,
		onBuy,
		quantity,
		quoteBalance,
		quoteCurrency,
		baseBalance,
		baseCurrency,
		quoteTotal,
		bonus,
		visible,
	} = props;
	const findIcon = (currencyID: string): string => {
		const currency = currencies.find(currency => currency.id === currencyID);
		try {
			return require(`../../../../../../node_modules/cryptocurrency-icons/128/color/${currencyID.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}

			return require('../../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	const bonusQuantity = NP.times(quantity, bonus);

	const totalQuantity = NP.plus(baseBalance, quantity, bonusQuantity);

	const baseTitle = (
		<div className="base-title-content w-100 d-flex justify-content-center">
			<img style={{ width: '3rem', height: '3rem', borderRadius: '50%' }} src={findIcon(baseCurrency)} alt={baseCurrency} />
			<span style={{ fontSize: '1.4rem', marginLeft: '5px' }}>{baseCurrency}</span>
		</div>
	);
	const quoteTitle = (
		<div className="base-title-content w-100 d-flex justify-content-center">
			<img
				style={{ width: '3rem', height: '3rem', borderRadius: '50%' }}
				src={findIcon(quoteCurrency)}
				alt={quoteCurrency}
			/>
			<span style={{ fontSize: '1.4rem', marginLeft: '5px' }}>{quoteCurrency}</span>
		</div>
	);
	const informationBuy = (balance: number, Status: JSX.Element, type: 'up' | 'down') => {
		return (
			<div
				className={`buy-confirm-modal-body__info-price__mobilize d-flex  mt-3 buy-confirm-modal-body__info-price__mobilize--${type}`}
			>
				<p style={{ fontSize: '1.2rem' }}>{balance}</p>
				{Status}
			</div>
		);
	};
	const bonusComponent = () => {
		if (bonus <= 0) {
			return null;
		}
		return (
			<div className="bonus" style={{ margin: '1rem' }}>
				<p>
					{intl.formatMessage({ id: 'page.ieo.detail.buyIeo.buyConfirm.bonus1' })} <span>{bonus * 100}%</span>{' '}
					{intl.formatMessage({ id: 'page.ieo.detail.buyIeo.buyConfirm.bonus2' })}
					{` ${quantity} ${baseCurrency.toUpperCase()}
					(+${bonusQuantity} ${baseCurrency.toUpperCase()}) = ${NP.plus(quantity, bonusQuantity)} 
					${baseCurrency.toUpperCase()}`}
				</p>
			</div>
		);
	};
	console.log(quoteBalance);

	return (
		<React.Fragment>
			{visible ? (
				<div id="buy-ieo-mobile-confirm-modal">
					<div className="buy-confirm-modal-header">
						<h2 style={{ marginTop: '8px' }}>
							{intl.formatMessage({ id: 'page.ieo.detail.buyIeo.buyConfirm.confirm.title' })}
						</h2>
					</div>
					<div className="buy-confirm-modal-body">
						<div className="d-flex flex-wrap justify-content-between col-12">
							<div className="col-6 buy-confirm-modal-body__info-price" style={{ paddingLeft: '0px' }}>
								<div
									className="w-100 d-flex flex-wrap justify-content-center"
									style={{
										backgroundColor: 'rgb(18 17 19 / 26%)',
										marginTop: '15px',
										padding: '1.8rem',
										borderRadius: '5px',
									}}
								>
									{baseTitle}
									{informationBuy(totalQuantity, <ArrowUpOutlined />, 'up')}
								</div>
							</div>
							<div className="col-6 buy-confirm-modal-body__info-price" style={{ paddingRight: '0px' }}>
								<div
									className="w-100 d-flex flex-wrap justify-content-center"
									style={{ backgroundColor: 'rgb(18 17 19 / 26%)', marginTop: '15px', padding: '1.8rem' }}
								>
									{quoteTitle}
									{informationBuy(NP.minus(quoteBalance, Number(quoteTotal)), <ArrowDownOutlined />, 'down')}
								</div>
							</div>
						</div>
						{bonusComponent()}
					</div>
					<div className="buy-confirm-modal-footer col-12 mt-3">
						<button className="col-5 buy-confirm-modal-footer__cancel" onClick={onHiddenModal}>
							{intl.formatMessage({ id: 'page.ieo.detail.buyIeo.buyConfirm.confirm.btn.cancel' })}
						</button>
						<button className="col-5 buy-confirm-modal-footer__buy" onClick={onBuy}>
							{intl.formatMessage({ id: 'page.ieo.detail.buyIeo.buyConfirm.confirm.btn.agree' })}
						</button>
					</div>
				</div>
			) : null}
		</React.Fragment>
	);
};
