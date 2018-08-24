import React from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import HeaderMenu from "./components/HeaderMenu";
import App from "./components/App";
import Login from "./components/Login";
import Callback from "./components/Callback";
import Auth from "./auth/Auth";
import history from "./history";

const auth = new Auth();
const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

const PrivateRoute = ({ component: Component, auth }) => (
  <Route
    render={props =>
      auth.isAuthenticated() ? (
        <div>
          <HeaderMenu auth={auth} />
          <Component {...props} />
        </div>
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

export const makeMainRoutes = () => {
  return (
    <Router history={history}>
      <div>
        <Switch>
          <Route
            path="/login"
            render={props => <Login auth={auth} {...props} />}
          />
          <Route
            path="/callback"
            render={props => {
              handleAuthentication(props);
              return <Callback {...props} />;
            }}
          />
          <PrivateRoute path="/" component={App} auth={auth} />
        </Switch>
      </div>
    </Router>
  );
};
