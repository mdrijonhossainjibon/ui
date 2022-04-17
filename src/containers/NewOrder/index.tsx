import { Slider } from 'antd';
import moneySvg from 'assets/images/trading/money.svg';
import { Decimal, FormType, WalletItemProps } from 'components';
import { MIN_USD_TRADE } from 'constants/trade';
import { cleanPositiveFloatInput, precisionRegExp } from 'helpers';
import { useConvertToUSD } from 'hooks';
import floor from 'lodash/floor';
import get from 'lodash/get';
import {
	alertPush,
	orderExecuteFetch,
	OrderExecution,
	selectAmount,
	selectCurrentMarket,
	selectCurrentPrice,
	selectMarketTickers,
	selectOrderExecuteLoading,
	selectOrderType,
	selectUserLoggedIn,
	selectWallets,
	setCurrentPrice,
	Wallet,
	walletsFetch,
} from 'modules';
import Tabs, { TabPane, TabsProps } from 'rc-tabs';
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { OrderStyle } from './styles';

// tslint:disable-next-line: no-empty-interface
interface OrderProps {}

const defaultFormState = {
	amountBuy: '',
	amountSell: '',
	priceBuy: '',
	priceSell: '',
	totalBuy: '',
	totalSell: '',
	percentBuyMyBalance: 0,
	percentSellMyBalance: 0,
	fisrtFetchedPrice: false,
};

const defaultTicker = { amount: 0, low: 0, last: 0, high: 0, volume: 0, price_change_percent: '+0.00%' };

