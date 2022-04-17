import classNames from 'classnames';
import * as React from 'react';
import { FaAward, FaGift, FaHistory, FaSignOutAlt, FaStar, FaUserCircle, FaUserPlus } from 'react-icons/fa';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { logoutFetch, selectUserLoggedIn } from '../../modules';

const Logo = require('../../assets/images/UdonLogo.svg');

export const Header: React.FC = () => {
	const history = useHistory();
	const intl = useIntl();
	const isLoggedIn = useSelector(selectUserLoggedIn);
	const [activeNow, setActiveNow] = React.useState('');
	const [activeItemDrop, setActiveItemDrop] = React.useState('');

	const dispatch = useDispatch();
	const locationHeader = window.location.href.split('/').pop();

	React.useEffect(() => {
		setStateActiveNow(String(locationHeader));
		setActiveNow(String(locationHeader));
		setActiveItemDrop('');
	}, []);

	const setStateActiveNow = (nameActive: string) => {
		setActiveNow(nameActive);
		setActiveItemDrop('');
	};

	const classActiveItemDrop = (nameItem: string) =>
		classNames('header__right-menu__dropdown__wrap__content__title d-flex align-items-center', {
			'header__right-menu__dropdown__wrap__content__title--active': activeItemDrop === nameItem,
		});

	const classActiveLeftItemDrop = (nameItem: string) => {
		return classNames('header__left-menu__dropdown__wrap__content__title d-flex align-items-center', {
			'header__left-menu__dropdown__wrap__content__title--active': activeItemDrop === nameItem,
		});
	};

	const classLinkActive = (nameActive: string) => {
		return classNames('header__left-menu__dropdown__wrap', {
			'header__left-menu__dropdown__wrap--active': activeNow === nameActive,
		});
	};
	const classLinkRightActive = (nameActive: string) => {
		return classNames('header__right-menu__dropdown__wrap', {
			'header__right-menu__dropdown__wrap--active': activeNow === nameActive,
		});
	};

	const classLinkActiveTitleDrop = (nameActive: string) => {
		return classNames('header__right-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center', {
			'header__right-menu__dropdown__wrap__dropbtn--active': activeNow === nameActive,
		});
	};

	const renderWalletLink = () => {
		const classItemTitle = classNames('header__right-menu__item__title', {
			'header__right-menu__item__title--active': activeNow === 'Wallet',
		});

		return (
			isLoggedIn && (
				<div className="header__right-menu__item ">
					<div className={classItemTitle} onClick={() => setStateActiveNow('Wallet')}>
						<Link to="/wallets">Wallet</Link>
					</div>
				</div>
			)
		);
	};

	const renderOrderTab = () => {
		return (
			isLoggedIn && (
				<div className="header__left-menu__dropdown flex-shrink-0  ">
					<div className={classLinkRightActive('orders')} onClick={() => setStateActiveNow('orders')}>
						<span className={classLinkActiveTitleDrop('orders')}>
							{translate('page.body.landing.header.orders')}
							<div className="header__right-menu__dropdown__wrap__dropbtn__icon-drop-down"> </div>
						</span>
						<div className="header__right-menu__dropdown__wrap__content">
							<Link
								to="/orders"
								onClick={() => {
									setStateActiveNow('orders');
									setActiveItemDrop('orders');
								}}
							>
								<div className={classActiveItemDrop('orders')}>
									<FaStar className="mr-2" />
									{translate('page.body.landing.header.openOrder')}
								</div>
							</Link>
							<Link
								to="/history"
								onClick={() => {
									setStateActiveNow('orders');
									setActiveItemDrop('history');
								}}
							>
								<div className={classActiveItemDrop('history')}>
									<FaHistory className="header__right-menu__dropdown__wrap__content__title__icon mr-2" />
									{translate('page.body.landing.header.history')}
								</div>
							</Link>
						</div>
					</div>
				</div>
			)
		);
	};

	const renderLogout = () => {
		if (!isLoggedIn) {
			return null;
		}

		return (
			<Link
				to=" "
				onClick={() => {
					dispatch(logoutFetch());
					setStateActiveNow('');
					setActiveItemDrop('');
				}}
			>
				<div className="header__right-menu__dropdown__wrap__content__title d-flex align-items-center">
					<FaSignOutAlt className="header__right-menu__dropdown__wrap__content__title__icon mr-2" />
					<FormattedMessage id={'page.body.profile.content.action.logout'} />
				</div>
			</Link>
		);
	};

	const renderProfileLink = () => {
		return (
			isLoggedIn && (
				<Link
					to="/profile"
					onClick={() => {
						setStateActiveNow('account');
						setActiveItemDrop('profile');
					}}
				>
					<div className={classActiveItemDrop('profile')}>
						<FaUserCircle className="header__right-menu__dropdown__wrap__content__title__icon mr-2" />
						<FormattedMessage id={'page.header.navbar.profile'} />
					</div>
				</Link>
			)
		);
	};

	const renderReferralLink = () => {
		return (
			isLoggedIn && (
				<Link
					to="/referral"
					onClick={() => {
						setStateActiveNow('account');
						setActiveItemDrop('referral');
					}}
				>
					<div className={classActiveItemDrop('referral')}>
						<FaUserPlus className="header__right-menu__dropdown__wrap__content__title__icon mr-2" />
						<FormattedMessage id={'page.header.navbar.referral'} />
					</div>
				</Link>
			)
		);
	};

	const renderProfileTab = () => {
		return (
			isLoggedIn && (
				<>
					<div className="header__left-menu__dropdown flex-shrink-0  ">
						<div className={classLinkRightActive('account')} onClick={() => setStateActiveNow('account')}>
							<span className={classLinkActiveTitleDrop('account')}>
								{translate('page.body.landing.header.account')}
								<div className="header__right-menu__dropdown__wrap__dropbtn__icon-drop-down"> </div>
							</span>
							<div className="header__right-menu__dropdown__wrap__content header__right-menu__dropdown__wrap__content--account">
								{renderProfileLink()}
								{renderReferralLink()}
								{renderLogout()}
							</div>
						</div>
					</div>
				</>
			)
		);
	};

	const redirectSingIn = () => {
		history.push('/login');
	};

	const redirectSingUp = () => {
		history.push('/register');
	};

	const translate = (key: string) => intl.formatMessage({ id: key });

	const renderUnLogin = () => {
		const classLinkActiveLogin = classNames('header__right-menu__item__title', {
			'header__right-menu__item__title--active': activeNow === 'login',
		});

		const classLinkActiveRegister = classNames('header__right-menu__item__title header__right-menu__item__title--btn ', {
			'header__right-menu__item__title--btn--active': activeNow === 'register',
		});

		return (
			!isLoggedIn && (
				<>
					<div
						className="header__right-menu__item flex-shrink-0 custom-poiter"
						onClick={e => {
							redirectSingIn();
							setStateActiveNow('login');
						}}
					>
						<div className={classLinkActiveLogin}>
							<span>{translate('page.body.landing.header.button2')}</span>
						</div>
					</div>
					<div
						className="header__right-menu__item flex-shrink-0 custom-poiter"
						onClick={e => {
							redirectSingUp();
							setStateActiveNow('register');
						}}
					>
						<span className={classLinkActiveRegister}>{translate('page.body.landing.header.button3')}</span>
					</div>
				</>
			)
		);
	};

	return (
		<div className="headerDesktop-screen">
			<div className="container-header">
				<nav className="header d-flex flex-row justify-content-between align-items-center">
					<div className="header__left-menu d-flex flex-row align-items-center">
						<div className="header__left-menu__logo" onClick={() => setStateActiveNow('')}>
							<Link to="/">
								<img src={Logo} alt="" />
							</Link>
						</div>

						<div className="header__left-menu__dropdown flex-shrink-0">
							<div className={classLinkActive('markets')} onClick={() => setStateActiveNow('markets')}>
								<Link
									to="/markets"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									Markets
								</Link>
							</div>
						</div>
						<div className="header__left-menu__dropdown flex-shrink-0 ">
							<div className={classLinkActive('ieo')} onClick={() => setStateActiveNow('ieo')}>
								<Link
									to="/ieo"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									Launchpad
								</Link>
							</div>
						</div>
						<div className="header__left-menu__dropdown flex-shrink-0 d-none d-lg-block d-xl-block ">
							<div className={classLinkActive('stake')} onClick={() => setStateActiveNow('stake')}>
								<Link
									to="/stake"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									Smart Stake
								</Link>
							</div>
						</div>
						<div className="header__left-menu__dropdown flex-shrink-0  ">
							<div className={classLinkActive('vote')} onClick={() => setStateActiveNow('vote')}>
								<Link
									to="/vote"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									Vote Listing
								</Link>
							</div>
						</div>
						<div className="header__left-menu__dropdown flex-shrink-0  ">
							<div className={classLinkActive('EarnCoinFree')} onClick={() => setStateActiveNow('EarnCoinFree')}>
								<span className={classLinkActiveTitleDrop('EarnCoinFree')}>
									Earn Coin Free
									<div className="header__left-menu__dropdown__wrap__dropbtn__icon-drop-down"> </div>
								</span>
								<div className="header__left-menu__dropdown__wrap__content">
									<Link
										to="/airdrops"
										className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
										onClick={() => {
											setStateActiveNow('EarnCoinFree');
											setActiveItemDrop('airdrops');
										}}
									>
										<div className={classActiveLeftItemDrop('airdrops')}>
											<FaGift className="header__left-menu__dropdown__wrap__content__title__icon mr-2" />
											Airdrop
										</div>
									</Link>
									<Link
										to="/competition"
										className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
										onClick={() => {
											setStateActiveNow('EarnCoinFree');
											setActiveItemDrop('trading-competition');
										}}
									>
										<div className={classActiveLeftItemDrop('trading-competition')}>
											<FaAward className="header__left-menu__dropdown__wrap__content__title__icon mr-2" />
											Competition
										</div>
									</Link>
								</div>
							</div>
						</div>
					</div>

					<div className="header__right-menu d-flex align-items-center flex-row">
						{renderUnLogin()}
						{renderWalletLink()}
						{renderOrderTab()}
						{renderProfileTab()}
					</div>
				</nav>
			</div>
		</div>
	);
};
