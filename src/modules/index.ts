import { combineReducers } from 'redux';
import { all, call } from 'redux-saga/effects';
import { pluginsReducer, publicReducer, userReducer } from './app';
import { ETHFeeState, rootETHFeeSaga } from './plugins/ethWithdraw/fee';
import { EventsState, rootEventSaga } from './plugins/info/events';
import { AirdropCoinClaimState, AirdropCoinState, rootAirdropCoinSaga } from './plugins/airdropCoin';
import {
	BuyIEOLoadingState,
	rootBuyIEOSaga,
	TotalIEOBuyersState,
	IEOItemState,
	rootIEOItemSaga,
	IEOListState,
	rootIEOListSaga,
	rootPriceSaga,
	PriceState,
} from './plugins/ieo';
import { IEOCautionState, rootIEOCautionSaga } from './plugins/ieo/caution';
import { DetailIEOState, rootIEODetailSaga } from './plugins/ieo/detail';
import { BuyersHistoryState, BuyHistoryListState, rootHistoryBuySaga } from './plugins/ieo/history';
import {
	CreateStakeState,
	rootStakingSaga,
	StakeHistoryState,
	StakeWalletState,
	StakingListState,
	UnStakeHistoryState,
	UnstakeState,
} from './plugins/staking';
import { rootVoteSaga, VoteDonateState, VoteHistoryState, VoteListState } from './plugins/vote';
import { AlertState, rootHandleAlertSaga } from './public/alert';
import { BlocklistAccessState, rootBlocklistAccessSaga } from './public/blocklistAccess';
import { ConfigsState, rootConfigsSaga } from './public/configs';
import { CurrenciesState, rootCurrenciesSaga } from './public/currencies';
import { CustomizationState, rootCustomizationSaga } from './public/customization';
import { ColorThemeState } from './public/globalSettings';
import { GridLayoutState } from './public/gridLayout';
import { LanguageState } from './public/i18n';
import { KlineState, rootKlineFetchSaga } from './public/kline';
import { MarketsState, rootMarketsSaga } from './public/markets';
import { MemberLevelsState, rootMemberLevelsSaga } from './public/memberLevels';
import { DepthIncrementState, DepthState, OrderBookState, rootOrderBookSaga } from './public/orderBook';
import { RangerState } from './public/ranger/reducer';
import { RecentTradesState, rootRecentTradesSaga } from './public/recentTrades';
import { ApiKeysState } from './user/apiKeys';
import { rootApiKeysSaga } from './user/apiKeys/sagas';
import { AuthState, rootAuthSaga } from './user/auth';
import { BeneficiariesState, rootBeneficiariesSaga } from './user/beneficiaries';
import { GeetestCaptchaState, rootGeetestCaptchaSaga } from './user/captcha';
import { CustomizationUpdateState, rootCustomizationUpdateSaga } from './user/customization';
import { EmailVerificationState, rootEmailVerificationSaga } from './user/emailVerification';
import { DepositHistoryState, HistoryState, rootHistorySaga, WithdrawHistoryState } from './user/history';
import { AddressesState, rootSendAddressesSaga } from './user/kyc/addresses';
import { DocumentsState, rootSendDocumentsSaga } from './user/kyc/documents';
import { IdentityState, rootSendIdentitySaga } from './user/kyc/identity';
import { LabelState, rootLabelSaga } from './user/kyc/label';
import { PhoneState, rootSendCodeSaga } from './user/kyc/phone';
import { NewHistoryState, rootNewHistorySaga } from './user/newHistory';
import { OpenOrdersState, rootOpenOrdersSaga } from './user/openOrders';
import { OrdersState, rootOrdersSaga } from './user/orders';
import { OrdersHistoryState, rootOrdersHistorySaga } from './user/ordersHistory';
import { PasswordState, rootPasswordSaga } from './user/password';
import { ProfileState, rootProfileSaga } from './user/profile';
import { rootUserActivitySaga, UserActivityState } from './user/userActivity';
import { ChildCurrenciesState, rootWalletsSaga, WalletsState, WalletsWithdrawLimitState } from './user/wallets';
import { rootWithdrawLimitSaga, WithdrawLimitState } from './user/withdrawLimit';
import {
	CommisionHistoryState,
	CommisionInfoState,
	EstimatedCommisionState,
	FriendsListState,
	ReferralRankState,
	rootReferralSaga,
} from './plugins/referral';
import {
	CompetitionAwardState,
	CompetitionVolumeState,
	ListCompetitionState,
	NewCompetitionState,
	RankingCompetitionState,
	rootCompetitionAwardSaga,
	rootCompetitionItemSaga,
	rootCompetitionVolumeSaga,
	rootCompetitionRankingSaga,
	rootCompetitionListSaga,
} from './plugins/competition/';
import { rootTransactionSaga, TransactionPriceListState, TransactionsListState } from './plugins/transactions';
import { rootStatisticSaga, StatisticState } from './plugins/info/statistic';
import { VerifyAccountState, rootKycSaga, KycStatusState } from './plugins/kyc';
import { NewWithdrawLimitCheckingState, NewWithdrawLimitRemainsState, rootNewWithdrawLimitSaga } from './user/newWithdrawLimit';

