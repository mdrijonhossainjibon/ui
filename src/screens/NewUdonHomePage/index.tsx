import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Slider from 'react-slick';
import { UdonMarket } from '../../containers';
import { setDocumentTitle } from '../../helpers';
import { eventFetch, selectEvents, selectUserLoggedIn } from '../../modules';
import background from './home/background-bn.jpg';
import Bg_p3 from './home/Bg_p3.svg';
import Bg_p4 from './home/Bg_p4.svg';
import BG_SigUp from './home/BG_Sigup.png';
import FaceBook from './home/fb.svg';
import Feature1 from './home/Feature1.svg';
import Feature2 from './home/Feature2.svg';
import Feature3 from './home/Feature3.svg';
import Feature4 from './home/Feature4.svg';
import Feature5 from './home/Feature5.svg';
import Feature6 from './home/Feature6.svg';
import TelegramPNG from './home/telegram.png';
import In from './home/In.svg';
import Mobile from './home/Mobile_BG.png';
import DownloadAPP from './home/Screen1.png';
import DownloadGG from './home/Screen2.png';
import Download2 from './home/Screen3.png';
import Download1 from './home/Screen4.png';
import Telegram from './home/Telegram.svg';
import Udon from './home/udon-img.svg';
import WhatApp from './home/WhatApp.svg';
import YouT from './home/ytb.svg';
import { transactionsListFetch } from 'modules/plugins/transactions';
import { selectStatistics, statisticFetch } from 'modules/plugins/info/statistic';
import { useIntl } from 'react-intl';

export const SALE_UDON_CONFIG = {
	udonTotalNumber: 2 * 10 ** 12,
	udonTotalText: '2.000.000.000.000',
	endTime: 'Nov 5,2021',
	priceText: '0,000001 USD',
	priceNumber: '0.000001',
	saleCurrencies: ['bnb', 'usdt', 'busd'],
	address: '0x8606d59312150A2970377502b607c36084aC4806',
};

