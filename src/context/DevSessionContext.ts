import { useSessionContext } from 'supertokens-auth-react/recipe/session';

interface SessionLike {
	loading: boolean;
	userId: string;
}

export function DevSessionContext(): SessionLike {
	const isProd = import.meta.env.PROD;

	if (!isProd) {
		return {
			loading: false,
			userId: 'team0'
		};
	}

	// eslint-disable-next-line react-hooks/rules-of-hooks
	return useSessionContext() as SessionLike;
}
