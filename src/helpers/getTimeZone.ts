export const getTimeZone = () => {
	let offset = new Date().getTimezoneOffset(),
		o = Math.abs(offset);

	return (offset < 0 ? '+' : '-') + ('00' + Math.floor(o / 60)).slice(-2) + ':' + ('00' + (o % 60)).slice(-2);
};
