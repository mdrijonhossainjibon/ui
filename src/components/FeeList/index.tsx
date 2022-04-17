import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Currency, ethFeeFetch, selectETHFee } from '../../modules';

interface Props {
	currencies: Currency[];
}

export const FeeList: React.FC<Props> = (props: Props) => {
	const { currencies } = props;
	const dispatch = useDispatch();
	const dispatchGetEthFee = React.useCallback(() => dispatch(ethFeeFetch()), [dispatch]);
	React.useEffect(() => {
		dispatchGetEthFee();
	}, [dispatchGetEthFee]);

	const ethFee = useSelector(selectETHFee);

	const renderItem = (currency, index: number) => {
		const open = require('../../assets/images/fee/turnon.png');
		const close = require('../../assets/images/fee/turnoff.png');

		const imgDeposit = currency.deposit_enabled ? <img src={open} alt="" /> : <img src={close} alt="" />;

		const imgWithdraw = currency.withdrawal_enabled ? <img src={open} alt="" /> : <img src={close} alt="" />;
		const limited = currency.withdraw_limit_24h;
		const currencyId = currency.id;
		const findCurrency = ethFee.find(cur => cur.currency_id === currencyId);

		const fee = findCurrency ? `${findCurrency.fee} ETH` : 'Unavailable';
		const withdrawFee = +currency.withdraw_fee !== 0 ? `${currency.withdraw_fee} ${currency.id.toUpperCase()}` : `${fee}`;

		return (
			<tr key={index}>
				<td style={{ textAlign: 'left', paddingLeft: '1%', color: 'white' }}>
					<span>
						{currency.name} ({currency.id.toUpperCase()})
					</span>
				</td>
				<td style={{ textAlign: 'left', paddingLeft: '1%' }}>
					<span>
						{Number(currency.min_deposit_amount) + Number(currency.deposit_fee)} {currency.id.toUpperCase()}
					</span>
				</td>
				<td style={{ textAlign: 'left', paddingLeft: '1%' }}>
					<span>
						{currency.min_withdraw_amount} {currency.id.toUpperCase()}
					</span>
				</td>
				<td style={{ textAlign: 'left', paddingLeft: '1%' }}>
					<span>{withdrawFee}</span>
				</td>
				<td style={{ textAlign: 'left', paddingLeft: '1%' }}>
					<span>
						{limited} {currency.id.toUpperCase()}
					</span>
				</td>
				<td>{imgDeposit}</td>
				<td>{imgWithdraw}</td>
			</tr>
		);
	};

	return (
		<table className="fee-table">
			<thead className="fee-table head">
				<tr>
					<th style={{ textAlign: 'left', paddingLeft: '1%' }}>Coin Name</th>
					<th>Min Deposit</th>
					<th>Min Withdraw</th>
					<th>Withdraw Fee</th>
					<th>Withdraw Daily Limit</th>
					<th>Deposit Status</th>
					<th>Withdraw Status</th>
				</tr>
			</thead>
			<tbody className="fee-table body">{currencies[0] && currencies.map(renderItem)}</tbody>
		</table>
	);
};
