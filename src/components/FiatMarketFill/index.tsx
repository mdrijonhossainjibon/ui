import * as React from 'react';

export const FiatMarketFill = props => {
	const clickHandler = () => {
		props.setActiveFiat(props.id);
		props.setMarketPair(props.value);
	};

	return (
		<span className={props.active ? 'market__fiat__active' : 'market__fiat'} onClick={clickHandler}>
			{props.marketFiat}
		</span>
	);
};
