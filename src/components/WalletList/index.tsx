import { Pagination } from 'antd';
import * as React from 'react';
import { WalletItem, WalletItemProps } from '../WalletItem';

export interface WalletListProps {
	walletItems: WalletItemProps[];
	activeIndex: number;
	/**
	 * Callback function which is invoked whenever wallet item is clicked
	 */
	onWalletSelectionChange(item: WalletItemProps): void;
	/**
	 * Callback function which is invoked whenever wallet item is clicked
	 */
	onActiveIndexChange(index: number): void;
}

const removeAlt = (str: string): string => str.replace('-alt', '');

const style: React.CSSProperties = {
	listStyleType: 'none',
	padding: 'calc(var(--gap) * 0.5) calc(var(--gap))',
};

/**
 * Component to display list of user wallets. It is scrollable and reacts on WalletItem click.
 */
export class WalletList extends React.Component<WalletListProps> {
	public state = {
		searchFieldValue: '',
		page: 1,
		pageSize: 20,
	};
	public itemState = (i: number) => {
		return this.props.activeIndex === i;
	};

	public makeWalletItem = (props: WalletItemProps, i: number) => (
		<li key={i} style={style} onClick={this.handleClick.bind(this, i, props)}>
			<WalletItem
				key={i}
				{...{
					...props,
					active: this.itemState(i),
					currency: removeAlt(props.currency),
				}}
			/>
		</li>
	);

	public handleClick = (i: number, props: WalletItemProps) => {
		if (this.props.onWalletSelectionChange) {
			this.props.onWalletSelectionChange(props);
		}
		if (this.props.onActiveIndexChange) {
			this.props.onActiveIndexChange(i);
		}
	};

	public handleFilter = (result: any) => {
		this.setState({
			activeCurrency: '',
			filteredData: result,
		});
	};

	/**
	 * Change page number
	 */

	public handlePageNumberChange = (page, pageSize) => {
		this.setState({
			page: page,
			pageSize: pageSize,
		});
	};

	public handleShowSizeChange = (current, size) => {
		this.setState({
			pageSize: size,
		});
	};

	public render() {
		const { searchFieldValue } = this.state;

		return (
			<div className="pg-markets">
				<div className="pg-wallets-header-selector-search-wallets">
					<div className="pg-wallets-header-selector-search-wallets-icon">
						<img alt="" src={require('./icon/search.svg')} />
					</div>
					<input
						className="pg-wallets-header-selector-search-wallets-field"
						onChange={this.searchFieldChangeHandler}
						value={searchFieldValue}
						autoFocus
					/>
				</div>
				<ul className="cr-wallet-list">
					{this.props.walletItems
						.filter((walletItem: any) => walletItem.currency.toLowerCase().includes(searchFieldValue.toLowerCase()))
						.slice((this.state.page - 1) * this.state.pageSize, this.state.page * this.state.pageSize)
						.map(this.makeWalletItem)}
				</ul>

				<div className="d-flex justify-content-center mt-4">
					<Pagination
						defaultCurrent={1}
						defaultPageSize={20}
						onChange={this.handlePageNumberChange}
						onShowSizeChange={this.handleShowSizeChange}
						total={this.props.walletItems.length}
					/>
				</div>
			</div>
		);
	}

	private searchFieldChangeHandler = e => {
		this.setState({
			searchFieldValue: e.target.value,
		});
	};
}
