// ----  { Libraries } ----
import React from "react";
import { Link } from "react-router-dom";

// ----  { Routes, ActionTypes etc. Custom variables. } ----
import * as ROUTES from "../../constants/routes";

// ----  { Styles } ----
import "./not_logged_in.scss";
// ----  { Backend } ----
// ----  { Render Components } -----
import Button from "@material-ui/core/Button";

const NotLoggedIn = () => {
  return (
    <div className="notLogged_container">
      <h5>
        <em>Skyddad sida.</em>
        <br></br>
        Du måste logga in...
      </h5>
      <Button
        variant="contained"
        color="primary"
        to={ROUTES.SIGN_IN}
        component={Link}
      >
        Logga in
      </Button>
    </div>
  );
};

export default NotLoggedIn;
