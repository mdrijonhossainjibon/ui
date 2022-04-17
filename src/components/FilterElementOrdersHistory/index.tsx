import { selectMarkets } from 'modules';
import * as moment from 'moment-timezone';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

interface Props {
	onFilter: (data: any) => void;
	onRestFilter: () => void;
	data: any;
}

export const FilterElement: React.FC<Props> = props => {
	const initialStateForm = {
		date_from: '',
		date_to: '',
		market: 'all',
		side: 'all',
	};
	const [valueForm, setValueForm] = useState(initialStateForm);

	const marketsData = useSelector(selectMarkets);

	const onChangeValueForm = (value: string, name: string): void => {
		const form = valueForm;
		form[name] = value;

		setValueForm(form);
	};

	const onSearch = () => {
		const { date_from, date_to, market, side } = valueForm;
		let dataFilter = props.data;
		// // filter by base_unit vs quote_unit
		if (market === 'all') {
			// no filter
		} else {
			dataFilter = dataFilter.filter((e: any) => e.market === market);
		}
		// // filter by side
		if (side !== 'all') {
			dataFilter = dataFilter.filter((e: any) => {
				const textSide = e.side || e.taker_type;

				return textSide === side;
			});
		}
		// filter by time from
		if (date_from !== '') {
			dataFilter = dataFilter.filter(
				e => moment(e.created_at, 'YYYYMMDD').valueOf() >= moment(date_from, 'YYYYMMDD').valueOf(),
			);
		}
		// filter by time to
		if (date_to !== '') {
			dataFilter = dataFilter.filter(
				e => moment(e.created_at, 'YYYYMMDD').valueOf() <= moment(date_to, 'YYYYMMDD').valueOf(),
			);
		}

		props.onFilter(dataFilter);
	};

	const onRestForm = () => {
		setValueForm(initialStateForm);
		props.onRestFilter();
	};

	const renderInputDate = (name: string) => {
		return (
			<input
				type="date"
				name={name}
				onChange={e => {
					onChangeValueForm(e.target.value, e.target.name);
				}}
			/>
		);
	};

	const renderSelection = () => {
		return (
			<React.Fragment>
				<div className="filter-select__coin">coin</div>
				<select
					className="select-form-control"
					name="market"
					defaultValue="all"
					onChange={e => {
						onChangeValueForm(e.target.value, e.target.name);
					}}
				>
					<option value="all">All</option>
					{marketsData.map(e => {
						return (
							<option value={e.id} key={e.id}>
								{e.name}
							</option>
						);
					})}
				</select>
			</React.Fragment>
		);
	};

	return (
		<div className="history-screen__filter">
			<form className="d-flex flex-wrap align-items-center">
				<div className="history-screen__filter__date d-flex align-items-center">
					<div className="history-screen__filter__date__desc">Date</div>
					{renderInputDate('date_from')}
					{renderInputDate('date_to')}
				</div>
				<div className="history-screen__filter__select d-flex align-items-center">
					<div className="history-screen__filter__select__desc">Pair</div>
					<div className="mr-3 history-screen__filter__select__choose">{renderSelection()}</div>
				</div>
				<div className="history-screen__filter__select history-screen__filter__select--type d-flex align-items-center">
					<div className="history-screen__filter__select__desc">Type</div>
					<div className="history-screen__filter__select__choose">
						<select
							id="inputOrderType"
							className="select-form-control"
							name="side"
							value={valueForm.side}
							onChange={e => {
								onChangeValueForm(e.target.value, e.target.name);
							}}
						>
							<option value="all">All</option>
							<option value="buy">Buy</option>
							<option value="sell">Sell</option>
						</select>
					</div>
				</div>
				<div className="history-screen__filter__search d-flex">
					<button
						className="history-screen__filter__search__btn history-screen__filter__search__btn--search"
						onClick={e => {
							e.preventDefault();
							onSearch();
						}}
					>
						Search
					</button>
					<button className="history-screen__filter__search__btn" type="reset" value="Reset" onClick={onRestForm}>
						Reset
					</button>
				</div>
			</form>
		</div>
	);
};
