import * as React from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router';
import { BuyConfirmModal } from '../BuyConfirmModal';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
	currenciesFetch,
	selectCurrencies,
	selectWallets,
	selectPrice,
	getPrice,
	walletsFetch,
	BuyIEO,
	buyIEOItem,
	selectBuyIEO,
	resetBuyIEOResponse,
} from 'modules';
import NP from 'number-precision';
import { notification } from 'antd';
import { toNumber, upperCase, toString } from 'lodash';
import { formatNumber } from 'helpers';
import { useIntl } from 'react-intl';
import { convertEtoNumber } from 'helpers/convertEtoNumber';

interface BuyIEOProps {
	currencies: Array<string>;
	currencyID: string;
	priceIEO: number;
	type: string;
	minBuy: number;
	uid: string;
	id: string;
	allBonus: Array<any>;
}

export const BuyIEOComponent: React.FC<BuyIEOProps> = props => {
	const intl = useIntl();
	const history = useHistory();

	const [selectedCurrencyState, setSelectedCurrencyState] = React.useState(props.currencies[0] || '');
	const [currencyActive, setCurrencyActive] = React.useState(0);
	const [quantityState, setQuantityState] = React.useState<string>(Number(props.minBuy).toString());
	const [priceState, setPriceState] = React.useState(0);
	const [totalPriceState, setTotalPriceState] = React.useState<string>('0');
	const [isShowBuyConfirmModalState, setIsShowBuyConfirmModalState] = React.useState<boolean>(false);
	const [btnBuyAllState, setBtnBuyAllState] = React.useState(false);

	const currencies = useSelector(selectCurrencies);
	const wallets = useSelector(selectWallets);
	const priceSelector = useSelector(selectPrice);
	const [isLoadingState, setIsLoadingState] = React.useState<boolean>(false);

	const filteredWallets = wallets.filter(wallet => props.currencies.includes(wallet.currency));
	const baseWallet = wallets.find(wallet => wallet.currency === props.currencyID);
	const baseBalance = baseWallet ? Number(baseWallet.balance) || 0 : 0;

	const handleGetBalance = React.useCallback(
		currency => {
			const foundedWallet = filteredWallets.find(wallet => wallet.currency === currency);
			if (foundedWallet) {
				if (foundedWallet.balance) return Number(foundedWallet.balance);
				return 0;
			}

			return 0;
		},
		[filteredWallets],
	);
	const [quoteBalanceState, setQuoteBalanceState] = React.useState<number>(handleGetBalance(selectedCurrencyState));
	React.useEffect(() => {
		setSelectedCurrencyState(props.currencies[0]);
		setQuoteBalanceState(handleGetBalance(props.currencies[0]));
		setQuantityState(toString(props.minBuy));
	}, [props.currencies[0]]);

	const dispatch = useDispatch();
	const dispatchBuy = React.useCallback((buyInfo: BuyIEO) => dispatch(buyIEOItem(buyInfo)), [dispatch]);

	const dispatchFetchCurrencies = () => dispatch(currenciesFetch());
	const dispatchGetPrice = React.useCallback((priceConfig: any) => dispatch(getPrice(priceConfig)), [dispatch]);
	const dispatchWalletsFetch = React.useCallback(() => dispatch(walletsFetch()), [dispatch]);

	React.useEffect(() => {
		dispatchFetchCurrencies();
	}, []);
	React.useEffect(() => {
		dispatchWalletsFetch();
		dispatchGetPrice({
			fsym: 'USD',
			tsyms: props.currencies,
		});
	}, [props.currencies]);

	const buyResponse = useSelector(selectBuyIEO, shallowEqual);
	const getBonus = (listBonus: Array<any>, quantity: number): number => {
		const { bonus } = listBonus.find(bonus => {
			const { from } = bonus;
			return quantity >= from;
		}) || { bonus: 0 };
		return bonus;
	};

	const loadingBuyIEO = () => {
		return (
			<div className="d-flex justify-content-center" style={{ position: 'absolute', top: '45%', left: '45%' }}>
				<div className="spinner-border text-warning" role="status">
					<span className="sr-only">{intl.formatMessage({ id: 'page.ieo.body.loading' })}</span>
				</div>
			</div>
		);
	};
	const returnLoginScreen = () => {
		return (
			<button
				type="button"
				className={buyIEObuttonClassName}
				onClick={() => {
					const location = {
						pathname: '/login',
					};
					history.push(location);
				}}
			>
				{intl.formatMessage({ id: 'page.ieo.detail.buyIeo.pleaseLogin' })}
			</button>
		);
	};
	const buyIEOButton = () => {
		const checkSatisfy =
			Number(quantityState) !== 0 &&
			props.minBuy <= Number(quantityState) &&
			handleGetBalance(selectedCurrencyState) !== 0 &&
			handleGetBalance(selectedCurrencyState) >= Number(totalPriceState) &&
			props.type === 'ongoing';
		const styleDisable = {
			opacity: 0.6,
		};
		return (
			<button
				style={!checkSatisfy ? styleDisable : {}}
				type="button"
				className={buyIEObuttonClassName}
				onClick={() => {
					setIsShowBuyConfirmModalState(true);
				}}
				disabled={!checkSatisfy}
			>
				{intl.formatMessage({ id: 'page.ieo.detail.buyIeo.btn.buy' })}
				{` ${props.currencyID}`}
			</button>
		);
	};
	const hiddenBuyConfirmModal = () => {
		setIsShowBuyConfirmModalState(false);
	};
	React.useEffect(() => {
		if (!buyResponse.loading) {
			setIsLoadingState(false);
			if (buyResponse.success) {
				dispatch(resetBuyIEOResponse());
				setQuantityState(Number(props.minBuy).toString());
			}
		}
	}, [buyResponse.loading]);
	const handleBuy = () => {
		setIsLoadingState(true);
		if (
			priceState &&
			priceState > 0 &&
			Number(quantityState) > 0 &&
			totalPriceState &&
			toNumber(totalPriceState) > 0 &&
			selectedCurrencyState
		) {
			const buyInfo: BuyIEO = {
				ieo_id: props.id,
				quantity: Number(quantityState),
				quote_currency: selectedCurrencyState.toLowerCase(),
			};
			dispatchBuy(buyInfo);
			setIsShowBuyConfirmModalState(false);
		} else {
			notification.error({
				message: intl.formatMessage({ id: 'page.ieo.detail.buyIeo.message.err' }),
			});
		}
	};
	const handleClickBuyAll = (checked: boolean) => {
		if (checked) {
			setTotalPriceState(toString(handleGetBalance(selectedCurrencyState)));
		} else {
			setQuantityState(toString(props.minBuy));
			setTotalPriceState(toString(NP.strip(NP.times(props.minBuy, convertedPrice))));
		}
		setBtnBuyAllState(checked);
	};
	const showBuyConfirmModalView = () => {
		const check =
			isShowBuyConfirmModalState &&
			totalPriceState &&
			selectedCurrencyState &&
			Number(quantityState) >= props.minBuy &&
			priceState &&
			priceState > 0;

		return check ? (
			<BuyConfirmModal
				visible={isShowBuyConfirmModalState}
				onHiddenModal={hiddenBuyConfirmModal}
				onBuy={handleBuy}
				quantity={Number(quantityState)}
				ieoID={props.id.toString()}
				baseBalance={baseBalance}
				baseCurrency={String(props.currencyID).toUpperCase()}
				quoteBalance={quoteBalanceState}
				quoteCurrency={String(selectedCurrencyState).toUpperCase()}
				quoteTotal={toNumber(totalPriceState)}
				bonus={getBonus(props.allBonus, Number(quantityState))}
			/>
		) : (
			<></>
		);
	};
	const showCloseView = () => {
		return (
			<div className="buy-ieo-mobile-close-view">
				<div className="buy-ieo-mobile-close-view__content">
					<span>{intl.formatMessage({ id: 'page.ieo.detail.buyIeo.closeView.startPrice' })}</span>
					<p>USD</p>
					<span>{intl.formatMessage({ id: 'page.ieo.detail.buyIeo.closeView.startAfter' })}</span>
					<p style={{ color: 'rgb(248, 83, 113)' }}>{props.type.toUpperCase()}</p>
				</div>
			</div>
		);
	};
	const findIcon = (code: string): string => {
		const currency = currencies.find(currencyParam => currencyParam.id === code);
		try {
			return require(`../../../../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}
			return require('../../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};
	const calculatePrice = (basePrice: number, quotePrice: number) => {
		switch (selectedCurrencyState.toLowerCase()) {
			case 'udo':
				return NP.divide(NP.divide(1, quotePrice), NP.divide(1, basePrice));
			default:
				return NP.divide(quotePrice, NP.divide(1, basePrice));
		}
	};

	const convertedPrice = React.useMemo(() => {
		if (priceSelector.payload && selectedCurrencyState && priceSelector.payload[selectedCurrencyState.toUpperCase()]) {
			const convertedPrice = calculatePrice(props.priceIEO, priceSelector.payload[selectedCurrencyState.toUpperCase()]);
			return convertedPrice;
		}
		return 0;
	}, [priceSelector, selectedCurrencyState]);

	React.useEffect(() => {
		if (convertedPrice) {
			setQuantityState(toString(NP.strip(NP.divide(totalPriceState, convertedPrice))));
		}
	}, [totalPriceState]);

	React.useEffect(() => {
		if (convertedPrice) {
			setPriceState(convertedPrice);
			setTotalPriceState(toString(NP.strip(NP.times(quantityState, convertedPrice))));
		}
	}, [convertedPrice]);

	const currencyClassNames = classNames('buy-ieo-mobile-container__currencies__currency');
	const activeBuyCurrencyClassNames = classNames(
		'buy-ieo-mobile-container__currencies__currency',
		'buy-ieo-mobile-container__currencies__currency--active',
	);
	const disabledBuyClassName = classNames('buy-ieo-mobile-container--disable');
	const buyIEObuttonClassName = classNames('buy-ieo-mobile-container__buy-form__button');
	const handleForwardCurrency = (index: number, currency: string) => {
		setCurrencyActive(index);
		setSelectedCurrencyState(currency);
		setQuoteBalanceState(handleGetBalance(currency));
		setQuantityState(Number(props.minBuy).toString());
		setBtnBuyAllState(false);
	};
	return (
		<div id="buy-ieo-mobile" className="container">
			{showBuyConfirmModalView()}
			{isLoadingState ? loadingBuyIEO() : null}
			{props.type !== 'ongoing' ? showCloseView() : null}
			<div
				className={`buy-ieo-mobile-container ${
					props.type !== 'ongoing' || isShowBuyConfirmModalState || isLoadingState ? disabledBuyClassName : ''
				}`}
			>
				<div className="buy-ieo-mobile-container__currencies d-flex justify-content-center flex-wrap">
					{props.currencies.map((currency, index) => (
						<button
							key={index}
							className={currencyActive === index ? activeBuyCurrencyClassNames : currencyClassNames}
							onClick={() => {
								handleForwardCurrency(index, currency);
							}}
							style={{ margin: '0.2rem' }}
						>
							{currency}
						</button>
					))}
				</div>
				<div className="buy-ieo-mobile-container__balance mt-3">
					<div className="w-100">
						<div className="text-right w-100">
							<p className="buy-ieo-mobile-container__balance__amount">
								{intl.formatMessage({ id: 'page.ieo.detail.buyIeo.balance.available' })}{' '}
								{upperCase(props.currencyID)}: <span>{baseBalance}</span> {`${upperCase(props.currencyID)}`}
							</p>
							<p className="buy-ieo-mobile-container__balance__amount">
								{intl.formatMessage({ id: 'page.ieo.detail.buyIeo.balance.available' })}{' '}
								{selectedCurrencyState.toUpperCase()}: <span>{handleGetBalance(selectedCurrencyState)}</span>{' '}
								{`${selectedCurrencyState.toUpperCase()}`}
							</p>
						</div>
					</div>
					<div className="text-left" style={{ padding: '.5rem 0' }}>
						<button
							onClick={e => {
								handleClickBuyAll(!btnBuyAllState);
							}}
							id="buy-all"
							name="buy-all"
							className="buy-ieo-mobile-container__buy-all"
							type="button"
							value={toString(btnBuyAllState)}
						>
							{!btnBuyAllState ? 'Buy all' : 'Reset'}
						</button>
					</div>
				</div>
				<div className="buy-ieo-mobile-container__buy-form">
					<label htmlFor="quantityToBuy" className="mt-3">
						{intl.formatMessage({ id: 'page.mobile.ieo.detail.ieoId.byForm.inputQuantity' })}
					</label>
					<div className="buy-ieo-mobile-container__buy-form__input-group d-flex justify-content-center">
						<div className="buy-ieo-mobile-container__buy-form__input-group__logo">
							<img
								style={{ borderRadius: '50%' }}
								src={findIcon(selectedCurrencyState)}
								alt={`${selectedCurrencyState.toUpperCase()}-icon`}
							></img>
						</div>
						<input
							type="text"
							className="buy-ieo-mobile-container__buy-form__input-group__input"
							value={formatNumber(convertEtoNumber(toString(totalPriceState)))}
							placeholder="0"
							onChange={event => {
								const value = event.target.value.replace(/,/g, '');
								if (toNumber(value) >= 0) setTotalPriceState(value);
							}}
						/>
						<div className="buy-ieo-mobile-container__buy-form__input-group__denomination">
							<span>{selectedCurrencyState}</span>
						</div>
					</div>
					{/*Input quantity */}

					{props.minBuy > Number(quantityState) ? (
						<span style={{ color: 'rgb(218 50 58)', fontWeight: 'bold', width: '100%' }}>
							{intl.formatMessage({ id: 'page.mobile.ieo.detail.ieoId.byForm.desc' })}
							{`${formatNumber(toString(Number(props.minBuy)))} ${upperCase(props.currencyID)}`}
						</span>
					) : (
						''
					)}
					{/*Input price */}
					<br />
					<label htmlFor="buy-ieo-body-input-price" className="mt-3">
						{intl.formatMessage({ id: 'page.mobile.ieo.detail.ieoId.byForm.inputPrice' })}
					</label>
					<div className="buy-ieo-mobile-container__buy-form__input-group d-flex justify-content-center">
						<div className="buy-ieo-mobile-container__buy-form__input-group__logo">
							<img
								style={{ borderRadius: '50%' }}
								src={findIcon(selectedCurrencyState)}
								alt={`${selectedCurrencyState.toUpperCase()}-icon`}
							></img>
						</div>
						<input
							type="text"
							className="buy-ieo-mobile-container__buy-form__input-group__input"
							value={formatNumber(convertEtoNumber(toString(priceState)))}
							placeholder="0"
							style={{
								cursor: 'not-allowed',
							}}
							disabled
						></input>
						<div className="buy-ieo-mobile-container__buy-form__input-group__denomination">
							<span>{selectedCurrencyState}</span>
						</div>
					</div>
					<label htmlFor="quantityToBuy" className="mt-3">
						{intl.formatMessage({ id: 'page.mobile.ieo.detail.ieoId.byForm.inputTotal' })}
					</label>
					<div className="buy-ieo-mobile-container__buy-form__input-group d-flex" style={{ padding: '0' }}>
						<div className="buy-ieo-mobile-container__buy-form__input-group__logo">
							<img
								style={{ borderRadius: '50%' }}
								src={findIcon(props.currencyID)}
								alt={`${props.currencyID.toUpperCase()}-icon`}
							></img>
						</div>
						<input
							type="text"
							placeholder="0"
							value={formatNumber(toString(Number(quantityState)))}
							className="buy-ieo-mobile-container__buy-form__input-group__input"
							name="quantityToBuy"
							style={{
								cursor: 'not-allowed',
							}}
						/>
						<div className="buy-ieo-mobile-container__buy-form__input-group__denomination">
							<span>{props.currencyID}</span>
						</div>
					</div>

					{props.minBuy > Number(quantityState) ? (
						<span style={{ color: 'rgb(218 50 58)', fontWeight: 'bold', width: '100%' }}>
							** Quantity must be larger{' '}
							{`${formatNumber(toString(Number(props.minBuy)))} ${upperCase(props.currencyID)}`}
						</span>
					) : (
						''
					)}
					{/*Input quantity buy */}

					<div className="mt-3">{props.uid ? buyIEOButton() : returnLoginScreen()}</div>
				</div>
			</div>
		</div>
	);
};
