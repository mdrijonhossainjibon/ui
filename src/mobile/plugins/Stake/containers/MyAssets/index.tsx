import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { selectStakeHistories, selectStakeWallet, selectStakeWalletLoading, walletsFetch } from '../../../../../modules';
import { LoadingSpinner } from '../../components';

interface MyAssetsProps {
	currency_id: string;
}

export const MyAssets = (props: MyAssetsProps) => {
	const intl = useIntl();

	const { currency_id } = props;
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(walletsFetch());
	}, [dispatch]);

	const stakeWallets = useSelector(selectStakeWallet);
	const stakeWallet = stakeWallets.find(wallet => wallet.currency_id === currency_id) || { balance: 0, locked: 0 };

	const stakeHistories = useSelector(selectStakeHistories);
	const histories = stakeHistories
		.filter(history => history.currency_id === currency_id)
		.map(history => ({
			...history,
			amount: Number(history.amount),
		}));
	const stakedAmount: number =
		histories.length > 0
			? histories
					.map(history => history.amount)
					.reduce((accumulator, currentValue, currentIndex, array) => accumulator + currentValue)
			: 0;
	const isLoadingStakeWallet = useSelector(selectStakeWalletLoading);

	return (
		<div className="td-mobile-my-asset">
			<div className="td-mobile-my-asset__stake-amount">
				<span>{intl.formatMessage({ id: `stake.detail.myAssets.stakedAmount` })}</span>
				<span>{stakedAmount.toFixed(8)}</span>
			</div>
			<div className="td-mobile-my-asset__availiable">
				<span>{intl.formatMessage({ id: `stake.detail.myAssets.availableUnstake` })}</span>
				<span>{Number(stakeWallet.balance).toFixed(8)}</span>
			</div>
			<LoadingSpinner loading={isLoadingStakeWallet} />
		</div>
	);
};
