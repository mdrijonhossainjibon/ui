import { UAParser } from 'ua-parser-js';

export const getUserAgent = (userAgentData: string) => {
	const parser = new UAParser();
	parser.setUA(userAgentData);
	const userBrowserData = parser.getResult().browser;
	const userOSData = parser.getResult().os;
	const userAgent =
		userBrowserData.name && userOSData.name
			? `${userBrowserData.name} ${userOSData.name} ${userOSData.version ? userOSData.version : ''}`
			: parser.getResult().ua;

	return userAgent;
};

export const getUserAgentBrowserAndDevice = (userAgentData: string) => {
	const parser = new UAParser();
	parser.setUA(userAgentData);

	return {
		browserName: parser.getBrowser().name || 'Unknown',
		deviceName: parser.getDevice().model || 'Unknown',
	};
};
