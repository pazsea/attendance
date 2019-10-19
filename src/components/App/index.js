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
import MyAttendance from "../MyAttendance";
import SignUpPage from "../SignUp";

import ClassAttendance from "../ClassAttendance";

import SignInPage from "../SignIn";
import NotLoggedIn from "../NotLoggedIn";
import BottomNav from "../Navigation/BottomNav";

import AdminClassAttendance from "../AdminClassAttendance";
import AdminExport from "../AdminExport";

import AdminMyClasses from "../AdminMyClasses";
import AdminMore from "../AdminMore";
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
            path={ROUTES.MYATTENDANCE}
            component={loggedIn ? AdminMyClasses : MyAttendance}
          />

          {/* <Route
            path={ROUTES.ADMIN}
            component={loggedIn ? AdminPage : NotLoggedIn}
          /> */}
          <Route
            path={ROUTES.ADMINMYCLASSES}
            component={loggedIn ? AdminMyClasses : NotLoggedIn}
          />
          <Route
            path={ROUTES.ADMINCLASSATTENDANCE}
            component={loggedIn ? AdminClassAttendance : NotLoggedIn}
          />
          <Route
            path={ROUTES.ADMINEXPORT}
            component={loggedIn ? AdminExport : NotLoggedIn}
          />
          <Route
            path={ROUTES.ADMINMORE}
            component={loggedIn ? AdminMore : NotLoggedIn}
          />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.CLASSATTENDANCE} component={ClassAttendance} />
        </Switch>
        {loggedIn ? <BottomNav></BottomNav> : null}
      </div>
    </Router>
  );
};

export default App;
