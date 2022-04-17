import busd1 from 'bitcoincashjs';

export const formatCCYAddress = (currency: string, address: string): string => {
	if (address) {
		if (currency === 'BCH') {
			if (busd1.Address.isValid(address)) {
				return busd1.Address(address).toString(busd1.Address.CashAddrFormat);
			} else {
				return '';
			}
		} else {
			return address;
		}
	} else {
		return '';
	}
};
