import Slider from 'antd/lib/slider';
import { Decimal, FormType, NewDropdown, NewTabPanel } from 'components';
import { MIN_USD_TRADE } from 'constants/trade';
import { cleanPositiveFloatInput, getAmount, getTotalPrice, precisionRegExp } from 'helpers';
import { useConvertToUSD, useMarketsTickersFetch, useWalletsFetch } from 'hooks';
import get from 'lodash/get';
import {
	alertPush,
	orderExecuteFetch,
	selectAmount,
	selectCurrentMarket,
	selectCurrentPrice,
	selectDepthAsks,
	selectDepthBids,
	selectMarketTickers,
	selectOrderExecuteLoading,
	selectWallets,
	setCurrentAmount,
	setCurrentPrice,
	Wallet,
} from 'modules';
import { TabPane } from 'rc-tabs';
import * as React from 'react';
import { Button, FormControl, FormControlProps, InputGroup } from 'react-bootstrap';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_ORDER_TYPES } from '../../../constants';

interface OrderProps {
	type: FormType;
	orderType: string | React.ReactNode;
	price: number | string;
	amount: number | string;
	available: number;
}

type OnSubmitCallback = (order: OrderProps) => void;
interface OrderFormProps {
	/**
	 * Price that is applied during total order amount calculation when type is Market
	 */
	priceMarket: number;
	/**
	 * Price that is applied during total order amount calculation when type is Market
	 */
	priceLimit?: number;
	/**
	 * Type of form, can be 'buy' or 'cell'
	 */
	type: FormType;
	/**
	 * Additional class name. By default element receives `td-order` class
	 * @default empty
	 */
	className?: string;
	/**
	 * Name of currency for price field
	 */
	from: string;
	/**
	 * Name of currency for amount field
	 */
	to: string;
	/**
	 * Amount of money in a wallet
	 */
	availableBase?: number;
	/**
	 * Amount of money in a wallet
	 */
	availableQuote?: number;
	/**
	 * Precision of amount, total, available, fee value
	 */
	currentMarketAskPrecision: number;
	/**
	 * Precision of price value
	 */
	currentMarketBidPrecision: number;
	/**
	 * Whether order is disabled to execute
	 */
	disabled?: boolean;
	/**
	 * Callback that is called when form is submitted
	 */
	onSubmit: OnSubmitCallback;
	listenInputPrice?: () => void;
	totalPrice: number;
	amount: string;
	handleAmountChange: (amount: string) => void;
	handleChangeAmountBySlider: (value: number, orderType: OrderProps['orderType'], price: string) => void;
}

interface OrderFormState {
	orderType: OrderProps['orderType'];
	price: string;
	priceMarket: number;
	amountFocused: boolean;
	priceFocused: boolean;
}

