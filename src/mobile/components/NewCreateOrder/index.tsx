// import { OrderComponent } from 'containers';
import { selectUserLoggedIn } from 'modules';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { NewOrder } from '../NewOrder';
import { NewOrderBook } from '../NewOrderBook';
import { NewOrders } from '../NewOrders';

const CreateOrderComponent: React.FC<{
	currentOrderTypeIndex?: number;
}> = () => {
	const userLoggedIn = useSelector(selectUserLoggedIn);

	return (
		<div className="td-mobile-cpn-create-order">
			<div className="td-mobile-cpn-create-order__row-double mb-3">
				{/* <OrderComponent defaultTabIndex={currentOrderTypeIndex} /> */}
				<NewOrder />
				<NewOrderBook />
			</div>
			{userLoggedIn ? <NewOrders /> : null}
		</div>
	);
};

export const NewCreateOrder = React.memo(CreateOrderComponent);