export * from './plugins/ethWithdraw/fee';
export * from './plugins/info/events';
export * from './plugins/airdropCoin';
export * from './plugins/ieo';
export * from './plugins/staking';
export * from './plugins/vote';
export * from './public/alert';
export * from './public/blocklistAccess';
export * from './public/configs';
export * from './public/currencies';
export * from './public/customization';
export * from './public/globalSettings';
export * from './public/i18n';
export * from './public/kline';
export * from './public/markets';
export * from './public/memberLevels';
export * from './public/orderBook';
export * from './plugins/competition';
export * from './user/apiKeys';
export * from './user/auth';
export * from './user/beneficiaries';
export * from './user/captcha';
export * from './user/customization';
export * from './user/emailVerification';
export * from './user/history';
export * from './user/kyc';
export * from './user/newHistory';
export * from './user/openOrders';
export * from './user/orders';
export * from './user/ordersHistory';
export * from './user/password';
export * from './user/profile';
export * from './user/userActivity';
export * from './user/wallets';
export * from './plugins/kyc';
export * from './user/newWithdrawLimit';
export interface RootState {
	public: {
		alerts: AlertState;
		blocklistAccess: BlocklistAccessState;
		colorTheme: ColorThemeState;
		configs: ConfigsState;
		currencies: CurrenciesState;
		customization: CustomizationState;
		rgl: GridLayoutState;
		i18n: LanguageState;
		kline: KlineState;
		markets: MarketsState;
		memberLevels: MemberLevelsState;
		orderBook: OrderBookState;
		ranger: RangerState;
		recentTrades: RecentTradesState;
		depth: DepthState;
		incrementDepth: DepthIncrementState;
	};
	user: {
		apiKeys: ApiKeysState;
		auth: AuthState;
		beneficiaries: BeneficiariesState;
		captchaKeys: GeetestCaptchaState;
		customizationUpdate: CustomizationUpdateState;
		sendEmailVerification: EmailVerificationState;
		history: HistoryState;
		withdrawHistory: WithdrawHistoryState;
		depositHistory: DepositHistoryState;
		documents: DocumentsState;
		addresses: AddressesState;
		identity: IdentityState;
		label: LabelState;
		phone: PhoneState;
		newHistory: NewHistoryState;
		openOrders: OpenOrdersState;
		orders: OrdersState;
		ordersHistory: OrdersHistoryState;
		password: PasswordState;
		profile: ProfileState;
		userActivity: UserActivityState;
		wallets: WalletsState;
		childCurrencies: ChildCurrenciesState;
		allChildCurrencies: ChildCurrenciesState;
		withdrawLimit: WithdrawLimitState;
		walletsWithdrawLimit: WalletsWithdrawLimitState;
		newWithdrawLimit: {
			remains: NewWithdrawLimitRemainsState;
			checking: NewWithdrawLimitCheckingState;
		};
	};
	plugins: {
		stake: {
			createStake: CreateStakeState;
			unstake: UnstakeState;
			stakeList: StakingListState;
			stakeWallet: StakeWalletState;
			stakeHistory: StakeHistoryState;
			unstakeHistory: UnStakeHistoryState;
		};
		vote: {
			list: VoteListState;
			history: VoteHistoryState;
			donate: VoteDonateState;
		};
		airdropCoin: {
			list: AirdropCoinState;
			claims: AirdropCoinClaimState;
		};
		ieo: {
			price: PriceState;
			IEOItem: IEOItemState;
			IEOList: IEOListState;
			buyIEO: BuyIEOLoadingState;
			totalIEOBuyers: TotalIEOBuyersState;
			buyersHistory: BuyersHistoryState;
			buyHistory: BuyHistoryListState;
			ieoDetail: DetailIEOState;
			ieoCaution: IEOCautionState;
		};
		ethFee: {
			ethFee: ETHFeeState;
		};
		info: {
			events: EventsState;
			statistic: StatisticState;
		};
		referral: {
			friends: FriendsListState;
			history: CommisionHistoryState;
			ranks: ReferralRankState;
			estimatedCommision: EstimatedCommisionState;
			commisionInfo: CommisionInfoState;
		};
		competition: {
			competitionList: ListCompetitionState;
			competitionItem: NewCompetitionState;
			competitionVolume: CompetitionVolumeState;
			competitionRanking: RankingCompetitionState;
			competitionAward: CompetitionAwardState;
		};
		transactions: {
			prices: TransactionPriceListState;
			list: TransactionsListState;
		};
		kyc: {
			verifyAccount: VerifyAccountState;
			kycStatus: KycStatusState;
		};
	};
}

