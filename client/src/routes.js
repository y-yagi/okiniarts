import React, { StrictMode } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import HeaderMenu from "./components/HeaderMenu";
import App from "./components/App";
import Login from "./components/Login";
import Callback from "./components/Callback";
import NewArtist from "./components/NewArtist";
import EditArtist from "./components/EditArtist";
import NewArt from "./components/NewArt";
import EditArt from "./components/EditArt";
import Artist from "./components/Artist";
import Artists from "./components/Artists";
import Art from "./components/Art";
import Auth from "./auth/Auth";
import history from "./history";

const auth = new Auth();
const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
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
    <StrictMode>
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
            <PrivateRoute extract path="/arts/new" component={NewArt} auth={auth} />
            <PrivateRoute extract path="/arts/:id/edit" component={EditArt} auth={auth} />
            <PrivateRoute extract path="/arts/:id" component={Art} auth={auth} />
            <PrivateRoute extract path="/artists/new" component={NewArtist} auth={auth} />
            <PrivateRoute extract path="/artists/:id/edit" component={EditArtist} auth={auth} />
            <PrivateRoute extract path="/artists/:id" component={Artist} auth={auth} />
            <PrivateRoute extract path="/artists" component={Artists} auth={auth} />
            <PrivateRoute extract path="/" component={App} auth={auth} />
          </Switch>
        </div>
      </Router>
    </StrictMode>
  );
};
