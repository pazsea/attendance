// ATT GÖRA HÄR:
// LADDNINGS IKONER, LÄGG TILL NOT LOGGED IN IKONER I KOMPONENTEN

// ----  { Libraries } ----
import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Context } from "../../context";

// ----  { Routes, ActionTypes etc. Custom variables. } ----
import * as ROUTES from "../../constants/routes";

// ----  { Styles } ----

// ----  { Backend } ----
import firebase from "../Firebase";

// ---- { Render Components } -----
import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import HomePage from "../Home";
import AdminPage from "../Admin";
import SignInPage from "../SignIn";
import NotLoggedIn from "../NotLoggedIn";
import BottomNav from "../Navigation/BottomNav";

// import AccountPage from "../Account";
// import PasswordForgetPage from "../PasswordForget";
// import SignInPage from "../SignIn";

const App = () => {
  const [{ loggedIn }] = useContext(Context);

  useEffect(() => {
    firebase.isInitialized();
  });

  return (
    <Router>
      <div>
        <Navigation />
        <Switch>
          <Route
            exact
            path={ROUTES.LANDING}
            component={loggedIn ? HomePage : LandingPage}
          />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route
            path={ROUTES.ADMIN}
            component={loggedIn ? AdminPage : NotLoggedIn}
          />
          <Route
            path={ROUTES.HOME}
            component={loggedIn ? HomePage : NotLoggedIn}
          />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        </Switch>
        {loggedIn ? <BottomNav></BottomNav> : null}
      </div>
    </Router>
  );
};

export default App;
