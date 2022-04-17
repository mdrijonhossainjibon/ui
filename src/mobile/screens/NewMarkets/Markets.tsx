import React, { useState } from 'react';
import { NewAllMarketList } from './../../components';
import { HeaderSearch } from './HeaderSearch';

export const Markets = () => {
	const [valueSearch, setValueSearch] = useState('');

	const onSearch = value => {
		setValueSearch(value);
	};

	const backToAllList = () => {
		setValueSearch('');
	};

	return (
		<div className="td-mobile-screen-market">
			<HeaderSearch onSearch={onSearch} backToAll={backToAllList} />

			<NewAllMarketList valueSearch={valueSearch} setValueSearch={setValueSearch} />
		</div>
	);
};
