import * as React from 'react';
import { Router as BrowserRouter } from "react-router";
import { Route, Link, Redirect, Switch } from "react-router-dom";
import Welcome from 'components/Welcome';
import Main from 'components/Main';
import AccountHelper from "helpers/accountHelper";
import NavigationHelper from "helpers/navigationHelper";
import GlobalState from "models/globalState";
import { observer } from 'mobx-react';

function Home() {
  return <Link to="/login">Welcome</Link>;
}

const MainOrSignIn = observer(() => {
  if (GlobalState.loggedIn) {
    return <Main/>;
  } else {
    return <Redirect to="/login"/>
  }
});

const Router = observer(() => {

  return (
    <BrowserRouter history={NavigationHelper.history}>
      {/* Switch stops at the first match */}
      <Switch>
        <Route path="/login">
          <Welcome/>
        </Route>
        {/* Catch-all */}
        <Route>
          <MainOrSignIn/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
  
});

export default Router;