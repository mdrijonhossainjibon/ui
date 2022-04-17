import { localeDate } from 'helpers';
import * as React from 'react';
import { Decimal } from '../Decimal';

const RowItemComponent = props => {
	return (
		<div className="td-mobile-cpn-history-table__row">
			<div className="td-mobile-cpn-history-table__row__amount">
				<div className="td-mobile-cpn-history-table__row__amount-value">
					<Decimal fixed={props.fixed}>{props.amount}</Decimal>
				</div>
				<span className="td-mobile-cpn-history-table__row__amount-currency">{props.currency}</span>
			</div>
			<div className="td-mobile-cpn-history-table__row__date">{localeDate(props.createdAt, 'fullDate')}</div>
		</div>
	);
};

const RowItem = React.memo(RowItemComponent);

export { RowItem };
