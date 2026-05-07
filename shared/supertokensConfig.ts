export const supertokensConfig = {
	appName: 'batterychecker',
	apiDomain:
		process.env.API_DOMAIN ||
		`localhost:${parseInt(process.env.PORT ? process.env.PORT : '4738', 10)}`,
	websiteDomain:
		process.env.WEBSITE_DOMAIN ||
		`localhost:${parseInt(process.env.PORT ? process.env.PORT : '4738', 10)}`,
	apiBasePath: '/authapi',
	websiteBasePath: '/auth'
};
