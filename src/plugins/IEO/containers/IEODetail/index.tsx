import React from 'react';
import MaskGroup from './assets/MaskGroup.png';
import { useSelector, useDispatch } from 'react-redux';
import { currenciesFetch, selectCurrencies } from '../../../../modules';
import { format } from 'date-fns';
import millify from 'millify';
import NP from 'number-precision';
import { toUpper, toString } from 'lodash';
import { formatNumber } from 'helpers';
import { convertEtoNumber } from 'helpers/convertEtoNumber';
import { useIntl } from 'react-intl';
interface IEODetailProps {
	startDate: string;
	endDate: string;
	bonus: string;
	currencyID: string;
	remains: number;
	total: number;
	progress: number;
	min_buy: number;
	start_price: number;
}

export const IEODetail: React.FC<IEODetailProps> = props => {
	const intl = useIntl();
	const [progressState, setProgressState] = React.useState<number>(
		Math.round(NP.minus(100, Number(props.progress)) * 100) / 100,
	);
	const [totalState, setTotalState] = React.useState<number>(0);
	const [remainsState, setRemainsState] = React.useState<number>(0);
	const dispatch = useDispatch();
	const dispatchFetchCurrencies = () => dispatch(currenciesFetch());
	React.useEffect(() => {
		dispatchFetchCurrencies();
		const newProgress = Math.round(NP.minus(100, Number(props.progress)) * 100) / 100;
		setProgressState(newProgress);
		setTotalState(props.total);
		setRemainsState(props.remains);
	}, [props.total, props.remains]);
	const currencies = useSelector(selectCurrencies);
	const findIcon = (code: string): string => {
		const currency = currencies.find(currencyParam => currencyParam.id === code);
		try {
			return require(`../../../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}
			return require('../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	const isSafeDate = (date: string) => {
		return !date ? new Date() : new Date(date);
	};
	const totalBought = totalState - remainsState;

	return (
		<div id="ieo-detail" style={{ backgroundImage: `url(${MaskGroup})` }}>
			<div className="ieo-detail__content col-11 m-auto">
				<div className="ieo-detail__content__header"></div>
				<div className="ieo-detail__content__body col-12">
					<div className="logo-icon d-flex justify-content-center">
						<img
							style={{ borderRadius: '50%' }}
							src={findIcon(props.currencyID)}
							alt={`${props.currencyID.toUpperCase()}-icon`}
						></img>
					</div>
					<div className="ieo-detail__content__body__time">{`${format(
						isSafeDate(props.startDate),
						'yyyy-MM-dd hh:mm',
					)} ~ ${format(isSafeDate(props.endDate), 'yyyy-MM-dd hh:mm')}`}</div>
					<div className="w-100" style={{ position: 'relative', margin: '5px' }}>
						<div className="progress" style={{ width: '100%', background: 'rgb(255 255 255 / 8%)', height: '30px' }}>
							<div
								className="progress-bar progress-bar-striped progress-bar-animated"
								role="progressbar"
								aria-valuenow={remainsState}
								aria-valuemin={0}
								aria-valuemax={totalState}
								style={{ width: `${progressState}%`, backgroundColor: 'rgb(255 184 0)' }}
							/>
							<div
								className="text-white d-flex justify-content-around align-items-center"
								style={{
									position: 'absolute',
									top: '0',
									left: '0',
									width: '100%',
									height: '100%',
									padding: '0 1rem',
									fontSize: '1rem',
								}}
							>
								<span>
									{intl.formatMessage({ id: 'page.ieo.detail.item.info.bought' })}
									{`${
										Number(totalBought) > 100000000
											? millify(Number(totalBought), {
													precision: 2,
											  })
											: Number(totalBought)
									} `}
								</span>
								<span hidden={Number(totalBought) <= 0}>{`  /  `}</span>
								<span hidden={Number(totalBought) <= 0}>
									{' '}
									{Number(totalState) > 100000000
										? millify(Number(totalState), {
												precision: 2,
										  })
										: Number(totalState)}{' '}
									{intl.formatMessage({ id: 'page.ieo.detail.item.info.total' })}
								</span>
							</div>
						</div>
					</div>
				</div>
				<hr></hr>
				<div className="ieo-detail-footer d-flex flex-wrap justify-content-bettween">
					<div className="ieo-detail-footer__bonus text-left col-12 mt-4">
						{' '}
						<span>{intl.formatMessage({ id: 'page.ieo.detail.item.info.footer.bonus' })}</span>
						{` ${props.bonus ? props.bonus : '0%'}  ${toUpper(props.currencyID)}`}
					</div>
					<div className="ieo-detail-footer__min_buy text-left col-12 mt-4">
						{' '}
						<span>{intl.formatMessage({ id: 'page.ieo.detail.item.info.footer.minBuy' })}</span>
						{` ${formatNumber(toString(Number(props.min_buy)))}`}
					</div>
					<div className="ieo-detail-footer__min_price text-left col-12 mt-4">
						<span>{intl.formatMessage({ id: 'page.ieo.detail.item.info.footer.startPrice' })}</span>
						{` ${convertEtoNumber(toString(Number(props.start_price)))} $`}
					</div>
					<div className="ieo-detail-footer__total text-left col-12 mt-4">
						<span>{intl.formatMessage({ id: 'page.ieo.detail.item.info.footer.total' })}</span>
						{` ${formatNumber(toString(props.total))}`}
					</div>
					<div className="ieo-detail-footer__remains text-left col-12 mt-4">
						<span>{intl.formatMessage({ id: 'page.ieo.detail.item.info.footer.remains' })}</span>
						{` ${formatNumber(toString(props.remains))}`}
					</div>
				</div>
			</div>
		</div>
	);
};
