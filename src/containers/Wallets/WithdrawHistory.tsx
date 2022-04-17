import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { History, Pagination, WalletItemProps } from '../../components';
import { Decimal } from '../../components/Decimal';
import { localeDate } from '../../helpers';
import { IntlProps } from '../../index';
import {
	currenciesFetch,
	Currency,
	fetchHistory,
	resetHistory,
	RootState,
	selectCurrencies,
	selectCurrentPage,
	selectFirstElemIndex,
	selectHistory,
	selectHistoryLoading,
	selectLastElemIndex,
	selectNextPageExists,
	selectWallets,
	WalletHistoryList,
} from '../../modules';

export interface WithdrawHistoryProps {
	type: string;
	currency: string;
}

export interface ReduxProps {
	currencies: Currency[];
	list: WalletHistoryList;
	wallets: WalletItemProps[];
	fetching: boolean;
	page: number;
	firstElemIndex: number;
	lastElemIndex: number;
	nextPageExists: boolean;
}

interface DispatchProps {
	fetchCurrencies: typeof currenciesFetch;
	fetchHistory: typeof fetchHistory;
	resetHistory: typeof resetHistory;
}

export type Props = WithdrawHistoryProps & ReduxProps & DispatchProps & IntlProps;

export class WithdrawWalletTable extends React.Component<Props> {
	public componentDidMount() {
		const { currencies, currency, type } = this.props;
		this.props.fetchHistory({ page: 0, currency, type, limit: 6 });

		if (currencies.length === 0) {
			this.props.fetchCurrencies();
		}
	}

	public componentWillReceiveProps(nextProps) {
		const { currencies, currency, type } = this.props;
		if (nextProps.currency !== currency || nextProps.type !== type) {
			this.props.resetHistory();
			this.props.fetchHistory({ page: 0, currency: nextProps.currency, type, limit: 6 });
		}

		if (nextProps.currencies.length === 0 && nextProps.currencies !== currencies) {
			this.props.fetchCurrencies();
		}
	}

	public componentWillUnmount() {
		this.props.resetHistory();
	}

	public render() {
		const { list, firstElemIndex, lastElemIndex, page, nextPageExists } = this.props;

		if (!list.length) {
			return null;
		}

		return (
			<div className="pg-history-elem__wallet">
				<div className="pg-history-elem__label">
					{this.props.intl.formatMessage({ id: `page.body.history.withdraw` })}
				</div>
				<History headers={this.getHeaders()} data={this.retrieveData(list)} />
				<Pagination
					firstElemIndex={firstElemIndex}
					lastElemIndex={lastElemIndex}
					page={page}
					nextPageExists={nextPageExists}
					onClickPrevPage={this.onClickPrevPage}
					onClickNextPage={this.onClickNextPage}
				/>
			</div>
		);
	}

	private getHeaders = () => [
		this.props.intl.formatMessage({ id: `page.body.history.withdraw.header.date` }),
		this.props.intl.formatMessage({ id: `page.body.history.withdraw.header.status` }),
		this.props.intl.formatMessage({ id: `page.body.history.withdraw.header.amount` }),
	];

	private onClickPrevPage = () => {
		const { page, type, currency } = this.props;
		this.props.fetchHistory({ page: Number(page) - 1, currency, type, limit: 6 });
	};

	private onClickNextPage = () => {
		const { page, type, currency } = this.props;
		this.props.fetchHistory({ page: Number(page) + 1, currency, type, limit: 6 });
	};

	private retrieveData = list => {
		const { currency, currencies, intl, type, wallets } = this.props;
		const { fixed } = wallets.find(w => w.currency === currency) || { fixed: 8 };
		if (list.length === 0) {
			return [[intl.formatMessage({ id: 'page.noDataToShow' }), '', '']];
		}

		return list
			.sort((a, b) => {
				return localeDate(a.created_at, 'fullDate') > localeDate(b.created_at, 'fullDate') ? -1 : 1;
			})
			.map((item, index) => {
				const amount = 'amount' in item ? Number(item.amount) : '';
				const confirmations = type === 'withdraws' && item.confirmations;
				const itemCurrency = currencies && currencies.find(cur => cur.id === currency);
				const minConfirmations = itemCurrency && itemCurrency.min_confirmations;
				const state = 'state' in item ? this.formatTxState(item.state, confirmations, minConfirmations) : '';

				return [
					localeDate(item.created_at, 'fullDate'),
					state,
					<Decimal key={index} fixed={fixed}>
						{amount}
					</Decimal>,
				];
			});
	};

	private formatTxState = (tx: string, confirmations?: number, minConfirmations?: number) => {
		const process = require('../../assets/status/wait.svg');
		const fail = require('../../assets/status/fail.svg');
		const success = require('../../assets/status/success.svg');
		const statusMapping = {
			succeed: <img src={success} alt="" />,
			failed: <img src={fail} alt="" />,
			accepted: <img src={process} alt="" />,
			canceled: <img src={fail} alt="" />,
			rejected: <img src={fail} alt="" />,
			processing: <img src={process} alt="" />,
			prepared: <img src={process} alt="" />,
			skipped: <img src={process} alt="" />,
			errored: <img src={process} alt="" />,
			confirming:
				confirmations !== undefined && minConfirmations !== undefined ? (
					`${confirmations}/${minConfirmations}`
				) : (
					<img src={process} alt="" />
				),
		};

		return statusMapping[tx];
	};
}

export const mapStateToProps = (state: RootState): ReduxProps => ({
	currencies: selectCurrencies(state),
	list: selectHistory(state),
	wallets: selectWallets(state),
	fetching: selectHistoryLoading(state),
	page: selectCurrentPage(state),
	firstElemIndex: selectFirstElemIndex(state, 6),
	lastElemIndex: selectLastElemIndex(state, 6),
	nextPageExists: selectNextPageExists(state, 6),
});

export const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
	fetchCurrencies: () => dispatch(currenciesFetch()),
	fetchHistory: params => dispatch(fetchHistory(params)),
	resetHistory: () => dispatch(resetHistory()),
});

export const WithdrawWalletHistory = injectIntl(connect(mapStateToProps, mapDispatchToProps)(WithdrawWalletTable));
