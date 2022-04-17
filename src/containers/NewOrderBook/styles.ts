import styled from 'styled-components';

interface OrderBookProps {
	tabState: 'all' | 'buy' | 'sell';
}

const OrderBookStyleVar = {
	headHeight: '42px',
	tbHeadHeight: '40px',
	tickerHeight: '40px',
};

export const OrderBookStyle = styled.div<OrderBookProps>`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	height: calc(100% - 6px);
	color: white;
	/* padding: 0 10px; */
	.td-order-book {
		height: 100%;
		padding-bottom: 15px;
		&-item__negative {
			color: var(--header-negative-text-color);
		}
		&-item__positive {
			color: var(--header-positive-text-color);
		}
		&-tooltip {
			bottom: 200px;
		}
		&-header {
			padding: 10px;
			height: ${OrderBookStyleVar.headHeight};
			svg {
				cursor: pointer;
			}
			background-color: var(--trading-header-background);
			&__title {
				h3 {
					font-weight: bold;
					font-size: 16px;
					line-height: 22px;
					color: #ffffff;
				}
			}
		}
		&-tbheader {
			height: ${OrderBookStyleVar.tbHeadHeight};
			padding: 6px 10px;
			font-size: 14px;
			color: #848e9c;
			> div {
				display: inline-block;
				width: 28%;
				&:last-child,
				&:first-child {
					width: 36%;
				}
			}
		}
		&-ticker {
			height: ${OrderBookStyleVar.tickerHeight};
			padding: 10px;
			background-color: var(--trading-header-background);
			font-size: 14px;
			&__last-price {
				font-size: 18px;
				line-height: 25px;
			}
			&__usd {
				color: #848e9c;
				padding-left: 1.5rem !important;
			}
		}
		&-table {
			padding: 0px 10px;
			height: ${(props: OrderBookProps) =>
				props.tabState === 'all'
					? `calc(
				(
						100% - ${OrderBookStyleVar.headHeight} - ${OrderBookStyleVar.tickerHeight} -
							${OrderBookStyleVar.tbHeadHeight} - 15px
					) / 2
			)`
					: `calc(100% - ${OrderBookStyleVar.headHeight} - ${OrderBookStyleVar.tickerHeight} - ${OrderBookStyleVar.tbHeadHeight})`};
			display: block;
			thead,
			tbody {
				display: block;
				tr {
					display: block;
					background-color: transparent;
					cursor: pointer;
					:hover {
						background-color: #4e5463;
					}
					td,
					th {
						width: 28%;
						display: inline-block;
						text-align: left;
						&:last-child,
						&:first-child {
							width: 36%;
						}
						&:last-child {
							text-align: right;
						}
					}
				}
			}
			tbody {
				height: 100%;
				overflow-y: scroll;
				tr {
					margin-top: 1px;
					margin-bottom: 1px;
					td {
						height: 100%;
					}
				}
			}
			&.td-reverse-table-body {
				tbody {
					transform: rotate(180deg);
					.td-order-book-table__empty_data {
						transform: rotate(180deg);
					}
					tr {
						direction: rtl;
						td {
							transform: rotate(180deg);
						}
					}
				}
			}
		}
	}
`;

interface TrProps {
	percentWidth: number;
	placement: 'left' | 'right';
	color: string;
}

export const TrStyle = styled.tr<TrProps>`
	position: relative;
	z-index: 5;
	&:after {
		content: '';
		position: absolute;
		top: 0;
		right: ${(props: TrProps) => (props.placement === 'right' ? 0 : 'unset')};
		bottom: 0;
		left: ${(props: TrProps) => (props.placement === 'left' ? 0 : 'unset')};
		background-color: ${(props: TrProps) => props.color};
		width: ${(props: TrProps) => props.percentWidth}%;
		z-index: -5;
	}
`;
