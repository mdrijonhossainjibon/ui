import classnames from 'classnames';
import { HomeIcon, MarketIcon, SwapIcon, TradeIcon, WalletIcon } from 'mobile/assets/icons';
import { selectCurrentMarket } from 'modules';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const DEFAULT_CLASSNAME = 'bottom-nav__item';

const handleGetActiveItemClass = (currentRoute: string, targetRoute: string, absolute?: boolean) => {
	return classnames(DEFAULT_CLASSNAME, {
		[`${DEFAULT_CLASSNAME}--active`]: absolute
			? currentRoute === targetRoute
			: currentRoute
					.split('/')
					.map(a => `/${a}`)
					.includes(targetRoute),
	});
};

export const BottomNavbar: React.FC = () => {
	const { pathname } = useLocation();

	const market = useSelector(selectCurrentMarket);

	return (
		<nav className="bottom-nav">
			<ul>
				<Link to="/" className={handleGetActiveItemClass(pathname, '/', true)}>
					<HomeIcon
						className="bottom-nav__item__icon"
						active={handleGetActiveItemClass(pathname, '/', true) !== DEFAULT_CLASSNAME}
					/>
					<span className="bottom-nav__item__text">Home</span>
				</Link>
				<Link to="/markets" className={handleGetActiveItemClass(pathname, '/markets')}>
					<MarketIcon
						className="bottom-nav__item__icon"
						active={handleGetActiveItemClass(pathname, '/markets') !== DEFAULT_CLASSNAME}
					/>
					<span className="bottom-nav__item__text">Market</span>
				</Link>
				<Link
					to={market ? `/market/${market.id}` : '/market'}
					className={classnames('bottom-nav__item--middle', handleGetActiveItemClass(pathname, '/market'))}
				>
					<TradeIcon
						className="bottom-nav__item__icon bottom-nav__item--middle__icon"
						active={handleGetActiveItemClass(pathname, '/market') !== DEFAULT_CLASSNAME}
					/>
					<span className="bottom-nav__item__text">Trade</span>
				</Link>
				<Link to="/stake" className={handleGetActiveItemClass(pathname, '/stake')}>
					<SwapIcon
						className="bottom-nav__item__icon"
						active={handleGetActiveItemClass(pathname, '/stake') !== DEFAULT_CLASSNAME}
					/>
					<span className="bottom-nav__item__text">REFER</span>
				</Link>
				<Link to="/wallets" className={handleGetActiveItemClass(pathname, '/wallets')}>
					<WalletIcon
						className="bottom-nav__item__icon"
						active={handleGetActiveItemClass(pathname, '/wallets') !== DEFAULT_CLASSNAME}
					/>
					<span className="bottom-nav__item__text">Wallet</span>
				</Link>
			</ul>
		</nav>
	);
};