const OrderForm = React.memo<OrderFormProps>(props => {
	const intl = useIntl();
	const [orderType, setOrderType] = React.useState<OrderFormState['orderType']>(DEFAULT_ORDER_TYPES[0] as string);
	const [price, setPrice] = React.useState<OrderFormState['price']>('');
	const [priceMarket, setPriceMarket] = React.useState<OrderFormState['priceMarket']>(props.priceMarket);
	const [percent, setPercent] = React.useState<number>(0);

	React.useEffect(() => {
		const nextPriceLimitTruncated = Decimal.formatRemoveZero(props.priceMarket, props.currentMarketBidPrecision);
		setPrice(nextPriceLimitTruncated);
	}, []);

	React.useEffect(() => {
		const nextPriceLimitTruncated = Decimal.formatRemoveZero(props.priceLimit, props.currentMarketBidPrecision);
		if (orderType === 'Limit' && props.priceLimit && nextPriceLimitTruncated !== price) {
			setPrice(nextPriceLimitTruncated);
		}

		if (priceMarket !== props.priceMarket) {
			setPriceMarket(props.priceMarket);
		}
	}, [props.priceLimit, props.priceMarket, props.currentMarketBidPrecision, orderType, priceMarket, price]);

	const { type } = props;
	const isTypeSell = type === 'sell';
	const available = isTypeSell ? props.availableBase : props.availableQuote;

	const orderTypes = [
		intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.orderType.limit' }),
		intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.orderType.market' }),
	];

	const total = React.useMemo(
		() => (orderType === 'Market' ? props.totalPrice : (Number(props.amount) || 0) * (Number(price) || 0)),
		[orderType, price, props.totalPrice, props.amount],
	);

	const safePrice = React.useMemo(() => (props.amount && props.totalPrice / Number(props.amount)) || props.priceMarket, [
		props.totalPrice,
		props.amount,
		props.priceMarket,
	]);

	const handleSubmit = React.useCallback<React.FormEventHandler<HTMLFormElement>>(
		e => {
			e.preventDefault();
			const order = {
				type,
				orderType,
				amount: props.amount,
				price: orderType === 'Market' ? Decimal.formatRemoveZero(priceMarket, props.currentMarketBidPrecision) : price,
				available: available || 0,
			};

			props.onSubmit(order);
			setPrice('');
			props.handleAmountChange('');
		},
		[props.amount, available, price, priceMarket, type, orderType, props.onSubmit, props.handleAmountChange],
	);

	const checkButtonIsDisabled = React.useCallback((): boolean => {
		const invalidAmount = Number(props.amount) <= 0;
		const invalidLimitPrice = Number(price) <= 0 && orderType === 'Limit';
		const invalidMarketPrice = safePrice <= 0 && orderType === 'Market';

		return props.disabled || !available || invalidAmount || invalidLimitPrice || invalidMarketPrice;
	}, [props.amount, available, orderType, price, props.disabled, safePrice]);

	const priceText = intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.price' });
	const amountText = intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.amount' });

	const changeAmount: FormControlProps['onChange'] = e => {
		const { value } = e.target;
		const convertedValue = cleanPositiveFloatInput(String(value));

		if (convertedValue.match(precisionRegExp(props.currentMarketAskPrecision))) {
			props.handleAmountChange(convertedValue);
		}
	};

	const changeAmountBySlider = (value: number) => {
		setPercent(value);
		props.handleChangeAmountBySlider(value / 100, orderType, price);
	};

	const handlePriceChange: FormControlProps['onChange'] = e => {
		const { value } = e.target;
		const convertedValue = cleanPositiveFloatInput(String(value));

		if (convertedValue.match(precisionRegExp(props.currentMarketBidPrecision))) {
			setPrice(convertedValue);
		}
	};

	const marks = {
		0: '',
		25: '',
		50: '',
		75: '',
		100: '',
	};

	return (
		<form className="td-mobile-cpn-order-item" onSubmit={handleSubmit}>
			<NewDropdown
				list={orderTypes}
				onSelect={index => setOrderType(DEFAULT_ORDER_TYPES[index] as string)}
				placeholder=""
			/>
			<InputGroup className="td-mobile-cpn-order-item__input">
				<FormControl
					placeholder={priceText}
					aria-label={priceText}
					disabled={orderType === 'Market'}
					value={
						orderType === 'Market'
							? `≈ ${Decimal.formatRemoveZero(priceMarket, props.currentMarketBidPrecision)}`
							: price
					}
					onChange={handlePriceChange}
					aria-describedby="order-price"
				/>
				<InputGroup.Text id="order-price">{props.from}</InputGroup.Text>
			</InputGroup>
			<InputGroup className="td-mobile-cpn-order-item__input">
				<FormControl
					value={props.amount}
					placeholder={amountText}
					aria-label={amountText}
					onChange={changeAmount}
					aria-describedby="order-amount"
				/>
				<InputGroup.Text id="order-amount">{props.to}</InputGroup.Text>
			</InputGroup>
			<div className="td-mobile-cpn-order-item__total">
				{intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.total' })}{' '}
				{total ? <span className="text-white">{total}</span> : '--'} <span className="text-uppercase">{props.from}</span>
			</div>
			<Slider value={percent} step={25} onChange={changeAmountBySlider} tipFormatter={e => `${e}%`} marks={marks} />
			<Button
				disabled={checkButtonIsDisabled()}
				block={true}
				className={`td-mobile-cpn-order-item__submit`}
				variant={isTypeSell ? 'danger' : 'success'}
				type="submit"
			>
				{intl.formatMessage({ id: `page.body.trade.header.newOrder.content.tabs.${type}` })}
			</Button>
			<div className="td-mobile-cpn-order-item__balance">
				<div className="td-mobile-cpn-order-item__balance__item d-flex justify-content-between">
					<div className="td-mobile-cpn-order-item__balance__item__amount">
						{intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.available' })}{' '}
						<span>{props.availableQuote || 0}</span>
					</div>
					<div className="td-mobile-cpn-order-item__balance__item__unit">{props.from}</div>
				</div>
				<div className="td-mobile-cpn-order-item__balance__item d-flex justify-content-between">
					<div className="td-mobile-cpn-order-item__balance__item__amount">
						{intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.available' })}{' '}
						<span>{props.availableBase || 0}</span>
					</div>
					<div className="td-mobile-cpn-order-item__balance__item__unit">{props.to}</div>
				</div>
			</div>
		</form>
	);
}, isEqual);

// tslint:disable-next-line: no-empty-interface
interface OrderComponentProps {}

const OrderComponent: React.FC<OrderComponentProps> = ({}) => {
	useWalletsFetch();
	useMarketsTickersFetch();
	const intl = useIntl();
	const dispatch = useDispatch();
	const currentPrice = useSelector(selectCurrentPrice, isEqual);
	const currentAmount = useSelector(selectAmount, isEqual);
	const bids = useSelector(selectDepthBids);
	const asks = useSelector(selectDepthAsks);
	const currentMarket = useSelector(selectCurrentMarket, isEqual);
	const executeLoading = useSelector(selectOrderExecuteLoading, isEqual);
	const wallets = useSelector(selectWallets, isEqual);
	const marketTickers = useSelector(selectMarketTickers, isEqual);

	const [orderSide, setOrderSide] = React.useState<FormType>('buy');
	const [priceLimit, setPriceLimit] = React.useState<number | undefined>(undefined);
	const [amountSell, setAmountSell] = React.useState('');
	const [amountBuy, setAmountBuy] = React.useState('');
	const isTypeSell = orderSide === 'sell';

	const ratePriceUsd = +useConvertToUSD(1, get(currentMarket, 'quote_unit', ''));

	React.useEffect(() => {
		return () => {
			dispatch(setCurrentPrice(0));
			dispatch(setCurrentAmount(''));
		};
	}, []);

	React.useEffect(() => {
		if (currentPrice && currentPrice !== priceLimit) {
			setPriceLimit(currentPrice);
		}
		const amount = isTypeSell ? amountSell : amountBuy;
		if (currentAmount && currentAmount !== amount) {
			handleAmountChange(currentAmount);
		}
	}, [currentPrice, currentAmount]);

	const handleAmountChange = (amount: string) => {
		if (isTypeSell) {
			setAmountSell(amount);
		} else {
			setAmountBuy(amount);
		}
	};

	const handleSubmit = (value: OrderProps) => {
		if (!currentMarket) {
			return;
		}

		const { amount, available, orderType, price, type } = value;
		const total = +price * +amount;

		dispatch(setCurrentPrice(0));
		dispatch(setCurrentAmount(''));

		const resultData = {
			market: currentMarket.id,
			side: type,
			volume: amount.toString(),
			ord_type: (orderType as string).toLowerCase(),
		};

		const order = orderType === 'Limit' ? { ...resultData, price: price.toString() } : resultData;
		let orderAllowed = true;

		const priceUsd = total * ratePriceUsd;
		if (priceUsd < MIN_USD_TRADE) {
			dispatch(
				alertPush({
					message: [
						intl.formatMessage(
							{ id: 'error.order.create.minUsd' },
							{ usd: MIN_USD_TRADE, currency: currentMarket.quote_unit.toUpperCase() },
						),
					],
					type: 'error',
				}),
			);

			orderAllowed = false;
		}

		if (+resultData.volume < +currentMarket.min_amount) {
			dispatch(
				alertPush({
					message: [
						intl.formatMessage(
							{ id: 'error.order.create.minAmount' },
							{ amount: currentMarket.min_amount, currency: currentMarket.base_unit.toUpperCase() },
						),
					],
					type: 'error',
				}),
			);

			orderAllowed = false;
		}

		if (+price < +currentMarket.min_price) {
			dispatch(
				alertPush({
					message: [
						intl.formatMessage(
							{ id: 'error.order.create.minPrice' },
							{ price: currentMarket.min_price, currency: currentMarket.quote_unit.toUpperCase() },
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
							{ price: currentMarket.max_price, currency: currentMarket.quote_unit.toUpperCase() },
						),
					],
					type: 'error',
				}),
			);

			orderAllowed = false;
		}

		if ((+available < +amount * +price && order.side === 'buy') || (+available < +amount && order.side === 'sell')) {
			dispatch(
				alertPush({
					message: [
						intl.formatMessage(
							{ id: 'error.order.create.available' },
							{
								available: available,
								currency:
									order.side === 'buy'
										? currentMarket.quote_unit.toUpperCase()
										: currentMarket.base_unit.toUpperCase(),
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
		}
	};

	const renderOrderForm = () => {
		const getWallet = (currency: string) => {
			const currencyLower = currency.toLowerCase();

			return wallets.find(w => w.currency === currencyLower) as Wallet | undefined;
		};

		const getAvailableValue = (wallet: Wallet | undefined) => {
			return wallet && wallet.balance ? Number(wallet.balance) : 0;
		};

		const proposals = isTypeSell ? bids : asks;
		const defaultCurrentTicker = { last: '0' };
		const currentTicker = marketTickers[get(currentMarket, 'id', '')];
		const disabledData = isTypeSell ? {} : { disabled: executeLoading };
		const from = get(currentMarket, 'quote_unit', '');
		const to = get(currentMarket, 'base_unit', '');
		const walletBase = getWallet(to);
		const walletQuote = getWallet(from);
		const priceMarketBuy = Number((currentTicker || defaultCurrentTicker).last);
		const priceMarketSell = Number((currentTicker || defaultCurrentTicker).last);
		const availableBase = getAvailableValue(walletBase);
		const availableQuote = getAvailableValue(walletQuote);
		const priceMarket = isTypeSell ? priceMarketSell : priceMarketBuy;
		const amount = isTypeSell ? amountSell : amountBuy;
		const currentMarketAskPrecision = get(currentMarket, 'amount_precision', 6);
		const currentMarketBidPrecision = get(currentMarket, 'price_precision', 6);

		const handleChangeAmountBySlider = (value: number, orderType: OrderProps['orderType'], price: string) => {
			const available = isTypeSell ? availableBase : availableQuote;
			let newAmount = '';

			switch (orderSide) {
				case 'buy':
					switch (orderType) {
						case 'Limit':
							newAmount =
								available && +price
									? Decimal.format((available / +price) * value, currentMarketAskPrecision)
									: '';

							break;
						case 'Market':
							newAmount = available
								? Decimal.format(getAmount(Number(available), proposals, value), currentMarketAskPrecision)
								: '';

							break;
						default:
							break;
					}
					break;
				case 'sell':
					newAmount = available ? Decimal.format(available * value, currentMarketAskPrecision) : '';

					break;
				default:
					break;
			}

			handleAmountChange(newAmount);
		};

		return (
			<OrderForm
				type={orderSide}
				from={from}
				to={to}
				{...disabledData}
				availableBase={availableBase}
				availableQuote={availableQuote}
				priceMarket={priceMarket}
				priceLimit={priceLimit}
				onSubmit={handleSubmit}
				currentMarketAskPrecision={currentMarketAskPrecision}
				currentMarketBidPrecision={currentMarketBidPrecision}
				totalPrice={getTotalPrice(amount, priceMarket, proposals)}
				amount={amount}
				handleAmountChange={handleAmountChange}
				handleChangeAmountBySlider={handleChangeAmountBySlider}
			/>
		);
	};

	const tabListInfo = [
		{
			label: intl.formatMessage({ id: 'page.body.trade.header.newOrder.switch.buy' }),
			content: orderSide === 'buy' ? renderOrderForm() : null,
		},
		{
			label: intl.formatMessage({ id: 'page.body.trade.header.newOrder.switch.sell' }),
			content: orderSide === 'sell' ? renderOrderForm() : null,
		},
	];

	const onChangeTab = (activeKey: string) => {
		setOrderSide(activeKey as FormType);
	};

	return (
		<div className="td-mobile-cpn-order">
			<NewTabPanel defaultActiveKey={orderSide} onChange={onChangeTab}>
				{tabListInfo.map(tabInfo => (
					<TabPane key={tabInfo.label} tab={tabInfo.label}>
						{tabInfo.content}
					</TabPane>
				))}
			</NewTabPanel>
		</div>
	);
};

export const NewOrder = React.memo(OrderComponent, isEqual);
