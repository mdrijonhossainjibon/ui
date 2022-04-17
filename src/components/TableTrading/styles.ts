import styled from 'styled-components';

export const TableBlockStyle = styled.div`
	position: relative;

	.td-table {
		thead {
			th {
				top: 0;
				width: 100%;
			}
			tr {
				width: 100%;
				display: table;
				table-layout: fixed;
				th {
					text-align: left;
					&:last-child {
						text-align: right;
					}
				}
			}
		}
		tbody {
			-webkit-box-flex: 1;
			flex: 1 1 auto;
			display: block;
			overflow-y: scroll;
			flex-grow: 1;
			overflow-x: hidden;
			tr {
				width: 100%;
				display: table;
				table-layout: fixed;
			}
			td {
				background-color: var(--market-selector-table-background-color);
				color: var(--market-selector-table-text-color);
				width: calc(100% / 4);
				text-align: left;
				&:last-child {
					text-align: right;
				}
			}
			.td-table__row--selected {
				td {
					background-color: var(--market-selector-table-row-selector);
					&:first-child {
						color: var(--market-selector-table-text-color-hover);
					}
				}
			}
		}
		tr {
			cursor: pointer;
			&:hover {
				background: transparent;
				td {
					background-color: var(--market-selector-table-row-selector-hover);
					color: var(--market-selector-table-text-color-hover);
				}
			}
		}
	}
	th {
		font-weight: 500 !important;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		white-space: nowrap;
		text-align: right;
	}
	td {
		text-align: right;
	}
`;