export const rootReducer = combineReducers({
	public: publicReducer,
	user: userReducer,
	plugins: pluginsReducer,
});

export function* rootSaga() {
	yield all([
		call(rootApiKeysSaga),
		call(rootAuthSaga),
		call(rootBeneficiariesSaga),
		call(rootBlocklistAccessSaga),
		call(rootConfigsSaga),
		call(rootCurrenciesSaga),
		call(rootCustomizationSaga),
		call(rootCustomizationUpdateSaga),
		call(rootEmailVerificationSaga),
		call(rootGeetestCaptchaSaga),
		call(rootHandleAlertSaga),
		call(rootHistorySaga),
		call(rootKlineFetchSaga),
		call(rootLabelSaga),
		call(rootMarketsSaga),
		call(rootMemberLevelsSaga),
		call(rootNewHistorySaga),
		call(rootOpenOrdersSaga),
		call(rootOrderBookSaga),
		call(rootOrdersHistorySaga),
		call(rootOrdersSaga),
		call(rootPasswordSaga),
		call(rootProfileSaga),
		call(rootRecentTradesSaga),
		call(rootSendCodeSaga),
		call(rootSendAddressesSaga),
		call(rootSendDocumentsSaga),
		call(rootSendIdentitySaga),
		call(rootUserActivitySaga),
		call(rootWalletsSaga),
		call(rootWithdrawLimitSaga),
		call(rootETHFeeSaga),
		call(rootIEOItemSaga),
		call(rootIEOListSaga),
		call(rootBuyIEOSaga),
		call(rootHistoryBuySaga),
		call(rootIEODetailSaga),
		call(rootPriceSaga),
		call(rootIEOCautionSaga),
		call(rootCompetitionAwardSaga),
		call(rootCompetitionItemSaga),
		call(rootCompetitionVolumeSaga),
		call(rootCompetitionRankingSaga),
		call(rootCompetitionListSaga),
		call(rootEventSaga),
		call(rootStakingSaga),
		call(rootVoteSaga),
		call(rootAirdropCoinSaga),
		call(rootReferralSaga),
		call(rootTransactionSaga),
		call(rootStatisticSaga),
		call(rootKycSaga),
		call(rootNewWithdrawLimitSaga),
	]);
}
