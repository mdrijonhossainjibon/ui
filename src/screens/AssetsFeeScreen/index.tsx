import { getTabName, setDocumentTitle } from 'helpers';
import millify from 'millify';
import {
	allChildCurrenciesFetch,
	currenciesFetch,
	ethFeeFetch,
	selectAllChildCurrencies,
	selectCurrencies,
	selectETHFee,
} from 'modules';
import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePagination, useTable } from 'react-table';
import EmptySVG from './empty.svg';

export const AssetsFeeScreen = () => {
	setDocumentTitle('Assets Fee');
	const [searchState, setSearchState] = useState('');
	const findIcon = (code: string): string => {
		const currency = currencies.find((currency: any) => String(currency.id).toLowerCase() === code.toLowerCase());
		try {
			return require(`../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency && currency.icon_url) {
				return currency.icon_url;
			}

			return require('../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	const columns = React.useMemo(() => {
		return [
			{
				Header: 'Coin',
				accessor: 'coin',
			},
			{
				Header: 'Name',
				accessor: 'name',
			},
			{
				Header: 'Network',
				accessor: 'network',
			},
			{
				Header: 'Min Deposit',
				accessor: 'min_deposit_amount',
			},
			{
				Header: 'Min Withdraw',
				accessor: 'min_withdraw_amount',
			},
			{
				Header: 'Withdraw Fee',
				accessor: 'withdraw_fee',
			},
			{
				Header: 'Deposit Status',
				accessor: 'deposit_status',
			},
			{
				Header: 'Withdraw Status',
				accessor: 'withdrawal_status',
			},
		];
	}, []);

	const dispatch = useDispatch();
	React.useEffect(() => {
		dispatch(currenciesFetch());
		dispatch(ethFeeFetch());
		dispatch(allChildCurrenciesFetch());
	}, []);

	const currencies = useSelector(selectCurrencies);
	const ethFee = useSelector(selectETHFee);
	const allChildCurrencies = useSelector(selectAllChildCurrencies);
	const childCurrencies = allChildCurrencies.map(child => {
		const currency = currencies.find(cur => cur.id === child.id) || {
			blockchain_key: null,
			min_deposit_amount: null,
			min_withdraw_amount: null,
			withdraw_fee: null,
			withdraw_limit_24h: null,
			withdrawal_enabled: null,
			deposit_enabled: null,
			deposit_fee: null,
		};
		return {
			...child,
			blockchain_key: currency.blockchain_key,
			min_deposit_amount: currency.min_deposit_amount,
			min_withdraw_amount: currency.min_withdraw_amount,
			withdraw_fee: currency.withdraw_fee,
			withdrawal_enabled: currency.withdrawal_enabled,
			deposit_enabled: currency.deposit_enabled,
			deposit_fee: currency.deposit_fee,
		};
	});
	const listAllChildCurrencyID = childCurrencies.map(currency => currency.id.toLowerCase());

	const millifyAmountString = (amount: string | null | number) => {
		if (Number(amount) >= 1000000) {
			return millify(Number(amount), {
				precision: 2,
			});
		}
		return amount;
	};
	const millifyAmountNumber = (amount: number) => {
		if (amount >= 1000000) {
			return millify(amount, {
				precision: 2,
			});
		}
		return amount;
	};
	const data = currencies
		.filter(currency => (searchState === '' ? true : currency.id.toLowerCase().includes(searchState.toLowerCase())))
		.filter(currency => !listAllChildCurrencyID.includes(currency.id.toLowerCase()))
		.map(currency => {
			const open = require('../../assets/images/fee/turnon.png');
			const close = require('../../assets/images/fee/turnoff.png');

			const renderWithdrawFee = (withdrawFee: string | null) => {
				if (Number(withdrawFee) !== 0) {
					return (
						<div className="d-flex flex-row justify-content-between">
							<span>{millifyAmountString(withdrawFee)}</span>{' '}
							<span className="text-secondary">{currency.id.toUpperCase()}</span>
						</div>
					);
				}
				const foundedCurrency = ethFee.find(cur => cur.currency_id === currency.id);

				if (foundedCurrency) {
					return (
						<div className="d-flex flex-row justify-content-between" style={{}}>
							<span>{millifyAmountNumber(foundedCurrency.fee)}</span> <span className="text-secondary">ETH</span>
						</div>
					);
				}
				return <div className="text-center">-</div>;
			};

			const childs = childCurrencies.filter(
				childCurrency => childCurrency.parent_id.toLowerCase() === currency.id.toLowerCase(),
			);
			const childBlockchainKeys = childs.map(child => child.blockchain_key);
			const childMinDeposits = childs.map(child => child.min_deposit_amount);
			const childMinDepositsFee = childs.map(child => child.deposit_fee);
			const childMinWithdraw = childs.map(child => child.min_withdraw_amount);
			const childWithdrawFee = childs.map(child => child.withdraw_fee);
			const childDepositEnabled = childs.map(child => child.deposit_enabled);
			const childWithdrawEnabled = childs.map(child => child.withdrawal_enabled);

			const blockchainKeys = [currency.blockchain_key, ...childBlockchainKeys];
			const minDeposits = [currency.min_deposit_amount, ...childMinDeposits];
			const depositFees = [currency.deposit_fee, ...childMinDepositsFee];
			const minWithdraws = [currency.min_withdraw_amount, ...childMinWithdraw];
			const withdrawFees = [currency.withdraw_fee, ...childWithdrawFee];
			const depositEnabled = [currency.deposit_enabled, ...childDepositEnabled];
			const withdrawEnabled = [currency.withdrawal_enabled, ...childWithdrawEnabled];

			return {
				...currency,
				coin: (
					<span>
						<div className="text-center my-2">
							<img
								style={{ borderRadius: '50%' }}
								width="30px"
								height="30px"
								src={findIcon(currency.id)}
								alt={currency.id.toUpperCase()}
							/>
						</div>
						<div className="text-center my-2">{currency.id.toUpperCase()}</div>
					</span>
				),
				name: <div className="pl-2">{currency.name}</div>,
				min_deposit_amount: (
					<div>
						{minDeposits.map((amount, index) => (
							<div
								className="d-flex flex-row justify-content-between my-2 px-2 pb-3 pt-2"
								style={index < minDeposits.length - 1 ? { borderBottom: '0.5px solid #1b4c8f' } : {}}
							>
								{Number(amount) === 0
									? 'unlimited'
									: millifyAmountString((100 * Number(amount)) / (100 - Number(depositFees[index])))}
								<span className="text-secondary">{currency.id.toUpperCase()}</span>
							</div>
						))}
					</div>
				),
				withdraw_fee: (
					<div>
						{withdrawFees.map((amount, index) => {
							return (
								<div
									className="my-2 px-2 pb-3 pt-2"
									style={index < withdrawFees.length - 1 ? { borderBottom: '0.5px solid #1b4c8f' } : {}}
								>
									{renderWithdrawFee(amount)}
								</div>
							);
						})}
					</div>
				),
				min_withdraw_amount: (
					<div>
						{minWithdraws.map((amount, index) => (
							<div
								className="d-flex flex-row justify-content-center justify-content-between my-2 px-2 pb-3 pt-2"
								style={index < minWithdraws.length - 1 ? { borderBottom: '0.5px solid #1b4c8f' } : {}}
							>
								{Number(amount) === 0 ? 'unlimited' : millifyAmountString(amount)}
								<span className="text-secondary">{currency.id.toUpperCase()}</span>
							</div>
						))}
					</div>
				),
				deposit_status: (
					<div>
						{depositEnabled.map((isEnabled, index) => (
							<div
								className="d-flex justify-content-center align-items-center my-2 px-2 pb-3 pt-2"
								style={index < depositEnabled.length - 1 ? { borderBottom: '0.5px solid #1b4c8f' } : {}}
							>
								{isEnabled ? <img src={open} alt="open" /> : <img src={close} alt="close" />}
							</div>
						))}
					</div>
					// <div className="text-center">{imgDeposit}</div>
				),
				withdrawal_status: (
					<div>
						{withdrawEnabled.map((isEnabled, index) => (
							<div
								className="d-flex justify-content-center align-items-center my-2 px-2 pb-3 pt-2"
								style={index < withdrawEnabled.length - 1 ? { borderBottom: '0.5px solid #1b4c8f' } : {}}
							>
								<span> {isEnabled ? <img src={open} alt="open" /> : <img src={close} alt="close" />}</span>
							</div>
						))}
					</div>
				),
				network: (
					<div>
						{blockchainKeys.map((key, index) => (
							<div
								className="d-flex justify-content-center align-items-center my-2 px-2 pb-3 pt-2"
								style={index < blockchainKeys.length - 1 ? { borderBottom: '0.5px solid #1b4c8f' } : {}}
							>
								<span
									className="px-3"
									style={{
										borderRadius: '5px',
										fontSize: '12px',
										color: 'black',
										backgroundColor: 'var(--yellow)',
									}}
								>
									{key ? getTabName(key) : null}
								</span>
							</div>
						))}
					</div>
				),
			};
		});
	return (
		<React.Fragment>
			<div id="assets-fee-header" className="container-fluid">
				<div className="row">
					<div className="col-12">
						<h1>Fee Structure on UDONEX</h1>
					</div>
				</div>
			</div>
			<div id="assets-fee-body" className="container-fluid">
				<div className="row">
					<div className="col-12">
						<h3 className="assets-fee-body__title">Deposit & Withdraw Fees</h3>
						<p className="assets-fee-body__description">
							For each withdrawal, a flat fee is paid by users to cover the transaction costs of moving the
							cryptocurrency out of their Udonex account. Except for Peer to peer cash token with a certain %
							deflation minimum fee (burn, transaction fee, minimum fee...) will be charged with certain fee equally
							when making a withdrawal. This is applied to secure Currency (Erc20, Trc20...) and deflationary
							currency to prevent against financial manipulation and high volatility. Withdrawals rates are
							determined by the blockchain network and can fluctuate without notice due to factors such as network
							congestion. Please check the most recent data listed on each withdrawal page.
						</p>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<div className="search">
							<input
								autoFocus
								value={searchState}
								onChange={e => setSearchState(String(e.target.value).toUpperCase())}
								className="search-input"
								type="text"
								placeholder="Search BTC, ETH..."
							/>
							<span className="search-icon">
								<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M13.8086 12.8633L11.0742 10.1289C10.9375 10.0195 10.7734 9.9375 10.6094 9.9375H10.1719C10.9102 8.98047 11.375 7.77734 11.375 6.4375C11.375 3.32031 8.80469 0.75 5.6875 0.75C2.54297 0.75 0 3.32031 0 6.4375C0 9.58203 2.54297 12.125 5.6875 12.125C7 12.125 8.20312 11.6875 9.1875 10.9219V11.3867C9.1875 11.5508 9.24219 11.7148 9.37891 11.8516L12.0859 14.5586C12.3594 14.832 12.7695 14.832 13.0156 14.5586L13.7812 13.793C14.0547 13.5469 14.0547 13.1367 13.8086 12.8633ZM5.6875 9.9375C3.74609 9.9375 2.1875 8.37891 2.1875 6.4375C2.1875 4.52344 3.74609 2.9375 5.6875 2.9375C7.60156 2.9375 9.1875 4.52344 9.1875 6.4375C9.1875 8.37891 7.60156 9.9375 5.6875 9.9375Z"
										fill="#989898"
									/>
								</svg>
							</span>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<AssetsFeeTable columns={columns} data={data} loading={false} />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

interface AssetsFeeTableProps {
	columns: any;
	data: any;
	loading: boolean;
}

const AssetsFeeTable: React.FC<AssetsFeeTableProps> = (props: AssetsFeeTableProps) => {
	const { columns, data, loading } = props;
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page, // instead of using 'rows', we'll use page,
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0, pageSize: 500 },
		},
		usePagination,
	);

	// render the UI for your table
	return (
		<div id="assets-fee-table">
			<table {...getTableProps()} style={{ position: 'relative' }}>
				<thead>
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<th {...column.getHeaderProps()}>
									<span style={{ fontWeight: 'normal' }}>{column.render('Header')}</span>
								</th>
							))}
						</tr>
					))}
				</thead>

				{loading ? (
					<div style={{ width: '100%', height: '100px' }}>
						<LoadingSpinner loading={loading} />
					</div>
				) : [...page].length === 0 ? (
					<div className="text-center empty">
						<img className="text-center" width="100px" src={EmptySVG} alt="empty" />
						<br />
						<p>No Data</p>
					</div>
				) : (
					<tbody {...getTableBodyProps()}>
						{page.map(row => {
							prepareRow(row);

							return (
								<tr {...row.getRowProps()}>
									{row.cells.map(cell => {
										return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
									})}
								</tr>
							);
						})}
					</tbody>
				)}
			</table>
		</div>
	);
};

interface LoadingSpinnerProps {
	loading: boolean;
}

const LoadingSpinner = (props: LoadingSpinnerProps) => {
	const { loading } = props;

	return (
		<div id="assets-fee-loading-spinner">
			{loading ? (
				<div className="loading-spin d-flex justify-content-center align-items-center">
					<div className="text-center">
						<div className="spinner-border" role="status">
							<span className="sr-only">Loading...</span>
						</div>
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
};
