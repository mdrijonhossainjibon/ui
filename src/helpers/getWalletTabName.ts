export const getTabName = (blockchainKey: string) => {
	const tabNames = [
		{
			name: 'BITCOIN',
			blockchain_key: 'btc-main',
		},
		{
			name: 'DOGECOIN',
			blockchain_key: 'doge-main',
		},
		{
			name: 'LITECOIN',
			blockchain_key: 'lite-main',
		},
		{
			name: 'WAVE',
			blockchain_key: 'wave-main',
		},
		{
			name: 'DASHCOIN',
			blockchain_key: 'dash-main',
		},
		{
			name: 'XLM',
			blockchain_key: 'xlm-main',
		},
		{
			name: 'ERC20-T',
			blockchain_key: 'eth-testnet',
		},
		{
			name: 'TRON20-T',
			blockchain_key: 'tron-test',
		},
		{
			name: 'BEP20-T',
			blockchain_key: 'bsc-testnet',
		},
		{
			name: 'ETHEREUM',
			blockchain_key: 'eth-main',
		},
		{
			name: 'TRON',
			blockchain_key: 'trx-main',
		},
		{
			name: 'BINANCE',
			blockchain_key: 'bsc-main',
		},
		{
			name: 'LENOCORE',
			blockchain_key: 'leno-main',
		},
	];
	const foundTab = tabNames.find(tabName => tabName.blockchain_key.toLowerCase() === blockchainKey.toLowerCase());

	return foundTab ? foundTab.name : 'UNAVAIALBE';
};
