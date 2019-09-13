// ----  { Libraries } ----
import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

// ----  { Routes, ActionTypes etc. Custom variables. } ----
import * as ROUTES from "../../../constants/routes";

// ----  { Styles } ----
import "./bottom_navigation.scss";

// ----  { Backend } ----
// ----  { Render Components } -----
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import Icon from "@material-ui/core/Icon";

const useStyles = makeStyles({
  root: {
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    bottom: 0,
    position: "absolute",
    padding: "1% 0",
    height: "12%",
    backgroundColor: "#3F51B5"
  }
});

export default function SimpleBottomNavigation() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      classes={{ root: "bottom_navigation" }}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction
        label="Hem"
        to={ROUTES.HOME}
        component={Link}
        classes={{
          selected: "selected_span",
          label: "label_span"
        }}
        icon={<Icon fontSize="large">home</Icon>}
      />

      <BottomNavigationAction
        label="Närvaro"
        classes={{
          selected: "selected_span",
          label: "label_span"
        }}
        icon={<Icon fontSize="large">emoji_people</Icon>}
      />
      <BottomNavigationAction
        label="Export"
        classes={{
          selected: "selected_span",
          label: "label_span"
        }}
        icon={<Icon fontSize="large">import_export</Icon>}
      />
      <BottomNavigationAction
        label="Mer"
        classes={{
          selected: "selected_span",
          label: "label_span"
        }}
        icon={<Icon fontSize="large">more_horiz</Icon>}
      />
    </BottomNavigation>
  );
}
