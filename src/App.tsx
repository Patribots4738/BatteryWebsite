import React from 'react';
import SuperTokens, { SuperTokensWrapper } from 'supertokens-auth-react';
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword';
import { EmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui';
import Session, { SessionAuth } from 'supertokens-auth-react/recipe/session';
import { canHandleRoute, getRoutingComponent } from 'supertokens-auth-react/ui';

import './App.css';
import HubPage from './pages/HubPage';
import SearchPage from './pages/SearchPage';
import RawDataPage from './pages/RawDataPage';
import { supertokensConfig } from '../shared/supertokensConfig';

function getPage() {
	switch (localStorage.getItem('currentPage')) {
		case 'hub':
			return <HubPage />;
		case 'search':
			return <SearchPage />;
		case 'rawData':
			return <RawDataPage />;
		default:
			localStorage.setItem('currentPage', 'hub');
			return <HubPage />;
	}
}

SuperTokens.init({
	appInfo: supertokensConfig,
	recipeList: [EmailPassword.init(), Session.init()]
});

export default class App extends React.Component {
	render() {
		if (process.env.NODE_ENV === 'production') {
			//renders ui on auth route
			if (canHandleRoute([EmailPasswordPreBuiltUI])) {
				return getRoutingComponent([EmailPasswordPreBuiltUI]);
			}

			return (
				<SuperTokensWrapper>
					<SessionAuth>
						{<div className="App">{getPage()}</div>}
					</SessionAuth>
				</SuperTokensWrapper>
			);
		} else {
			return <div className={'App'}>{getPage()}</div>;
		}
	}
}
