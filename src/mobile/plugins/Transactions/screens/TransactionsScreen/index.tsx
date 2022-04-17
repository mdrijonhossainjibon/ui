import { setDocumentTitle } from 'helpers';
import { toLower, toNumber, toUpper } from 'lodash';
import { selectCurrencies, currenciesFetch, Currency } from 'modules';
import { selectTransactionList, selectTransactionListLoading, transactionsListFetch } from 'modules/plugins/transactions';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'currency-formatter';
import { minus } from 'number-precision';
import { SALE_UDON_CONFIG } from 'screens';
import WalletSVG from './wallet.svg';
import { format as formatDate } from 'date-fns';
import ReactPaginate from 'react-paginate';
import UdonexLoading from 'assets/icon-udonex.gif';

const PRIMARY_CURRENCY = 'udon';
const USD_CURRENCY = 'usd';
const NUMBER_ITEM_DISPLAY = 5;

const InformationList = () => {
	setDocumentTitle('Transactions');

	// selectors
	const currencies = useSelector(selectCurrencies);
	const transactions = useSelector(selectTransactionList);

	const findIcon = (currencyID: string): string => {
		const currency = currencies.find((currency: Currency) => currency.id === currencyID);
		try {
			return require(`../../../../../../node_modules/cryptocurrency-icons/128/color/${currencyID.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}

			return require('../../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	return (
		<div className="mobile-transactions-screen__info-list">
			<div className="mobile-transactions-screen__info-list__item">
				<div>
					<img
						style={{ borderRadius: '50%' }}
						width="50px"
						height="50px"
						src={findIcon(toLower(USD_CURRENCY))}
						alt={USD_CURRENCY}
					/>
				</div>
				<div className="ml-3">
					<div className="mobile-transactions-screen__info-list__item__total">Total Sales</div>
					<div>
						<span className="mobile-transactions-screen__info-list__item__value">
							{transactions[2]
								? format(transactions[2].udonTotal, {
										code: '',
										precision: 2,
								  })
								: '0.00'}
						</span>
						<span className="mobile-transactions-screen__info-list__item__value-sign ml-3">
							{toUpper(USD_CURRENCY)}
						</span>
					</div>
				</div>
			</div>

			<div className="mobile-transactions-screen__info-list__item">
				<div>
					<img width="50px" height="50px" src={findIcon(toLower(PRIMARY_CURRENCY))} alt={PRIMARY_CURRENCY} />
				</div>
				<div className="ml-3">
					<div className="mobile-transactions-screen__info-list__item__total">Total Remain</div>
					<div>
						<span className="mobile-transactions-screen__info-list__item__value">
							{format(minus(SALE_UDON_CONFIG.udonTotalNumber, transactions[2].udonTotal), {
								code: '',
								precision: 0,
							})}
						</span>
						<span className="mobile-transactions-screen__info-list__item__value-sign ml-3">
							{toUpper(PRIMARY_CURRENCY)}
						</span>
					</div>
				</div>
			</div>
			<div className="mobile-transactions-screen__info-list__item">
				<div>
					<img width="50px" height="50px" src={WalletSVG} alt="wallet" />
				</div>
				<div className="ml-3">
					<div className="mobile-transactions-screen__info-list__item__total">Presale Address</div>
					<div>
						<span className="mobile-transactions-screen__info-list__item__value">{SALE_UDON_CONFIG.address}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

const TransactionHistory = () => {
	const transactions = useSelector(selectTransactionList);
	const bscscanAddressLink = (address: string) => {
		return `https://bscscan.com/address/${address}`;
	};

	const bscscanHashLink = (hash: string) => {
		return `https://bscscan.com/tx/${hash}`;
	};

	const list =
		transactions && transactions[1].length > 0
			? [...transactions[1]].map(d => ({
					...d,
					hashString: d.hash,
					hash: <a href={bscscanHashLink(d.hash)} target="_blank">{`${d.hash.slice(0, 15)}...`}</a>,
					from: <a href={bscscanAddressLink(d.from)} target="_blank">{`${d.from.slice(0, 15)}...`}</a>,
					uTotal: <span>{format(d.uTotal, { code: '', precision: 0 })}</span>,
					amount: (
						<span>
							{format(d.amount, { code: '', precision: 6 })} {d.currency} {'('}$
							{format(d.usdPrice, { code: 'usd' })}
							{')'}
						</span>
					),
					value: <span>{toNumber(d.value).toFixed(7)}</span>,
					success: d.success ? (
						<span className="text-success">Success</span>
					) : (
						<span className="text-danger">fail</span>
					),
					timeStamp: formatDate(
						new Date(new Date(toNumber(d.timeStamp) * 1000).toLocaleDateString('en-US')),
						'dd/MM/yyyy',
					),
			  }))
			: [];

	return (
		<div className="mobile-transactions-screen__history">
			{list.map(transaction => (
				<div className="mobile-transactions-screen__history__box" key={transaction.hashString}>
					<div className="mobile-transactions-screen__history__box__header">
						<div className="mobile-transactions-screen__history__box__header__left">{transaction.timeStamp}</div>
						<div className="mobile-transactions-screen__history__box__header__right">
							{transaction.uTotal} {toUpper(PRIMARY_CURRENCY)}
						</div>
					</div>
					<div className="mobile-transactions-screen__history__box__body">
						<div className="mobile-transactions-screen__history__box__body__from">
							<div className="mobile-transactions-screen__history__box__body__from__address">
								{transaction.from}
							</div>
							<div className="mobile-transactions-screen__history__box__body__from__total">
								{transaction.amount}
							</div>
						</div>
						<div className="mobile-transactions-screen__history__box__body__to">
							<div className="mobile-transactions-screen__history__box__body__to__address">
								{SALE_UDON_CONFIG.address}
							</div>
							<div className="mobile-transactions-screen__history__box__body__to__status">
								{transaction.success}
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export const MobileTransactionsScreen = () => {
	// state
	const [pageIndex, setPageIndex] = useState(0);

	// dispatch
	const dispatch = useDispatch();

	const transactions = useSelector(selectTransactionList);
	const isLoading = useSelector(selectTransactionListLoading);
	React.useEffect(() => {
		dispatch(transactionsListFetch({ limit: NUMBER_ITEM_DISPLAY, page: 0 }));
		dispatch(currenciesFetch());
	}, []);

	const handlePageClick = (selectedItem: { selected: number }) => {
		dispatch(transactionsListFetch({ page: selectedItem.selected, limit: NUMBER_ITEM_DISPLAY }));
		setPageIndex(selectedItem.selected);
	};

	return (
		<div className="mobile-transactions-screen">
			<InformationList />
			<TransactionHistory />
			{isLoading ? (
				<div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
					<img width="100px" src={UdonexLoading} alt="loading" />
				</div>
			) : (
				<ReactPaginate
					previousLabel={'<'}
					nextLabel={'>'}
					breakLabel={'...'}
					breakClassName={'break-me'}
					pageCount={transactions[0].totalPage / NUMBER_ITEM_DISPLAY}
					marginPagesDisplayed={2}
					pageRangeDisplayed={5}
					onPageChange={handlePageClick}
					containerClassName={'mobile-transactions-screen__pagination'}
					activeClassName={'active'}
					forcePage={pageIndex}
				/>
			)}
		</div>
	);
};
