export const preciseData = (num: number, precision = 2) => {
	const re = new RegExp(`^-?\\d+(?:\.\\d{0,${precision}})?`);

	return Number(num.toString().match(re)) || num;
};
