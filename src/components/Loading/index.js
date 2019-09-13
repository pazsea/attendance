// ----  { Libraries } ----
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// ----  { Routes, ActionTypes etc. Custom variables. } ----
// ----  { Styles } ----
import "./loading.scss";
// ----  { Backend } ----
// ----  { Render Components } -----
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

const Loading = () => {
  const classes = useStyles();
  return (
    <div className="progress_bar">
      <div className={classes.root}>
        <p>Laddar....</p>
        <LinearProgress varian="query" />
      </div>
    </div>
  );
};

export default Loading;
