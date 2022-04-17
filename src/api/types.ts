export interface Config {
	api: {
		authUrl: string;
		tradeUrl: string;
		applogicUrl: string;
		rangerUrl: string;
		arkeUrl: string;
		finexUrl: string;
		ieoAPIUrl: string;
		sunshineUrl: string;
		airdropUrl: string;
		stakeUrl: string;
		walletUrl: string;
		referralUrl: string;
		competitionUrl: string;
		transactionUrl: string;
		holderUrl: string;
		statisticUrl: string;
		newKycUrl: string;
		bannerUrl: string;
		withdrawLimitUrl: string;
	};
	minutesUntilAutoLogout?: string;
	rangerReconnectPeriod?: string;
	withCredentials: boolean;
	storage: {
		defaultStorageLimit?: number;
		orderBookSideLimit?: number;
	};
	gaTrackerKey?: string;
	msAlertDisplayTime?: string;
	incrementalOrderBook: boolean;
	finex: boolean;
	isResizable: boolean;
	isDraggable: boolean;
	languages: string[];
	sessionCheckInterval: string;
	balancesFetchInterval: string;
	passwordEntropyStep: number;
	showLanding: boolean;
	sentryEnabled?: boolean;
	kycSteps?: string[];
}
