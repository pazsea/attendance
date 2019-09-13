// ATT GÖRA HÄR:
// LADDNINGS IKONER, LÄGG TILL NOT LOGGED IN IKONER I KOMPONENTEN

// ----  { Libraries } ----
import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Context } from "../../context";

// ----  { Routes, ActionTypes etc. Custom variables. } ----
import * as ROUTES from "../../constants/routes";

// ----  { Styles } ----
import "./app.scss";

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
import SimpleBottomNavigation from "../Navigation/BottomNavigation";
import Loading from "../Loading";
// import AccountPage from "../Account";
// import PasswordForgetPage from "../PasswordForget";
// import SignInPage from "../SignIn";

const App = () => {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const [{ loggedIn }] = useContext(Context);

  useEffect(() => {
    firebase.isInitialized().then(val => {
      setFirebaseInitialized(val);
    });
  });

  return firebaseInitialized !== false ? (
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
          {/* <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} /> */}

          {/* <Route path={ROUTES.ACCOUNT} component={AccountPage} /> */}
        </Switch>
        {loggedIn ? (
          <div className="bottom_navigation">
            <SimpleBottomNavigation></SimpleBottomNavigation>
          </div>
        ) : null}
      </div>
    </Router>
  ) : (
    <Loading></Loading>
  );
};

export default App;
