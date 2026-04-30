export const supertokensConfig = {
	appName: 'batterychecker',
	apiDomain: process.env.API_DOMAIN || 'localhost:4738',
	websiteDomain: process.env.WEBSITE_DOMAIN || 'localhost:4738',
	apiBasePath: '/authapi',
	websiteBasePath: '/auth'
};
