import React from "react";
import { Redirect, Route, Router } from "react-router-dom";
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

export const makeMainRoutes = () => {
  return (
    <Router history={history}>
      <div>
        <Route path="/login" render={props => <Login auth={auth} {...props} />} />
        <Route
          path="/callback"
          render={props => {
            handleAuthentication(props);
            return <Callback {...props} />;
          }}
        />
        <Route path="/" render={(props) => (
          !auth.isAuthenticated() ? (
            <Redirect to="/login"/>
          ) : (
            <App auth={auth} {...props} />
          )
        )} />
      </div>
    </Router>
  );
};
