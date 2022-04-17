import styled from 'styled-components';

export const MarketTradingStyle = styled.div`
	height: 100%;
	font-size: 11px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
`;

export const SearchBlockStyle = styled.div`
	padding: 10px 10px 15px 10px;
	.search-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #848e9c;
		padding: 5px 0;

		.search-icon {
			margin-right: 20px;
		}
		.search-input {
			width: inherit;
			flex: 1;
			outline: none;
			background-color: transparent;
			border: none;
			color: #fff;
			::placeholder {
				color: #848e9c;
			}
		}
	}
	.select-wrapper {
		.select-item {
			cursor: pointer;
		}
		* {
			cursor: pointer;
		}
		i {
			box-sizing: border-box;
			margin: 0px 4px 0px 0px;
			min-width: 0px;
			display: flex;
			border: 1px solid #848e9c;
			border-radius: 99999px;

			::before {
				content: '';
				width: 6px;
				height: 6px;
				margin: 2px;
			}
			&.active {
				border: 1px solid var(--trading-button-color);
				box-sizing: border-box;
				::before {
					content: '';
					width: 6px;
					height: 6px;
					margin: 2px;
					border-radius: 99999px;
					background: var(--trading-button-color);
				}
			}
		}
	}
`;

export const StarBlockStyle = styled.div`
	display: flex;
	padding: 10px;
	background-color: rgba(12, 26, 50, 0.5);
	align-items: center;
	button {
		position: relative;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		border: none;
		border-radius: 5%;
		margin-right: 2px;
		outline: none;
		background: transparent;
		padding: 2px 6px;
		font-weight: 600;
		letter-spacing: 0.05em;
		color: #a3a3a3;
		:hover {
			:not(.active) {
				background: var(--trading-button-color);
				border-radius: 16px;
				color: #11223f;
			}
			.td-markets-trading-list-dropdown-wrapper {
				display: inline-block;
			}
		}
		> svg {
			box-sizing: border-box;
			margin: 0px;
			min-width: 0px;
			color: currentcolor;
			font-size: 10px;
			fill: currentcolor;
			transform: scale(1.8);
			width: 1em;
			height: 1em;
		}
		.td-markets-trading-list-dropdown-wrapper {
			display: none;
			position: absolute;
			top: 22px;
			left: 0;
			z-index: 10;
			padding-top: 3px;

			.td-markets-trading-list-dropdown {
				background-color: #11223f;
				&__item {
					display: flex;
					align-items: center;
					padding: 2px 6px;
					color: #ffff;
					:hover {
						background: var(--trading-button-color);
					}
					> svg {
						box-sizing: border-box;
						margin: 0px 8px 0px 0px;
						min-width: 0px;
						color: currentcolor;
						font-size: 10px;
						fill: currentcolor;
						width: 1em;
						height: 1em;
					}
				}
			}
		}

		&.favorite {
			width: 30px;
		}
		&.active {
			background: var(--trading-button-color);
			border-radius: 16px;
			color: #11223f;
		}
	}
`;

export const MarketsListTradingStyle = styled.div`
	flex: 1;
	.td-markets-trading-list-container {
		position: relative;
		height: 100%;
		&__negative {
			color: var(--asks);
		}
		&__positive {
			color: var(--bids);
		}
		.sort-icon svg {
			height: calc(0.5em * 1.67);
			height: calc(var(--gap) * 1.67);
			opacity: 1;
			padding-left: calc(0.5em * 0.5);
			padding-left: calc(var(--gap) * 0.5);
			vertical-align: middle;
			width: calc(0.5em * 2);
			width: calc(var(--gap) * 2);
		}
		.td-table-container {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			overflow: hidden;
		}
		.td-table {
			width: 100%;
			height: 100%;
			background-color: transparent;
			thead {
				background-color: transparent;
				display: block;
				tr {
					background-color: transparent;
					width: 100%;
					display: table;
					table-layout: fixed;
					cursor: pointer;
					th {
						color: #848e9c;
						background-color: transparent;
						padding: 0 !important;
						text-align: left;
						height: 1.7em;
						width: 30%;
						span {
							height: 100%;
							display: inline-block;
							line-height: 1.7em;
						}
						&:first-child {
							width: 40%;
							> span {
								padding-left: 10px;
							}
						}
						&:nth-child(3) {
							text-align: right;
							width: 30%;
							> span {
								padding-right: 10px;
							}
						}
						&:last-child {
							display: none;
						}
					}
				}
			}
			tbody {
				height: 100%;
				overflow-y: scroll;
				background-color: transparent;
				padding-bottom: 50px;
				tr {
					position: relative;
					&.td-table__row--selected {
						background-color: #4e5463;
					}
					margin-bottom: 1px;
					background-color: transparent;
					td.td-table__empty:nth-child(2) {
						text-align: center;
					}
					td {
						background-color: transparent;
						width: 30%;
						text-align: left;
						padding: unset !important;
						> span {
							display: block;
						}
						&:first-child {
							color: #fff;
							width: 40%;
							> span {
								.favorite {
									cursor: pointer;
								}
								display: flex;
								padding-left: 10px;
								align-items: center;
								> span {
									margin-right: 5px;
								}
							}
						}
						&:nth-child(3) {
							text-align: right;
							width: 30%;
							> span {
								padding-right: 10px;
							}
						}
						&:last-child {
							display: none;
						}
					}
					&:hover {
						background-color: #4e5463;
					}
				}
			}
		}
	}
`;
