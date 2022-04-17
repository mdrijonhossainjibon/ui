import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import Slider, { Settings } from 'react-slick';
import { useDepthFetch, useEventsFetch, useMarketsFetch, useMarketsTickersFetch, useRangerConnectFetch } from '../../../hooks';
import { BottelIcon, CompetitionIcon, GiftIcon, PromotionICon, TransactionIcon, VoteIcon } from './../../assets/icons';
import { NewAllMarketList } from './../../components';
import { Announcment } from './Announcment';
import { BoxImg } from './BoxImg';
import { MarketsTop } from './MarketTop';

const NewHomePage = () => {
	useMarketsFetch();
	useMarketsTickersFetch();
	useRangerConnectFetch();
	useDepthFetch();
	useEventsFetch();
	const intl = useIntl();

	const renderDirectionals = () => {
		const settings: Settings = {
			dots: true,
			infinite: false,
			arrows: false,
			autoplay: false,
			speed: 500,
			slidesToShow: 4,
			slidesToScroll: 1,
		};

		return (
			<React.Fragment>
				<Slider className="td-mobile-screen-home__direction__list-item" {...settings}>
					<div>
						<Link to="/transactions" className="td-mobile-screen-home__direction__list-item__item">
							<TransactionIcon />
							<span>{intl.formatMessage({ id: 'page.mobile.home.direction.transactions' })}</span>
						</Link>
					</div>

					<div>
						<Link to="/ieo" className="td-mobile-screen-home__direction__list-item__item">
							<BottelIcon />
							<span>{intl.formatMessage({ id: 'page.mobile.home.direction.ieo' })}</span>
						</Link>
					</div>

					<div>
						<Link to="/airdrops" className="td-mobile-screen-home__direction__list-item__item">
							<GiftIcon />
							<span>{intl.formatMessage({ id: 'page.mobile.home.direction.airdrops' })}</span>
						</Link>
					</div>

					<div>
						<Link to="/competition" className="td-mobile-screen-home__direction__list-item__item">
							<CompetitionIcon />

							<span>{intl.formatMessage({ id: 'page.mobile.home.direction.competition' })}</span>
						</Link>
					</div>

					<div>
						<Link to="/vote" className="td-mobile-screen-home__direction__list-item__item">
							<VoteIcon />
							<span>{intl.formatMessage({ id: 'page.mobile.home.direction.vote' })}</span>
						</Link>
					</div>

					<div>
						<Link to="/promotion" className="td-mobile-screen-home__direction__list-item__item">
							<PromotionICon />
							<span>{intl.formatMessage({ id: 'page.mobile.home.direction.promotion' })}</span>
						</Link>
					</div>
				</Slider>
			</React.Fragment>
		);
	};

	return (
		<div className="td-mobile-screen-home">
			<div className="td-mobile-screen-home__box-img">
				<BoxImg />
			</div>
			<Announcment />

			<MarketsTop />

			<div className="td-mobile-screen-home__direction">{renderDirectionals()}</div>

			<div className="td-mobile-screen-home__market-main">
				<NewAllMarketList hideFavorite={true} />
			</div>
		</div>
	);
};

export const HomePageScreenMobile = React.memo(NewHomePage);
