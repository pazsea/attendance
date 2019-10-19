// ----  { Libraries } ----
import React, { useContext } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Context } from "../../context";
import { makeStyles } from "@material-ui/core/styles";

// ----  { Routes, ActionTypes etc. Custom variables. } ----
import * as ROUTES from "../../constants/routes";

// ----  { Styles } ----
import "./navigation.scss";

// ----  { Backend } ----
import firebase from "../Firebase";

// ----  { Render Components } -----
import Icon from "@material-ui/core/Icon";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
// import IconButton from "@material-ui/core/IconButton";
// import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: "red"
  },
  title: {
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
    flexGrow: 1
  }
}));

const Navigation = props => {
  const classes = useStyles();
  const [{ loggedIn }, setUserDetails] = useContext(Context);
  async function logout() {
    await firebase.logout();
    setUserDetails([]);
    props.history.push("/");
  }

  return loggedIn ? (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h5" className={classes.title}>
          <Icon variant="rounded" fontSize="default">
            school
          </Icon>
          <span className="span_logo"> KYH</span>
        </Typography>
        {/* <Typography variant="h8" className={classes.title}>
            Inloggad:{" "}
            <br></br>
            <bold>
              <em>{firebase.getCurrentUsername()}</em>
            </bold>
          </Typography> */}
        <div className="navbar_links_desktop">
          <Button
            color="inherit"
            activeStyle={{
              color: "white"
            }}
            to={ROUTES.ADMINMYCLASSES}
            component={NavLink}
          >
            Klasser
          </Button>
          <Button
            color="inherit"
            activeStyle={{
              color: "white"
            }}
            to={ROUTES.ADMINCLASSATTENDANCE}
            component={NavLink}
          >
            Närvaro
          </Button>
          <Button
            color="inherit"
            to={ROUTES.ADMINEXPORT}
            activeStyle={{
              color: "white"
            }}
            component={NavLink}
          >
            Export
          </Button>
        </div>

        <Button
          color="secondary"
          component={NavLink}
          variant="contained"
          onClick={logout}
          to={ROUTES.MYATTENDANCE}
        >
          Logga ut
        </Button>
      </Toolbar>
    </AppBar>
  ) : (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h5" className={classes.title}>
          <Icon variant="rounded" fontSize="default">
            school
          </Icon>
          <NavLink to={ROUTES.MYATTENDANCE} className="span_logo">
            KYH
          </NavLink>
        </Typography>
        <div className="navbar_links">
          <Button
            color="inherit"
            activeStyle={{
              color: "white"
            }}
            to={ROUTES.MYATTENDANCE}
            exact
            path={ROUTES.MYATTENDANCE}
            component={NavLink}
          >
            Min Närvaro
          </Button>
          <Button
            color="inherit"
            activeStyle={{
              color: "white"
            }}
            to={ROUTES.CLASSATTENDANCE}
            component={NavLink}
          >
            Klassens Närvaro
          </Button>
        </div>
        <Button
          variant="outlined"
          color="inherit"
          to={ROUTES.SIGN_IN}
          component={NavLink}
        >
          Logga in
        </Button>
      </Toolbar>
    </AppBar>
  );
};
export default withRouter(Navigation);
