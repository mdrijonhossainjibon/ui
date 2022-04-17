import React from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { currenciesFetch, selectCurrencies } from 'modules';
import Countdown from 'react-countdown';

import NP from 'number-precision';
import millify from 'millify';
import { useIntl } from 'react-intl';
interface IEOItemProps {
	id: string;
	type: 'ended' | 'ongoing' | 'upcoming';
	currencyId: string;
	startDate: string;
	endDate: string;
	description?: string;
	currencyAvailable: Array<string>;
	bonus?: string;
	remains: number;
	total: number;
	progress: number;
}
export const IEOItemComponent: React.FC<IEOItemProps> = props => {
	const intl = useIntl();
	const dispatch = useDispatch();
	const dispatchFetchCurrencies = () => dispatch(currenciesFetch());
	const history = useHistory();
	const [progressState, setProgressState] = React.useState<number>(0);
	const [totalState, setTotalState] = React.useState<number>(0);
	const [remainsState, setRemainsState] = React.useState<number>(0);

	React.useEffect(() => {
		const newProgress = Math.round(NP.minus(100, Number(props.progress)) * 100) / 100;
		setProgressState(newProgress);
		setTotalState(props.total);
		setRemainsState(props.remains);
	}, [props.progress, props.total, props.remains]);

	const status = (color: string, type: string) => {
		return (
			<div className="ioe-item-header__status" style={{ background: `${color}` }}>
				<p style={{ textTransform: 'uppercase', fontSize: '14px', lineHeight: '16px', margin: 0 }}>{type}</p>
			</div>
		);
	};
	const renderer = ({ days, hours, minutes, seconds, completed }) => {
		return (
			<div className="d-flex justify-content-center" id="countdown-renderer">
				<div className="timing">
					<div className="timing__material d-flex justify-content-center aligns-items-center">
						<div className="d-flex flex-column">
							<p>{days}</p>
							<span>{intl.formatMessage({ id: 'page.ieo.detail.countdown.days' })}</span>
						</div>
					</div>
				</div>
				<div className="timing">
					<div className="timing__material d-flex justify-content-center aligns-items-center">
						<div className="d-flex flex-column">
							<p>{hours}</p>
							<span>{intl.formatMessage({ id: 'page.ieo.detail.countdown.hours' })}</span>
						</div>
					</div>
				</div>
				<div className="timing">
					<div className="timing__material d-flex justify-content-center aligns-items-center">
						<div className="d-flex flex-column">
							<p>{minutes}</p>
							<span>{intl.formatMessage({ id: 'page.ieo.detail.countdown.minutes' })}</span>
						</div>
					</div>
				</div>
				<div className="timing">
					<div className="timing__material d-flex justify-content-center aligns-items-center">
						<div className="d-flex flex-column">
							<p>{seconds}</p>
							<span>{intl.formatMessage({ id: 'page.ieo.detail.countdown.seconds' })}</span>
						</div>
					</div>
				</div>
			</div>
		);
	};
	const renderStatus = (type: 'ended' | 'ongoing' | 'upcoming') => {
		switch (type) {
			case 'ongoing':
				return status(`#2FB67E`, 'Running');
			case 'upcoming':
				return status(` #E06211`, `Upcoming`);
			case 'ended':
				return status(`linear-gradient(90deg, #E84946 0.01%, #FFB800 100%)`, 'Ended');
			default:
				return `#ffff`;
		}
	};
	const rendererCountDown = (type: 'ended' | 'ongoing' | 'upcoming') => {
		if (type !== 'upcoming') return <Countdown date={props.endDate} renderer={renderer} />;
		return <Countdown date={props.startDate} renderer={renderer} />;
	};
	const currencies = useSelector(selectCurrencies);
	React.useEffect(() => {
		dispatchFetchCurrencies();
	}, []);
	const getCryptoIcon = (currencyID: string): string => {
		const currency = currencies.find((cur: any) => cur.id === currencyID.toLowerCase());
		try {
			return require(`../../../../../node_modules/cryptocurrency-icons/128/color/${currencyID.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}
			return require('../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};
	return (
		<div id="ieo-item-mobile" className="mt-4">
			<div className="ioe-item-header">
				{renderStatus(props.type)}
				<div className="ioe-item-header__img">
					<img
						style={{ borderRadius: '50%' }}
						src={getCryptoIcon(props.currencyId.toUpperCase())}
						alt={`${props.currencyId}-icon`}
					/>
				</div>
			</div>

			<div className="ieo-item-content">
				<h3>{props.description}</h3>
				{rendererCountDown(props.type)}

				<div
					className="ieo-item-content__remains col-12 d-flex flex-wrap justify-content-center text-center
            "
				>
					<div className="w-100" style={{ position: 'relative', margin: '5px' }}>
						<div
							className="progress"
							style={{
								width: '100%',
								background: 'rgba(132, 142, 156, 0.35)',
								height: '32px',
								borderRadius: '3px',
							}}
						>
							<div
								className="progress-bar progress-bar-striped progress-bar-animated"
								role="progressbar"
								aria-valuenow={remainsState}
								aria-valuemin={0}
								aria-valuemax={totalState}
								style={{ width: `${progressState}%`, backgroundColor: '#FFB800' }}
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
									{intl.formatMessage({ id: 'page.ieo.itemForList.IeoRemains' })}{' '}
									{`${
										Number(remainsState) > 100000000
											? millify(Number(remainsState), {
													precision: 2,
											  })
											: Number(remainsState)
									} `}
								</span>
								<span hidden={Number(remainsState) <= 0}>{`  /  `}</span>
								<span hidden={Number(remainsState) <= 0}>
									{' '}
									{Number(totalState) > 100000000
										? millify(Number(totalState), {
												precision: 2,
										  })
										: Number(totalState)}{' '}
									{intl.formatMessage({ id: 'page.ieo.itemForList.total' })}
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className="ieo-item-content__currencies d-flex flex-row flex-wrap">
					{props.currencyAvailable.map((currency, index) => (
						<div
							key={index}
							className="ieo-item-content__currencies--currency d-flex justify-content-center aligns-items-center flex-wrap"
						>
							<span>{currency}</span>
						</div>
					))}
				</div>
			</div>

			<div className="ioe-item-footer col-12 mt-4">
				<button
					className="ioe-item-footer__buy col-6"
					onClick={() => {
						const location = {
							pathname: `/ieo/detail/${props.id}`,
						};
						history.push(location);
					}}
				>
					{intl.formatMessage({ id: 'page.ieo.itemForList.btn.buy' })}
					{props.currencyId.toUpperCase()}
				</button>
				<p className="ioe-item-footer__bonus text-center col-6">
					{intl.formatMessage({ id: 'page.ieo.itemForList.btn.bonus' })}
					{!props.bonus ? '0%' : props.bonus}
				</p>
			</div>
		</div>
	);
};
