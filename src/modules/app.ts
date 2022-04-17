import { combineReducers } from 'redux';
import { ethFeeReducer } from './plugins/ethWithdraw/fee';
import { eventReducer } from './plugins/info/events';
import { airdropCoinClaimReducer, airdropCoinListReducer } from './plugins/airdropCoin';
import {
	BuyersHistoryReducer,
	BuyHistoryReducer,
	buyIEOReducer,
	IEODetailReducer,
	IEOItemReducer,
	IEOListReducer,
	priceReducer,
	totalIEOBuyersReducer,
} from './plugins/ieo';
import { IEOCautionReducer } from './plugins/ieo/caution';
import {
	createStakeReducer,
	stakeHistoryReducer,
	stakeWalletReducer,
	stakingListReducer,
	unStakeHistoryReducer,
	unStakeReducer,
} from './plugins/staking';
import { voteDonateReducer, voteHistoryReducer, voteListReducer } from './plugins/vote';
import { alertReducer } from './public/alert';
import { blocklistAccessReducer } from './public/blocklistAccess';
import { configsReducer } from './public/configs';
import { currenciesReducer } from './public/currencies';
import { customizationReducer } from './public/customization';
import { changeColorThemeReducer } from './public/globalSettings';
import { gridLayoutReducer } from './public/gridLayout/reducer';
import { changeLanguageReducer } from './public/i18n';
import { klineReducer } from './public/kline';
import { marketsReducer } from './public/markets';
import { memberLevelsReducer } from './public/memberLevels';
import { depthReducer, incrementDepthReducer, orderBookReducer } from './public/orderBook';
import { rangerReducer } from './public/ranger/reducer';
import { recentTradesReducer } from './public/recentTrades';
import { apiKeysReducer } from './user/apiKeys';
import { authReducer } from './user/auth';
import { beneficiariesReducer } from './user/beneficiaries';
import { getGeetestCaptchaReducer } from './user/captcha';
import { customizationUpdateReducer } from './user/customization';
import { sendEmailVerificationReducer } from './user/emailVerification';
import { depositHistoryReducer, historyReducer, withdrawHistoryReducer } from './user/history';
import { addressesReducer, documentsReducer, identityReducer, labelReducer, phoneReducer } from './user/kyc';
import { newHistoryReducer } from './user/newHistory';
import { openOrdersReducer } from './user/openOrders';
import { ordersReducer } from './user/orders';
import { ordersHistoryReducer } from './user/ordersHistory';
import { passwordReducer } from './user/password';
import { profileReducer } from './user/profile';
import { userActivityReducer } from './user/userActivity';
import { allChildCurrenciesReducer, childCurrenciesReducer, walletsReducer, walletsWithdrawLimitReducer } from './user/wallets';
import { withdrawLimitReducer } from './user/withdrawLimit';
import {
	friendsListReducer,
	commsionHistoryReducer,
	referralRanksReducer,
	estimatedCommisionReducer,
	commisionInfoReducer,
} from './plugins/referral';
import {
	CompetitionListReducer,
	CompetitionItemReducer,
	CompetitionVolumeReducer,
	rankingCompetitionReducer,
	competitionAwardReducer,
} from './plugins/competition';
import { transactionListReducer, transactionPriceListReducer } from './plugins/transactions';
import { statisticReducer } from './plugins/info/statistic';
import { verifyAccountReducer } from './plugins/kyc';
import { kycStatusReducer } from './plugins/kyc';
import { withdrawLimitCheckingReducer, withdrawLimitRemainReducer } from './user/newWithdrawLimit';

const ethFeesReducer = combineReducers({
	ethFee: ethFeeReducer,
});

const IEOReducer = combineReducers({
	IEOItem: IEOItemReducer,
	IEOList: IEOListReducer,
	buyIEO: buyIEOReducer,
	buyHistory: BuyHistoryReducer,
	buyersHistory: BuyersHistoryReducer,
	totalIEOBuyers: totalIEOBuyersReducer,
	ieoDetail: IEODetailReducer,
	ieoCaution: IEOCautionReducer,
	price: priceReducer,
});

