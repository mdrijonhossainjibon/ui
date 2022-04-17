import { ChildCurrency, Wallet } from 'modules';
import { preciseData } from './preciseNumber';

export const calcWalletsData = (wallets: Wallet[], allChildCurrencies: ChildCurrency[], precision = 6) => {
	const data: Wallet[] = [];

	const currencyDict = [];
	for (const wallet of wallets) {
		currencyDict[wallet.currency] = wallet;
	}

	for (const wallet of wallets) {
		let totalBalance = Number(wallet.balance) || 0;
		let totalLocked = Number(wallet.locked) || 0;

		for (const childCurrency of allChildCurrencies) {
			if (wallet.currency === childCurrency.parent_id) {
				totalBalance += Number(currencyDict[childCurrency.id]?.balance) || 0;
				totalLocked += Number(currencyDict[childCurrency.id]?.locked) || 0;
			}
		}

		data.push({
			...wallet,
			total: preciseData(Number(totalBalance + totalLocked), precision).toString(),
			balance: preciseData(Number(totalBalance), precision).toString(),
			locked: preciseData(Number(totalLocked), precision).toString(),
		});
	}

	return data;
};