export const NewUdonHomePage = () => {
	setDocumentTitle('Homepage');

	const intl = useIntl();

	const dispatch = useDispatch();
	const history = useHistory();
	const isLogin = useSelector(selectUserLoggedIn);
	const statistics = useSelector(selectStatistics);

	React.useEffect(() => {
		dispatch(eventFetch());
		dispatch(transactionsListFetch({ limit: 20, page: 0 }));
		dispatch(statisticFetch());
	}, []);

	const events = useSelector(selectEvents);

	const settingEvents = {
		dots: false,
		infinite: true,
		speed: 500,
		autoplay: true,
		autoplaySpeed: 3000,
		pauseOnHover: true,
		slidesToShow: 3,
		slidesToScroll: 1,
	};

	const translate = (key: string) => intl.formatMessage({ id: key });

	const renderBanner = () => {
		return (
			<div className="homepage-banner" style={{ backgroundImage: 'url(' + background + ')' }}>
				<div className="container">
					<div className="row">
						<div className="col-lg-8 main-homepage-banner">
							<h2 className="main-homepage-banner__title">
								{intl.formatMessage({ id: 'page.body.landing.marketInfo.title.text2' })}
							</h2>
							<button
								className="main-homepage-banner__button"
								onClick={() => {
									isLogin ? redirectTrading() : redirectSingUP();
								}}
							>
								{isLogin
									? intl.formatMessage({ id: 'page.body.landing.marketInfo.title.button.trade' })
									: intl.formatMessage({ id: 'page.body.landing.marketInfo.title.button.register' })}
							</button>
						</div>
						<div className="col-lg-4 d-flex">
							<img src={Udon} alt="" />
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderEvent = () => {
		return (
			<div className="homepage-event">
				<div className="container">
					<Slider {...settingEvents}>
						{[...events.payload].map(event => {
							return (
								<div style={{ width: 270, height: 150 }}>
									<a href={event.ref_link} className="slide" target="_blank">
										<img src={event.image_link} style={{ width: '100%', height: '100%', borderRadius: 4 }} />
									</a>
								</div>
							);
						})}
					</Slider>
				</div>
			</div>
		);
	};
	const renderMarket = () => {
		return (
			<div className="homepage-markets pt-5" style={{ backgroundImage: 'url(' + BG_SigUp + ')' }}>
				<UdonMarket />
			</div>
		);
	};
	const renderDownload = () => {
		return (
			<div className="homepage-download">
				<div className="container">
					<div className="main-homepage-download">
						<div className="row dowdload-box">
							<div className="col-5 dowdload-box__box-1" style={{ paddingTop: 100 }}>
								<div className="row ">
									<div className="col-12">
										<div className="d-flex justify-content-start">
											<h1 style={{ color: '#FFFFFF' }}> {translate('page.homePage.download.download')}</h1>
											<h1 style={{ color: '#FFB800', marginLeft: 12 }}>
												{' '}
												{translate('page.homePage.download.name')}
											</h1>
										</div>
										<h4 className="mt-3" style={{ color: '#FFFFFF' }}>
											{translate('page.homePage.download.title')}
										</h4>
									</div>
								</div>
								<div className="row pt-5">
									<div className="col-12">
										<div
											className="grid-container"
											style={{ display: 'grid', gridTemplateColumns: 'auto auto' }}
										>
											<div>
												<img
													className="img-fluid"
													src={DownloadAPP}
													style={{ borderRadius: 10 }}
													alt="google+play"
												/>
											</div>
											<div style={{ marginLeft: -100 }}>
												<img
													className="img-fluid"
													src={DownloadGG}
													style={{ borderRadius: 10 }}
													alt="android+store"
												/>
											</div>
											<div className="mt-3">
												<img
													className="img-fluid"
													src={Download2}
													style={{ borderRadius: 10 }}
													alt="app+store"
												/>
											</div>
											<div className="mt-3" style={{ marginLeft: -100 }}>
												<img
													className="img-fluid"
													src={Download1}
													style={{ borderRadius: 10 }}
													alt="scan+qrcode"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-7 dowdload-box__box-2" style={{ position: 'relative' }}>
								<img
									src={Mobile}
									alt="exchange"
									style={{ position: 'absolute', zIndex: 100, top: -98, left: 0, width: '100%' }}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="homepage-download__position3">
					<img src={Bg_p3} alt="Bg_p3" />
				</div>
				<div className="homepage-download__position4">
					<img src={Bg_p4} alt="Bg_p4" />
				</div>
			</div>
		);
	};
	const renderSigUp = () => {
		return (
			<div className="homepage-sigup" style={{ backgroundImage: 'url(' + BG_SigUp + ')' }}>
				<div className="container">
					<div className="main-homepage-sigup">
						<div className="row">
							<div className="col-md-12">
								<h3 className="sigup-udonex"> {translate('page.homePage.feature.title')} </h3>
							</div>
						</div>
						<div className="row" style={{ marginTop: 90 }}>
							<div className="col-lg-2 col-md-4">
								<div>
									<div className="row mb-5" style={{ height: 63 }}>
										<div className="col-md-12">
											<img src={Feature4} alt="feature" />
										</div>
									</div>
									<p className="sigup-feature__title">{translate('page.homePage.feature.title.1')}</p>
								</div>
							</div>
							<div className="col-lg-2 col-md-4">
								<div>
									<div className="row mb-5" style={{ height: 63 }}>
										<div className="col-md-12">
											<img src={Feature1} alt="feature" />
										</div>
									</div>
									<p className="sigup-feature__title">{translate('page.homePage.feature.title.2')}</p>
								</div>
							</div>
							<div className="col-lg-2 col-md-4">
								<div>
									<div className="row mb-5" style={{ height: 63 }}>
										<div className="col-md-12">
											<img src={Feature2} alt="feature" />
										</div>
									</div>
									<p className="sigup-feature__title">{translate('page.homePage.feature.title.3')}</p>
								</div>
							</div>
							<div className="col-lg-2 col-md-4">
								<div>
									<div className="row mb-5" style={{ height: 63 }}>
										<div className="col-md-12">
											<img src={Feature3} alt="feature" />
										</div>
									</div>
									<p className="sigup-feature__title">{translate('page.homePage.feature.title.4')}</p>
								</div>
							</div>
							<div className="col-lg-2 col-md-4">
								<div>
									<div className="row mb-5" style={{ height: 63 }}>
										<div className="col-md-12">
											<img src={Feature6} alt="feature" />
										</div>
									</div>
									<p className="sigup-feature__title">{translate('page.homePage.feature.title.5')}</p>
								</div>
							</div>
							<div className="col-lg-2 col-md-4">
								<div>
									<div className="row mb-5" style={{ height: 63 }}>
										<div className="col-md-12">
											<img src={Feature5} alt="feature" />
										</div>
									</div>
									<p className="sigup-feature__title">{translate('page.homePage.feature.title.6')}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
	const renderCommuity = () => {
		return (
			<div className="homepage-commuity">
				<div className="container">
					<div className="main-homepage-community">
						<h3>{translate('page.homePage.commuity.title1')} </h3>
						<p> {translate('page.homePage.commuity.title2')}</p>
						<div>
							<div className="row">
								<div className="col-lg-2 col-md-4 text-center">
									<a href="#">
										<img src={FaceBook} alt="telegram" />
									</a>
								</div>
								<div className="col-lg-2 col-md-4 text-center">
									<a href="#">
										<img src={TelegramPNG} alt="ig" />
									</a>
								</div>
								<div className="col-lg-2 col-md-4 text-center">
									<a href="#">
										<img src={In} alt="in" />
									</a>
								</div>
								<div className="col-lg-2 col-md-4 text-center">
									<a href="#">
										<img src={WhatApp} alt="whatapp" />
									</a>
								</div>
								<div className="col-lg-2 col-md-4 text-center">
									<a href="#">
										<img src={YouT} alt="youtube" />
									</a>
								</div>
								<div className="col-lg-2 col-md-4 text-center">
									<a href="#">
										<img src={Telegram} alt="facebook" />
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
	const redirectSingUP = () => {
		history.push('/register');
	};
	const redirectTrading = () => {
		history.push('/trade');
	};
	const renderTrade = () => {
		return (
			<div className="homepage-trade">
				<div className="container">
					<div className="main-homepage-trade">
						<h3>{translate('page.homePage.trade.start')} </h3>
						<p>{translate('page.homePage.trade.title')}</p>
						<div className="main-homepage-trade__btn">
							{isLogin ? (
								<button className="main-homepage-trade__btn__button btn-none" onClick={redirectTrading}>
									{translate('page.homePage.trade.btn.trade')}
								</button>
							) : (
								<button className="main-homepage-trade__btn__button btn-active" onClick={redirectSingUP}>
									{translate('page.homePage.trade.btn.signup')}
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderInfo = () => {
		const InfoItem = ({ name, value, color = '' }) => {
			return (
				<div className="homepage-info">
					<div>
						<h2 className="homepage-info__number" style={{ border: `5px solid ${color}`, color: `${color}` }}>
							{value}
						</h2>
					</div>
					<div>
						<h4 className="homepage-info__text">{name}</h4>
					</div>
				</div>
			);
		};

		return (
			<div className="container mt-3">
				<div className="row px-3">
					<div className="col-4">
						<InfoItem name={'Currencies'} value={statistics.currencies} color="#99FFE7" />
					</div>
					<div className="col-4">
						<InfoItem name={'Markets'} value={statistics.markets} color="#B79DFF" />
					</div>
					<div className="col-4">
						<InfoItem name={'Active Users'} value={statistics.members} color="#FF89D7" />
					</div>
				</div>
			</div>
		);
	};

	return (
		<div id="main">
			{renderBanner()}
			{renderEvent()}
			{renderInfo()}
			{renderMarket()}
			{renderDownload()}
			{renderSigUp()}
			{renderCommuity()}
			{renderTrade()}
		</div>
	);
};