export const newWithdrawLimitReducer = combineReducers({
	remains: withdrawLimitRemainReducer,
	checking: withdrawLimitCheckingReducer,
});
export const competitionReducer = combineReducers({
	competitionList: CompetitionListReducer,
	competitionItem: CompetitionItemReducer,
	competitionVolume: CompetitionVolumeReducer,
	competitionRanking: rankingCompetitionReducer,
	competitionAward: competitionAwardReducer,
});

const infoReducer = combineReducers({
	events: eventReducer,
	statistic: statisticReducer,
});

export const publicReducer = combineReducers({
	blocklistAccess: blocklistAccessReducer,
	colorTheme: changeColorThemeReducer,
	configs: configsReducer,
	currencies: currenciesReducer,
	customization: customizationReducer,
	recentTrades: recentTradesReducer,
	markets: marketsReducer,
	orderBook: orderBookReducer,
	depth: depthReducer,
	incrementDepth: incrementDepthReducer,
	ranger: rangerReducer,
	i18n: changeLanguageReducer,
	kline: klineReducer,
	alerts: alertReducer,
	rgl: gridLayoutReducer,
	memberLevels: memberLevelsReducer,
});

export const userReducer = combineReducers({
	auth: authReducer,
	beneficiaries: beneficiariesReducer,
	customizationUpdate: customizationUpdateReducer,
	label: labelReducer,
	orders: ordersReducer,
	password: passwordReducer,
	profile: profileReducer,
	wallets: walletsReducer,
	childCurrencies: childCurrenciesReducer,
	allChildCurrencies: allChildCurrenciesReducer,
	addresses: addressesReducer,
	documents: documentsReducer,
	identity: identityReducer,
	phone: phoneReducer,
	history: historyReducer,
	withdrawHistory: withdrawHistoryReducer,
	depositHistory: depositHistoryReducer,
	newHistory: newHistoryReducer,
	apiKeys: apiKeysReducer,
	userActivity: userActivityReducer,
	ordersHistory: ordersHistoryReducer,
	openOrders: openOrdersReducer,
	sendEmailVerification: sendEmailVerificationReducer,
	captchaKeys: getGeetestCaptchaReducer,
	withdrawLimit: withdrawLimitReducer,
	walletsWithdrawLimit: walletsWithdrawLimitReducer,
	newWithdrawLimit: newWithdrawLimitReducer,
});

const voteReducer = combineReducers({
	list: voteListReducer,
	history: voteHistoryReducer,
	donate: voteDonateReducer,
});

const airdropCoinReducer = combineReducers({
	list: airdropCoinListReducer,
	claims: airdropCoinClaimReducer,
});

const stakeReducer = combineReducers({
	stakeList: stakingListReducer,
	stakeWallet: stakeWalletReducer,
	stakeHistory: stakeHistoryReducer,
	createStake: createStakeReducer,
	unstake: unStakeReducer,
	unstakeHistory: unStakeHistoryReducer,
});

const referralReducer = combineReducers({
	friends: friendsListReducer,
	history: commsionHistoryReducer,
	ranks: referralRanksReducer,
	estimatedCommision: estimatedCommisionReducer,
	commisionInfo: commisionInfoReducer,
});

const transactionsReducer = combineReducers({
	prices: transactionPriceListReducer,
	list: transactionListReducer,
});

const kycReducer = combineReducers({
	verifyAccount: verifyAccountReducer,
	kycStatus: kycStatusReducer,
});

export const pluginsReducer = combineReducers({
	vote: voteReducer,
	stake: stakeReducer,
	ieo: IEOReducer,
	ethFee: ethFeesReducer,
	info: infoReducer,
	airdropCoin: airdropCoinReducer,
	referral: referralReducer,
	competition: competitionReducer,
	transactions: transactionsReducer,
	kyc: kycReducer,
});