export const NewOrder: React.FC<OrderProps> = ({}) => {
	const intl = useIntl();
	const dispatch = useDispatch();

	const executeLoading = useSelector(selectOrderExecuteLoading, isEqual);
	const wallets = useSelector(selectWallets, isEqual);
	const currentMarket = useSelector(selectCurrentMarket, isEqual);
	const marketTickers = useSelector(selectMarketTickers, isEqual);
	const isLoggedIn = useSelector(selectUserLoggedIn, isEqual);
	const currentPrice = useSelector(selectCurrentPrice, isEqual);
	const currentOrderType = useSelector(selectOrderType, isEqual);
	const currentAmount = useSelector(selectAmount, isEqual);

	const getTickerValue = (value: string) => {
		return currentMarket && (marketTickers[currentMarket.id] || defaultTicker)[value];
	};

	const ratePriceUsd = +useConvertToUSD(1, get(currentMarket, 'quote_unit', ''));

	const TABS_LIST_KEY = [
		intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.orderType.limit' }),
		intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.orderType.market' }),
	];

	const [tabTypeSelectedState, setTabTypeSelectedState] = React.useState<string>(TABS_LIST_KEY[0]);
	const [formState, setFormState] = React.useState(defaultFormState);

	React.useEffect(() => {
		if (currentPrice && currentMarket) {
			const price = Decimal.formatRemoveZero(currentPrice, currentMarket.price_precision);
			setFormState(prev => ({ ...prev, priceBuy: price, priceSell: price }));
			changeAmountTotalSlider(currentOrderType === 'buy' ? 'buy' : 'sell', 'price');
			changeAmount(currentAmount, currentOrderType === 'buy' ? 'sell' : 'buy');
		}
	}, [currentPrice, currentMarket, currentOrderType]);

	React.useEffect(() => {
		setFormState(prev => ({ ...prev, fisrtFetchedPrice: false }));
	}, [currentMarket]);

	React.useEffect(() => {
		const last = getTickerValue('last') as number;
		if (currentMarket && last && !formState.priceBuy && !formState.priceSell && !formState.fisrtFetchedPrice) {
			const price = Decimal.formatRemoveZero(last, currentMarket.price_precision);
			setFormState(prev => ({ ...prev, priceBuy: price, priceSell: price, fisrtFetchedPrice: true }));
		}
	}, [currentMarket, marketTickers]);

	React.useEffect(() => {
		if (isLoggedIn && !wallets.length) {
			dispatch(walletsFetch());
		}
	}, [isLoggedIn, wallets]);

	React.useEffect(() => {
		setFormState(defaultFormState);
	}, [currentMarket && currentMarket.id, tabTypeSelectedState]);

	const resetAfterSubmit = (type: FormType) => {
		setFormState(prev => ({
			...prev,
			priceBuy: prev.priceBuy || defaultFormState.priceBuy,
			priceSell: prev.priceSell || defaultFormState.priceSell,
			...(type === 'sell'
				? {
						totalSell: defaultFormState.totalSell,
						amountSell: defaultFormState.amountSell,
						percentSellMyBalance: defaultFormState.percentSellMyBalance,
				  }
				: {
						totalBuy: defaultFormState.totalBuy,
						amountBuy: defaultFormState.amountBuy,
						percentBuyMyBalance: defaultFormState.percentBuyMyBalance,
				  }),
		}));
	};

	const changeAmountTotalSlider = (type: FormType, field: 'amount' | 'slider' | 'total' | 'price') => {
		if (currentMarket) {
			const { amount_precision, price_precision, quote_unit, base_unit } = currentMarket;
			const walletQuote = getWallet(quote_unit, wallets);
			const walletBase = getWallet(base_unit, wallets);
			const balance = get(type === 'buy' ? walletQuote : walletBase, 'balance', 0);
			const lastPrice = floor(getTickerValue('last'), price_precision);

			if (balance) {
				if (type === 'sell') {
					switch (field) {
						case 'amount':
							setFormState(prev => {
								const percentSellMyBalance =
									+prev.priceSell && +prev.amountSell
										? floor((+prev.amountSell / +balance) * 100)
										: prev.percentSellMyBalance;
								const totalSell =
									+prev.amountSell && +prev.priceSell
										? floor(+prev.amountSell * +prev.priceSell, 8).toString()
										: prev.totalSell;

								return {
									...prev,
									percentSellMyBalance,
									totalSell,
								};
							});
							break;
						case 'slider':
							if (tabTypeSelectedState === TABS_LIST_KEY[0]) {
								setFormState(prev => {
									const amountSell =
										+prev.priceSell && prev.percentSellMyBalance
											? floor((+balance / 100) * prev.percentSellMyBalance, amount_precision).toString()
											: prev.amountSell;
									const totalSell =
										+amountSell && +prev.priceSell
											? floor(+prev.priceSell * +amountSell, 8).toString()
											: prev.totalSell;

									return {
										...prev,
										amountSell,
										totalSell,
									};
								});
							} else {
								setFormState(prev => {
									const amountSell =
										lastPrice && prev.percentSellMyBalance
											? floor((+balance / 100) * prev.percentSellMyBalance, amount_precision).toString()
											: prev.amountSell;
									const totalSell =
										+amountSell && lastPrice ? floor(lastPrice * +amountSell, 8).toString() : prev.totalSell;

									return {
										...prev,
										amountSell,
										totalSell,
									};
								});
							}
							break;
						case 'total':
							setFormState(prev => {
								const amountSell =
									+prev.totalSell && +prev.priceSell
										? floor(+prev.totalSell / +prev.priceSell, amount_precision).toString()
										: prev.amountSell;
								const percentSellMyBalance = +amountSell ? floor((+amountSell / +balance) * 100) : 0;

								return {
									...prev,
									amountSell,
									percentSellMyBalance: percentSellMyBalance > 100 ? 100 : percentSellMyBalance,
								};
							});
							break;
						case 'price':
							setFormState(prev => {
								const totalSell =
									+prev.amountSell && +prev.priceSell
										? floor(+prev.amountSell * +prev.priceSell, 8).toString()
										: defaultFormState.totalSell;

								return {
									...prev,
									totalSell,
								};
							});
							break;
						default:
							break;
					}
				} else {
					switch (field) {
						case 'amount':
							setFormState(prev => {
								const percentBuyMyBalance =
									+prev.priceBuy && +prev.amountBuy
										? floor((+prev.amountBuy * +prev.priceBuy) / (+balance / 100))
										: 0;
								const totalBuy =
									+prev.amountBuy && +prev.priceBuy
										? floor(+prev.amountBuy * +prev.priceBuy, 8).toString()
										: '';

								return {
									...prev,
									percentBuyMyBalance,
									totalBuy,
								};
							});
							break;
						case 'slider':
							if (tabTypeSelectedState === TABS_LIST_KEY[0]) {
								setFormState(prev => {
									const totalBuy =
										+prev.priceBuy && prev.percentBuyMyBalance
											? (floor(prev.percentBuyMyBalance * (+balance / 100), 8) || 0).toString()
											: prev.totalBuy;
									const amountBuy =
										+totalBuy && +prev.priceBuy
											? floor(+totalBuy / +prev.priceBuy, amount_precision).toString()
											: prev.amountBuy;

									return {
										...prev,
										amountBuy,
										totalBuy,
									};
								});
							} else {
								setFormState(prev => {
									const totalBuy =
										lastPrice && prev.percentBuyMyBalance
											? floor(prev.percentBuyMyBalance * (+balance / 100), 8).toString()
											: prev.totalBuy;
									const amountBuy =
										+totalBuy && lastPrice
											? floor(+totalBuy / lastPrice, amount_precision).toString()
											: prev.amountBuy;

									return {
										...prev,
										amountBuy,
										totalBuy,
									};
								});
							}
							break;
						case 'total':
							setFormState(prev => {
								const amountBuy =
									+prev.priceBuy && +prev.totalBuy
										? floor(+prev.totalBuy / +prev.priceBuy, amount_precision).toString()
										: prev.amountBuy;
								const percentBuyMyBalance =
									+amountBuy && +prev.totalBuy
										? floor((+prev.totalBuy / +balance) * 100)
										: prev.percentBuyMyBalance;

								return {
									...prev,
									amountBuy,
									percentBuyMyBalance: percentBuyMyBalance > 100 ? 100 : percentBuyMyBalance,
								};
							});
							break;
						case 'price':
							setFormState(prev => {
								const totalBuy =
									+prev.amountBuy && +prev.priceBuy
										? floor(+prev.amountBuy * +prev.priceBuy, 8).toString()
										: prev.totalBuy;
								const percentBuyMyBalance = +totalBuy ? floor(+totalBuy / (+balance / 100)) : 0;

								return {
									...prev,
									totalBuy,
									percentBuyMyBalance: percentBuyMyBalance > 100 ? 100 : percentBuyMyBalance,
								};
							});
							break;
						default:
							break;
					}
				}
			}
		}
	};

	const changeAmount = (value: string, type: FormType) => {
		const convertedValue = cleanPositiveFloatInput(String(value));
		if (convertedValue.match(precisionRegExp(get(currentMarket, 'amount_precision', 6)))) {
			if (type === 'sell') {
				setFormState(prev => ({
					...prev,
					amountSell: convertedValue,
				}));
			} else {
				setFormState(prev => ({
					...prev,
					amountBuy: convertedValue,
				}));
			}
			changeAmountTotalSlider(type, 'amount');
		}
	};

	const changeTotal = (value: string, type: FormType) => {
		const convertedValue = cleanPositiveFloatInput(String(value));
		if (convertedValue.match(precisionRegExp(8))) {
			if (type === 'sell') {
				setFormState(prev => ({
					...prev,
					totalSell: convertedValue,
				}));
			} else {
				setFormState(prev => ({
					...prev,
					totalBuy: convertedValue,
				}));
			}
			changeAmountTotalSlider(type, 'total');
		}
	};

	const changePrice = (value: string, type: FormType) => {
		const convertedValue = cleanPositiveFloatInput(String(value));
		if (convertedValue.match(precisionRegExp(get(currentMarket, 'price_precision', 6)))) {
			if (type === 'sell') {
				setFormState(prev => ({
					...prev,
					priceSell: convertedValue,
				}));
			} else {
				setFormState(prev => ({
					...prev,
					priceBuy: convertedValue,
				}));
			}
			changeAmountTotalSlider(type, 'price');
		}
	};

	const onChangeSlider = (value: number, type: FormType) => {
		if (currentMarket) {
			setFormState(prev => ({
				...prev,
				percentBuyMyBalance: type === 'buy' ? value : prev.percentBuyMyBalance,
				percentSellMyBalance: type === 'sell' ? value : prev.percentSellMyBalance,
			}));

			changeAmountTotalSlider(type, 'slider');
		}
	};

	const handelTabSelected: TabsProps['onChange'] = key => {
		if (tabTypeSelectedState !== key) {
			setTabTypeSelectedState(key);
		}
	};

	const marks = {
		0: '',
		25: '',
		50: '',
		75: '',
		100: '',
	};

	const getWallet = (currency: string, walletsParam: WalletItemProps[]) => {
		const currencyLower = currency.toLowerCase();

		return walletsParam.find(w => w.currency === currencyLower) as Wallet;
	};

	const getAvailableValue = (wallet: Wallet | undefined) => {
		return wallet && wallet.balance ? Number(wallet.balance) : 0;
	};

	const handleSubmit = (type: FormType) => {
		if (!currentMarket) {
			return;
		}

		dispatch(setCurrentPrice(0));
		const { id, quote_unit, price_precision, base_unit } = currentMarket;
		const walletQuote = getWallet(quote_unit, wallets);
		const walletBase = getWallet(base_unit, wallets);

		const amount = Number(type === 'sell' ? formState.amountSell : formState.amountBuy);
		const priceType = type === 'buy' ? formState.priceBuy : formState.priceSell;
		const price =
			tabTypeSelectedState === TABS_LIST_KEY[0] ? priceType : floor(getTickerValue('last'), price_precision).toString();
		const available = type === 'buy' ? getAvailableValue(walletQuote) : getAvailableValue(walletBase);

		const resultData: OrderExecution = {
			market: id,
			side: type,
			volume: amount.toString(),
			ord_type: tabTypeSelectedState.toLowerCase(),
		};

		const order = tabTypeSelectedState === TABS_LIST_KEY[0] ? { ...resultData, price: price } : resultData;
		let orderAllowed = true;

		const priceUsd = +(type === 'buy' ? formState.totalBuy : formState.totalSell) * ratePriceUsd;
		if (priceUsd < MIN_USD_TRADE) {
			dispatch(
				alertPush({
					message: [
						intl.formatMessage(
							{ id: 'error.order.create.minUsd' },
							{ usd: MIN_USD_TRADE, currency: quote_unit.toUpperCase() },
						),
					],
					type: 'error',
				}),
			);

			orderAllowed = false;
		}

		if (+currentMarket.min_amount && +resultData.volume < +currentMarket.min_amount) {
			dispatch(
				alertPush({
					message: [
						intl.formatMessage(
							{ id: 'error.order.create.minAmount' },
							{ amount: currentMarket.min_amount, currency: base_unit.toUpperCase() },
						),
					],
					type: 'error',
				}),
			);

			orderAllowed = false;
		}

		if (+currentMarket.min_price && +price < +currentMarket.min_price) {
			dispatch(
				alertPush({
					message: [
						intl.formatMessage(
							{ id: 'error.order.create.minPrice' },
							{ price: currentMarket.min_price, currency: quote_unit.toUpperCase() },
						),
					],
					type: 'error',
				}),
			);

			orderAllowed = false;
		}

		if (+currentMarket.max_price && +price > +currentMarket.max_price) {
			dispatch(
				alertPush({
					message: [
						intl.formatMessage(
							{ id: 'error.order.create.maxPrice' },
							{ price: currentMarket.max_price, currency: quote_unit.toUpperCase() },
						),
					],
					type: 'error',
				}),
			);

			orderAllowed = false;
		}

		if (
			(available < +formState.totalBuy && order.side === 'buy') ||
			(available < +formState.amountSell && order.side === 'sell')
		) {
			dispatch(
				alertPush({
					message: [
						intl.formatMessage(
							{ id: 'error.order.create.available' },
							{
								available: available,
								currency: order.side === 'buy' ? quote_unit.toUpperCase() : base_unit.toUpperCase(),
							},
						),
					],
					type: 'error',
				}),
			);

			orderAllowed = false;
		}

		if (orderAllowed) {
			dispatch(orderExecuteFetch(order));
			resetAfterSubmit(type);
		}
	};

	const renderForm = () => {
		if (!currentMarket) {
			return (
				<div className="h-100 d-flex justify-content-center align-items-center">
					<Spinner animation="border" />
				</div>
			);
		}

		const walletBase = getWallet(currentMarket.base_unit, wallets);
		const walletQuote = getWallet(currentMarket.quote_unit, wallets);
		const priceMarket = floor(getTickerValue('last'), currentMarket.price_precision);

		const arrType: FormType[] = ['buy', 'sell'];
		const FormActionsElm = () =>
			arrType.map((type, i) => {
				const { base_unit, quote_unit } = currentMarket;
				const isDisabled =
					executeLoading ||
					(type === 'buy'
						? !(formState.priceBuy || tabTypeSelectedState !== TABS_LIST_KEY[0]) ||
						  !formState.amountBuy ||
						  Number(formState.amountBuy) === 0
						: !(formState.priceSell || tabTypeSelectedState !== TABS_LIST_KEY[0]) ||
						  !formState.amountSell ||
						  Number(formState.amountSell) === 0);
				const balance =
					type === 'buy'
						? floor(+get(walletQuote, 'balance', '0'), get(walletQuote, 'fixed', 6))
						: floor(+get(walletBase, 'balance', '0'), get(walletBase, 'fixed', 6));
				const price = type === 'buy' ? formState.priceBuy : formState.priceSell;
				const amount = type === 'buy' ? formState.amountBuy : formState.amountSell;
				const total = type === 'buy' ? formState.totalBuy : formState.totalSell;
				const percent = type === 'buy' ? formState.percentBuyMyBalance : formState.percentSellMyBalance;
				const isEmptyBalance = type === 'buy' ? !get(walletQuote, 'balance', null) : !get(walletBase, 'balance', null);
				const isDisabledSlider =
					!isLoggedIn ||
					(tabTypeSelectedState === TABS_LIST_KEY[0] ? isEmptyBalance : !get(walletBase, 'balance', null));

				return (
					<div className="col p-0" key={i}>
						<form
							className={`content-form-${type}`}
							onSubmit={e => {
								e.preventDefault();
								handleSubmit(type);
							}}
						>
							<div className="d-flex title-block mb-3">
								<div className="flex-fill title-block-left">
									{intl.formatMessage({ id: `page.body.trade.header.newOrder.content.title.${type}` })}{' '}
									{base_unit.toUpperCase()}
								</div>
								<div className="flex-fill text-right title-block-right">
									<img className="mr-2" src={moneySvg} />
									{` ${balance || '-'} `}
									{type === 'buy' ? quote_unit.toUpperCase() : base_unit.toUpperCase()}
								</div>
							</div>
							<div className="input-group mb-3">
								<div className="input-group-prepend">
									<span className="input-group-text d-flex align-items-center text-right">
										{intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.price' })}
									</span>
								</div>
								{tabTypeSelectedState === TABS_LIST_KEY[0] ? (
									<input
										type="text"
										value={price}
										onChange={e => changePrice(e.target.value, type)}
										className="form-control text-right"
									/>
								) : (
									<input type={'text'} value={`≈${priceMarket}`} className="form-control text-right" disabled />
								)}

								<div className="input-group-append d-flex justify-content-end align-items-center">
									<span className="input-group-text"> {quote_unit.toUpperCase() || 'NONE'}</span>
								</div>
							</div>
							<div className="input-group">
								<div className="input-group-prepend">
									<span className="input-group-text d-flex align-items-center text-right">
										{intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.amount' })}
									</span>
								</div>
								<input
									type="text"
									className="form-control text-right"
									value={amount}
									onChange={e => changeAmount(e.target.value, type)}
								/>
								<div className="input-group-append d-flex justify-content-end align-items-center">
									<span className="input-group-text"> {base_unit.toUpperCase()}</span>
								</div>
							</div>
							<Slider
								disabled={isDisabledSlider}
								tipFormatter={e => `${e}%`}
								marks={marks}
								step={1}
								value={percent}
								onChange={(value: number) => {
									onChangeSlider(value, type);
								}}
							/>
							{isLoggedIn && tabTypeSelectedState === TABS_LIST_KEY[0] ? (
								<div className="input-group">
									<div className="input-group-prepend">
										<span className="input-group-text d-flex align-items-center text-right">
											{intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.total' })}
										</span>
									</div>
									<input
										type="text"
										className="form-control text-right"
										value={total}
										onChange={e => changeTotal(e.target.value, type)}
									/>
									<div className="input-group-append d-flex justify-content-end align-items-center">
										<span className="input-group-text"> {quote_unit.toUpperCase()}</span>
									</div>
								</div>
							) : null}
							{isLoggedIn ? (
								<button
									type="submit"
									className={`btn submit-order btn-block mr-1 mt-1 btn-lg btn-${
										type === 'buy' ? 'success' : 'danger'
									} btn-block btn-lg w-100 mt-2`}
									disabled={isDisabled}
								>
									<span>
										{' '}
										{intl.formatMessage({ id: `page.body.trade.header.newOrder.content.title.${type}` })}
									</span>
								</button>
							) : (
								<div className="logger-order w-100 d-flex justify-content-center align-item-center">
									<Link to="/login"> {intl.formatMessage({ id: 'page.body.user.loggin' })}</Link>
									<span>{intl.formatMessage({ id: 'page.trading.newOrder.logger.or' })}</span>
									<Link to="/register"> {intl.formatMessage({ id: 'page.body.user.register' })}</Link>
								</div>
							)}
						</form>
					</div>
				);
			});

		return (
			<div className="content-form-wrapper">
				<div className="row">{FormActionsElm()}</div>
			</div>
		);
	};

	const renderTabs = () => {
		const mapTabs = TABS_LIST_KEY.map(key => (
			<TabPane tab={key} key={key}>
				{tabTypeSelectedState === key ? renderForm() : null}
			</TabPane>
		));

		const elmExtra = (
			<React.Fragment>
				<span>{intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.buyWith' })}</span>
				<button>{currentMarket && currentMarket.quote_unit.toUpperCase()}</button>
			</React.Fragment>
		);

		return (
			<Tabs tabBarExtraContent={elmExtra} defaultActiveKey="1" onChange={handelTabSelected}>
				{mapTabs}
			</Tabs>
		);
	};

	return <OrderStyle>{renderTabs()}</OrderStyle>;
};
