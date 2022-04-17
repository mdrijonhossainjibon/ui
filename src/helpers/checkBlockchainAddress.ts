export const checkValidErc20Address = (address: string) => {
	let patt = new RegExp('^0x[0-9a-fA-F]{40}$');
	let res = patt.test(address);
	return res;
};
export const checkValidBitcoinAddress = (address: string) => {
	let patt = new RegExp('^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$');
	let res = patt.test(address);
	return res;
};
