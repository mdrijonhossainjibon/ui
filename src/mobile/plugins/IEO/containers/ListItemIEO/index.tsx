import { IEOItem } from 'modules';
import * as React from 'react';
import { IEOItemComponent } from '../../components';

interface ListItemIEOProps {
	IEOList: IEOItem[];
}

export const ListItemIEO: React.FC<ListItemIEOProps> = props => {
	const { IEOList } = props;

	return (
		<React.Fragment>
			{IEOList.map((item, index) => (
				<IEOItemComponent
					type={item.type}
					currencyId={item.currency_id}
					startDate={item.start_date}
					endDate={item.end_date}
					currencyAvailable={item.currency_available}
					description={item.description}
					bonus={item.bonus}
					remains={Number(item.remains)}
					total={Number(item.total_ieo)}
					id={item.id}
					key={index}
					progress={item.progress}
				/>
			))}
		</React.Fragment>
	);
};
