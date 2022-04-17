import { minutesUntilAutoLogout, sessionCheckInterval /* showLanding */ } from 'api';
import UdonIconGif from 'assets/icon-udonex.gif';
import { NewModal } from 'components';
import { WalletsFetch } from 'containers';
import { MarketsList } from 'containers/MarketsList';
import { toggleColorTheme } from 'helpers';
import {
	AirdropCoinListMobileScreen,
	IEOListMobileScreen,
	IEODetailMobileScreen,
	StakingDetailMobileScreen,
	StakingListMobileScreen,
	MobileCompetitionListingScreen,
	MobileCompetitionDetailScreen,
} from 'mobile/plugins';
import {
	configsFetch,
	CustomizationDataInterface,
	customizationFetch,
	logoutFetch,
	Market,
	RootState,
	selectConfigsLoading,
	selectConfigsSuccess,
	selectCurrentColorTheme,
	selectCurrentMarket,
	selectCustomizationData,
	selectMobileDeviceState,
	selectPlatformAccessStatus,
	selectUserFetching,
	selectUserInfo,
	selectUserLoggedIn,
	toggleChartRebuild,
	User,
	userFetch,
	walletsReset,
} from 'modules';
import { AirdropCoinListScreen } from 'plugins/AirdropCoin';
import { TransactionListScreen } from 'plugins/Transactions';
import { VoteScreen } from 'plugins/Vote';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Route, RouterProps, Switch } from 'react-router';
import { Redirect, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../index';
/* import { isMobile } from "react-device-detect"; */
import {
	ChangeForgottenPasswordMobileScreen,
	ConfirmMobileScreen,
	DepositMobileScreen,
	EmailVerificationMobileScreen,
	HomePageScreenMobile,
	NewForgotPasswordScreen,
	NewMarketsScreenMobile,
	NewSignInMobileScreen,
	NewSignUpMobileScreen,
	NewTradingScreenMobile,
	NewWalletDetail,
	NewWalletHistoryMobileScreen,
	NewWalletsMobileScreen,
	OrdersMobileScreen,
	ProfileAccountActivityMobileScreen,
	ProfileApiKeysMobileScreen,
	ProfileAuthMobileScreen,
	ProfileChangePasswordMobileScreen,
	ProfileLanguageMobileScreen,
	ProfileMobileScreen,
	ProfileThemeMobileScreen,
	ProfileVerificationMobileScreen,
	ReferralMobileScreen,
	WithdrawMobileScreen,
} from '../../mobile/screens';
import { IEODetailScreen } from '../../plugins/IEO/screen/IEODetailScreen';
import { IEOListingScreen } from '../../plugins/IEO/screen/IEOListingScreen';
import { PromotionScreen, PromotionDetailScreen } from '../../plugins/Promotion';
import { StakingDetailScreen, StakingListScreen } from '../../plugins/Stake';
import { CompetitionListingScreen, CompetitionDetailScreen } from '../../plugins/Competition';
import {
	AssetsFeeScreen,
	ChangeForgottenPasswordScreen,
	ConfirmScreen,
	DepositScreen,
	EmailVerificationScreen,
	ForgotPasswordScreen,
	HistoryScreen,
	LogInScreen,
	MagicLink,
	MaintenanceScreen,
	NewUdonHomePage,
	OrdersTabScreen,
	ProfileScreen,
	ProfileTwoFactorAuthScreen,
	Referral,
	RegisterScreen,
	RestrictedScreen,
	TradingScreen,
	VerificationScreen,
	WalletListScreen,
	WithdrawScreen,
	UdonLanding,
} from '../../screens';
import { MobileTransactionsScreen } from 'mobile/plugins/Transactions';

import { VerifyAccount } from 'plugins/KYC';
import { MobilePersonalVerify, MobileVerifyAccount } from 'mobile/plugins/KYC/screens';

interface ReduxProps {
	colorTheme: string;
	currentMarket?: Market;
	customization?: CustomizationDataInterface;
	user: User;
	isLoggedIn: boolean;
	isMobileDevice: boolean;
	userLoading?: boolean;
	platformAccessStatus: string;
	configsLoading: boolean;
	configsSuccess: boolean;
}

interface DispatchProps {
	fetchConfigs: typeof configsFetch;
	fetchCustomization: typeof customizationFetch;
	logout: typeof logoutFetch;
	userFetch: typeof userFetch;
	walletsReset: typeof walletsReset;
}

interface LocationProps extends RouterProps {
	location: {
		pathname: string;
	};
}

interface LayoutState {
	isShownExpSessionModal: boolean;
}

interface OwnProps {
	toggleChartRebuild: typeof toggleChartRebuild;
}

export type LayoutProps = ReduxProps & DispatchProps & LocationProps & IntlProps & OwnProps;

const renderLoader = () => (
	<div className="pg-loader-container">
		<img src={UdonIconGif} alt="loading" />
	</div>
);

const STORE_KEY = 'lastAction';

//tslint:disable-next-line no-any
const PrivateRoute: React.FunctionComponent<any> = ({ component: CustomComponent, loading, isLogged, ...rest }) => {
	if (loading) {
		return renderLoader();
	}
	const renderCustomerComponent = props => <CustomComponent {...props} />;

	if (isLogged) {
		return <Route {...rest} render={renderCustomerComponent} />;
	}

	return (
		<Route {...rest}>
			<Redirect to={'/login'} />
		</Route>
	);
};

//tslint:disable-next-line no-any
const PublicRoute: React.FunctionComponent<any> = ({ component: CustomComponent, loading, isLogged, ...rest }) => {
	if (loading) {
		return renderLoader();
	}

	if (isLogged) {
		return (
			<Route {...rest}>
				<Redirect to={'/wallets'} />
			</Route>
		);
	}

	const renderCustomerComponent = props => <CustomComponent {...props} />;

	return <Route {...rest} render={renderCustomerComponent} />;
};

class LayoutComponent extends React.Component<LayoutProps, LayoutState> {
	public static eventsListen = ['click', 'keydown', 'scroll', 'resize', 'mousemove', 'TabSelect', 'TabHide'];

	public timer;
	public walletsFetchInterval;

	constructor(props: LayoutProps) {
		super(props);
		this.initListener();

		this.state = {
			isShownExpSessionModal: false,
		};
	}

	public componentDidMount() {
		this.props.fetchConfigs();
		this.props.userFetch();
		this.initInterval();
		this.check();
	}

	public componentDidUpdate(prevProps: LayoutProps) {
		const { isMobileDevice, customization, isLoggedIn, history, userLoading } = this.props;

		//scroll top mobile
		if (
			isMobileDevice &&
			(this.props.location.pathname === '/' || !prevProps.location.pathname.includes(this.props.location.pathname))
		) {
			window.scrollTo(0, 0);
		}

		if (!isLoggedIn && prevProps.isLoggedIn && !userLoading) {
			this.props.walletsReset();
			if (!history.location.pathname.includes('/market')) {
				history.push('/market/');
			}
		}

		if (customization && customization !== prevProps.customization) {
			this.handleApplyCustomization(customization);
		}
	}

	public componentWillUnmount() {
		for (const type of LayoutComponent.eventsListen) {
			document.body.removeEventListener(type, this.reset);
		}
		clearInterval(this.timer);
		clearInterval(this.walletsFetchInterval);
	}

	public translate = (key: string) => this.props.intl.formatMessage({ id: key });

	public render() {
		const {
			colorTheme,
			isLoggedIn,
			isMobileDevice,
			userLoading,
			location,
			configsLoading,
			platformAccessStatus,
		} = this.props;
		const tradingCls = location.pathname.includes('/market') ? 'trading-layout' : '';
		toggleColorTheme(colorTheme);

		if (configsLoading && !platformAccessStatus.length) {
			return renderLoader();
		}

		if (isMobileDevice /* && isMobile */) {
			return (
				<div className={'container-fluid pg-layout pg-layout--mobile'}>
					<Switch>
						<PublicRoute path="/" exact component={HomePageScreenMobile} />
						<PublicRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							path="/login"
							component={NewSignInMobileScreen}
						/>
						<PublicRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							path="/register"
							component={NewSignUpMobileScreen}
						/>

						<PublicRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							path="/forgot_password"
							component={NewForgotPasswordScreen}
						/>
						<PublicRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							exact
							path="/accounts/password_reset"
							component={ChangeForgottenPasswordMobileScreen}
						/>
						<PublicRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							exact
							path="/accounts/confirmation"
							component={VerificationScreen}
						/>
						<PublicRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							path="/email-verification"
							component={EmailVerificationMobileScreen}
						/>
						<PublicRoute exact path="/profile/referral" component={ReferralMobileScreen} />
						<PublicRoute path="/market/:market?" exact component={NewTradingScreenMobile} />
						<PublicRoute path="/markets" component={NewMarketsScreenMobile} />
						<PublicRoute path="/competition" exact component={MobileCompetitionListingScreen} />
						<PublicRoute path="/competition/:competition_id" component={MobileCompetitionDetailScreen} />
						<PublicRoute path="/ieo" exact component={IEOListMobileScreen} />
						<PublicRoute path="/ieo/detail/:ieo_id" exact component={IEODetailMobileScreen} />
						<PublicRoute path="/stake" exact component={StakingListMobileScreen} />
						<PublicRoute path="/stake/detail/:stake_id" component={StakingDetailMobileScreen} />
						<PublicRoute path="/vote" component={VoteScreen} />
						{/* new feature */}
						<PublicRoute path="/airdrops" component={AirdropCoinListMobileScreen} />
						<PublicRoute path="/promotion" exact component={PromotionScreen} />
						<PublicRoute path="/promotion/detail/:promotion_id" exact component={PromotionDetailScreen} />
						<PublicRoute path="/transactions" exact component={MobileTransactionsScreen} />
						{/* new feature */}

						<PrivateRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							path="/confirm"
							component={ConfirmMobileScreen}
						/>
						<PrivateRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							exact
							path="/wallets"
							component={NewWalletsMobileScreen}
						/>
						<PrivateRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							path="/wallets/history"
							component={NewWalletHistoryMobileScreen}
						/>
						<PrivateRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							path="/wallets/:currency/detail"
							component={NewWalletDetail}
						/>
						<PrivateRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							path="/wallets/:currency/withdraw"
							component={WithdrawMobileScreen}
						/>
						<PrivateRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							path="/wallets/:currency/deposit"
							component={DepositMobileScreen}
						/>

						<PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/orders" component={OrdersMobileScreen} />
						<PrivateRoute
							exact
							loading={userLoading}
							isLogged={isLoggedIn}
							path="/profile"
							component={ProfileMobileScreen}
						/>
						<PrivateRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							path="/profile/account-activity"
							component={ProfileAccountActivityMobileScreen}
						/>
						<PrivateRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							path="/profile/api-keys"
							component={ProfileApiKeysMobileScreen}
						/>
						<PrivateRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							path="/profile/language"
							component={ProfileLanguageMobileScreen}
						/>
						<PrivateRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							path="/profile/2fa"
							component={ProfileAuthMobileScreen}
						/>
						<PrivateRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							path="/profile/change-password"
							component={ProfileChangePasswordMobileScreen}
						/>
						<PrivateRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							path="/profile/verification"
							component={ProfileVerificationMobileScreen}
						/>
						<PrivateRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							path="/profile/kyc/verify"
							component={MobilePersonalVerify}
						/>
						<PrivateRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							path="/profile/kyc"
							component={MobileVerifyAccount}
						/>
						<PrivateRoute
							loading={userLoading}
							isLogged={isLoggedIn}
							path="/profile/theme"
							component={ProfileThemeMobileScreen}
						/>
						<Route path="**">
							<Redirect to="/market" />
						</Route>
					</Switch>
					{isLoggedIn && <WalletsFetch />}
					{this.handleRenderExpiredSessionModal()}
				</div>
			);
		}

		return (
			<div className={`container-fluid pg-layout ${tradingCls}`}>
				<Switch>
					<PublicRoute exact={true} path="/" component={NewUdonHomePage} />
					<PublicRoute exact={true} path="/magic-link" component={MagicLink} />
					<PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/login" component={LogInScreen} />
					<PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/register" component={RegisterScreen} />
					<PublicRoute
						loading={userLoading}
						isLogged={isLoggedIn}
						path="/accounts/confirmation"
						component={VerificationScreen}
					/>
					<PublicRoute
						loading={userLoading}
						isLogged={isLoggedIn}
						path="/accounts/password_reset"
						component={ChangeForgottenPasswordScreen}
					/>
					<PublicRoute
						loading={userLoading}
						isLogged={isLoggedIn}
						path="/forgot_password"
						component={ForgotPasswordScreen}
					/>
					<PublicRoute
						loading={userLoading}
						isLogged={isLoggedIn}
						path="/email-verification"
						component={EmailVerificationScreen}
					/>
					<PublicRoute path="/404" component={RestrictedScreen} />
					<PublicRoute path="/500" component={MaintenanceScreen} />
					<PublicRoute exact={false} path="/market/:market?" component={TradingScreen} />
					<PublicRoute exact path="/markets" component={MarketsList} />
					<PublicRoute exact={false} path="/fee" component={AssetsFeeScreen} />
					<PublicRoute path="/Udonex2cloud" exact component={UdonLanding} />
					<PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile/kyc" component={VerifyAccount} />
					<PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/referral" component={Referral} />
					<PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/orders" component={OrdersTabScreen} />
					<PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/history" component={HistoryScreen} />
					<PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/confirm" component={ConfirmScreen} />
					<PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile" component={ProfileScreen} />
					{/* <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets" component={WalletsScreen} /> */}
					<PrivateRoute
						loading={userLoading}
						isLogged={isLoggedIn}
						path="/wallets"
						exact
						component={WalletListScreen}
					/>
					<PrivateRoute
						loading={userLoading}
						isLogged={isLoggedIn}
						path="/wallets/deposit/:currency_id"
						exact
						component={DepositScreen}
					/>
					<PrivateRoute
						loading={userLoading}
						isLogged={isLoggedIn}
						path="/wallets/withdraw/:currency_id"
						exact
						component={WithdrawScreen}
					/>
					<PrivateRoute
						loading={userLoading}
						isLogged={isLoggedIn}
						path="/security/2fa"
						component={ProfileTwoFactorAuthScreen}
					/>
					{/* new feature */}
					<PublicRoute path="/transactions" exact component={TransactionListScreen} />
					<PublicRoute path="/airdrops" exact component={AirdropCoinListScreen} />
					{/* new feature */}
					{/* old feature */}

					{/* old feature */}
					<PublicRoute path="/ieo" exact component={IEOListingScreen} />
					<PublicRoute path="/ieo/detail/:ieoID" exact component={IEODetailScreen} />
					<PublicRoute path="/promotion" exact component={PromotionScreen} />
					<PublicRoute path="/promotion/detail/:promotion_id" exact component={PromotionDetailScreen} />
					<PublicRoute path="/vote" exact component={VoteScreen} />
					<PublicRoute path="/competition" exact component={CompetitionListingScreen} />
					<PublicRoute path="/competition/:competition_id" exact component={CompetitionDetailScreen} />
					<PublicRoute path="/stake" exact component={StakingListScreen} />
					<PublicRoute path="/stake/detail/:stake_id" exact component={StakingDetailScreen} />
					<PublicRoute path="**">
						<Redirect to="/market" />
					</PublicRoute>
				</Switch>
				{isLoggedIn && <WalletsFetch />}
				{this.handleRenderExpiredSessionModal()}
			</div>
		);
	}

	private getLastAction = () => {
		if (localStorage.getItem(STORE_KEY) !== null) {
			return parseInt(localStorage.getItem(STORE_KEY) || '0', 10);
		}

		return 0;
	};

	private setLastAction = (lastAction: number) => {
		localStorage.setItem(STORE_KEY, lastAction.toString());
	};

	private initListener = () => {
		this.reset();
		for (const type of LayoutComponent.eventsListen) {
			document.body.addEventListener(type, this.reset);
		}
	};

	private reset = () => {
		this.setLastAction(Date.now());
	};

	private initInterval = () => {
		this.timer = setInterval(() => {
			this.check();
		}, parseFloat(sessionCheckInterval()));
	};

	private check = () => {
		const { user } = this.props;
		const now = Date.now();
		const timeleft = this.getLastAction() + parseFloat(minutesUntilAutoLogout()) * 60 * 1000;
		const diff = timeleft - now;
		const isTimeout = diff < 0;
		if (isTimeout && user.email) {
			if (user.state === 'active') {
				this.handleChangeExpSessionModalState();
			}

			this.props.logout();
		}
	};

	private handleSubmitExpSessionModal = () => {
		const { history } = this.props;
		this.handleChangeExpSessionModalState();
		history.push('/login');
	};

	private handleRenderExpiredSessionModal = () => {
		const { isShownExpSessionModal } = this.state;

		return (
			<NewModal
				show={isShownExpSessionModal}
				onHide={this.handleChangeExpSessionModalState}
				titleModal={this.translate('page.modal.expired.title')}
				bodyModal={
					<Button
						style={{ backgroundColor: 'var(--yellow)' }}
						block={true}
						type="button"
						onClick={this.handleSubmitExpSessionModal}
						size="lg"
						variant="primary"
					>
						{this.translate('page.modal.expired.submit')}
					</Button>
				}
			/>
		);
	};

	private handleChangeExpSessionModalState = () => {
		this.setState({
			isShownExpSessionModal: !this.state.isShownExpSessionModal,
		});
	};

	private handleApplyCustomization = (customization: CustomizationDataInterface) => {
		const rootElement = document.documentElement;
		const parsedSettings = customization && customization.settings ? JSON.parse(customization.settings) : null;

		if (rootElement && parsedSettings && parsedSettings.theme_colors) {
			parsedSettings.theme_colors.reduce((result, item) => {
				const newItemColor = item.value;

				if (newItemColor) {
					rootElement.style.setProperty(item.key, item.value);
				}

				return result;
			}, {});

			this.props.toggleChartRebuild();
		}
	};
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
	configsLoading: selectConfigsLoading(state),
	configsSuccess: selectConfigsSuccess(state),
	colorTheme: selectCurrentColorTheme(state),
	currentMarket: selectCurrentMarket(state),
	customization: selectCustomizationData(state),
	user: selectUserInfo(state),
	isLoggedIn: selectUserLoggedIn(state),
	isMobileDevice: selectMobileDeviceState(state),
	userLoading: selectUserFetching(state),
	platformAccessStatus: selectPlatformAccessStatus(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
	fetchConfigs: () => dispatch(configsFetch()),
	fetchCustomization: () => dispatch(customizationFetch()),
	logout: () => dispatch(logoutFetch()),
	toggleChartRebuild: () => dispatch(toggleChartRebuild()),
	userFetch: () => dispatch(userFetch()),
	walletsReset: () => dispatch(walletsReset()),
});

export const Layout = compose(injectIntl, withRouter, connect(mapStateToProps, mapDispatchToProps))(LayoutComponent) as any;
