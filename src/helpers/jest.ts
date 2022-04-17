import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Action, Middleware } from 'redux';
import configureMockStore from 'redux-mock-store';
import { Config, Cryptobase } from '../api';

// tslint:disable-next-line
import * as WebSocket from 'ws';

const mockConfig: Config = {
	api: {
		authUrl: '/api/v2/barong',
		tradeUrl: '/api/v2/udonex',
		applogicUrl: '/api/v2/applogic',
		holderUrl: '/api/v2/holder',
		rangerUrl: '/api/v2/ranger',
		arkeUrl: '/api/v2/arke',
		finexUrl: '/api/v2/finex',
		ieoAPIUrl: '/api/v2/ieo',
		sunshineUrl: '/api/v2/sunshine',
		airdropUrl: '/api/v2/airdrop',
		stakeUrl: '/api/v2/stake',
		walletUrl: '/api/v2/wallet',
		referralUrl: '/api/v2/referral',
		competitionUrl: '/api/v2/competition',
		transactionUrl: '/api/v2/transaction',
		statisticUrl: '/api/v2/statistic',
		newKycUrl: '/api/v2/newKyc',
		bannerUrl: '/api/v2/banner',
		withdrawLimitUrl: '/api/v2/withdrawLimit',
	},
	minutesUntilAutoLogout: '30',
	rangerReconnectPeriod: '1',
	withCredentials: true,
	storage: {},
	gaTrackerKey: '',
	incrementalOrderBook: false,
	finex: false,
	isResizable: false,
	isDraggable: false,
	languages: ['en', 'ru'],
	sessionCheckInterval: '15000',
	balancesFetchInterval: '15000',
	passwordEntropyStep: 0,
	showLanding: true,
	sentryEnabled: false,
};

// tslint:disable no-any no-console
export const loggerMiddleware: Middleware = (store: {}) => (next: any) => (action: Action) => {
	console.log(`dispatching: ${JSON.stringify(action)}`);

	return next(action);
};

export const setupMockStore = (appMiddleware: Middleware, log = false) => {
	const middlewares = log ? [loggerMiddleware, appMiddleware] : [appMiddleware];

	return configureMockStore(middlewares);
};

export const setupMockAxios = () => {
	Cryptobase.config = mockConfig;

	return new MockAdapter(Axios);
};

export const mockNetworkError = (mockAxios: any) => {
	mockAxios.onAny().networkError();
};

export const createEchoServer = (port: number, debug: boolean) => {
	const server = new WebSocket.Server({ port: port });
	server.on('connection', (ws, request) => {
		if (debug) {
			ws.addEventListener('open', () => {
				console.log(`Ping Server: listening on port ${port}`);
			});
		}
		ws.on('message', (message: string) => {
			if (debug) {
				console.log(`Ping Server: sending back ${message}`);
			}
			ws.send(message);
		});
	});

	return server;
};
