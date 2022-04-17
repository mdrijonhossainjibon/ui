import classNames from 'classnames';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectStakeWallet, selectUserInfo, unStakePost } from '../../../../../modules';

interface UnStakeProps {
	currency_id: string;
}

export const UnStake: React.FC<UnStakeProps> = (props: UnStakeProps) => {
	const { currency_id } = props;
	const [amountState, setAmountState] = React.useState('');
	const [agreeState, setAgreeState] = React.useState(false);
	const stakeWallets = useSelector(selectStakeWallet);
	const stakeWallet = stakeWallets.find(wallet => wallet.currency_id === currency_id) || { balance: 0, locked: 0 };

	const isDisableUnstake =
		!agreeState || Number(amountState || 0) > Number(stakeWallet.balance || 0) || Number(amountState) <= 0;
	const unStakeClassNames = classNames('unstake-btn', isDisableUnstake ? 'unstake-btn--disabled' : '');

	const user = useSelector(selectUserInfo);
	const dispatch = useDispatch();
	const handleUnStake = () => {
		dispatch(
			unStakePost({
				uid: user.uid,
				currency_id: currency_id,
				amount: amountState,
			}),
		);
	};

	return (
		<div className="td-mobile-unstake">
			<span className="td-mobile-unstake__amount-number">
				Available Amount: {Number(stakeWallet.balance).toFixed(8)} {currency_id.toUpperCase()}
			</span>
			<div className="td-mobile-unstake__amount-box">
				<span>AMOUNT</span>
				<input
					value={amountState}
					type="number"
					placeholder="0"
					onChange={e => {
						const amount = e.target.value;
						if (Number(amount) >= 0) {
							setAmountState(amount);
						}
					}}
				/>
				<span>{currency_id.toUpperCase()}</span>
			</div>

			<label className="td-mobile-unstake__cautions">
				<input type="checkbox" checked={agreeState} onChange={e => setAgreeState(e.target.checked)} />I have read and
				agree with the cautions.
			</label>
			<div className="td-mobile-unstake__submit">
				<button disabled={isDisableUnstake} className={unStakeClassNames} onClick={handleUnStake}>
					UNSTAKE
				</button>
			</div>
		</div>
	);
};
