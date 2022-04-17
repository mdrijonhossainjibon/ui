import { Market } from 'modules';
import React, { useState, useEffect } from 'react';
import { RowTable } from './RowTable';

interface ListMarket {
	listMarket: Market[];
	childOfTBody?: React.ReactNode;
	childOfTHead?: React.ReactNode;
	isShowTHead: Boolean;
	onchangeFavorite?: () => void;
	hideFavorite?: boolean;
}

export const MarketList: React.FC<ListMarket> = ({
	listMarket,
	childOfTHead,
	childOfTBody,
	isShowTHead,
	onchangeFavorite,
	hideFavorite,
}) => {
	const favoritemMarketsLocal = JSON.parse(localStorage.getItem('favourites_markets') || '[]');
	const [listFavorite, setListFavorite] = useState(favoritemMarketsLocal);

	useEffect(() => {
		const favoritemMarketsLocal = JSON.parse(localStorage.getItem('favourites_markets') || '[]');
		setListFavorite(favoritemMarketsLocal);
	}, [listMarket]);

	const changeFavorite = () => {
		if (onchangeFavorite) {
			onchangeFavorite();
		}

		const favoritemMarketsLocalTmp = JSON.parse(localStorage.getItem('favourites_markets') || '[]');
		setListFavorite(favoritemMarketsLocalTmp);
	};

	const renderRowTable = () => {
		return listMarket.map((e, index) => (
			<RowTable
				hideFavorite={hideFavorite ? true : false}
				key={index}
				market={e}
				onchangeFavorite={changeFavorite}
				favorites={listFavorite.find(f => f === e.id)}
			/>
		));
	};

	return (
		<div className="td-mobile-cpn-market-list">
			<table>
				{isShowTHead ? <thead>{childOfTHead}</thead> : ''}

				<tbody className="td-mobile-cpn-market-list__body__markets">
					{childOfTBody}
					{renderRowTable()}
				</tbody>
			</table>
		</div>
	);
};
