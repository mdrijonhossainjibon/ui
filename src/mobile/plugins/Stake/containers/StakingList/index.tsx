import * as React from 'react';
import { Stake } from '../../../../../modules';
import { StakingItem } from '../../components';
interface StakingListProps {
	staking_list: Stake[];
}
export const StakingList: React.FC<StakingListProps> = (props: StakingListProps) => {
	const { staking_list } = props;

	return (
		<React.Fragment>
			{staking_list.map((staking: Stake) => (
				<StakingItem
					key={staking.stake_id}
					stake_id={staking.stake_id}
					currency_id={staking.currency_id}
					staking_name={staking.staking_name}
					rewards={staking.rewards}
					active={staking.active}
					status={staking.status}
					description={staking.description}
					start_time={staking.start_time}
					end_time={staking.end_time}
					cap_amount={staking.cap_amount}
					total_amount={staking.total_amount}
					min_amount={staking.min_amount}
					cap_amount_per_user={staking.cap_amount_per_user}
				/>
			))}
		</React.Fragment>
	);
};
