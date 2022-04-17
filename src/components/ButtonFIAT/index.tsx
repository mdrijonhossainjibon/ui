import * as React from 'react';

export const ButtonFIAT = props => {
	const clickHandler = () => {
		props.setActiveButton(props.id);
		props.setMarketPair(props.value);
		props.setNameMarketPair(props.marketFiat);
	};

	return (
		<span className={props.active ? 'market-pair__fiat__active' : 'market-pair__fiat'} onClick={clickHandler}>
			{props.marketFiat}
		</span>
	);
};
