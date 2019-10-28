//HOOKA UP DETTA TILL FIREBASE OCH DÖP OM ALLA CLASSNAMES

// ----  { Libraries } ----
import React, { useContext } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

// ----  { Routes, ActionTypes etc. Custom variables. } ----
import * as ROUTES from "../../constants/routes";

// ----  { Styles } ----
import "./class_container.scss";

// ----  { Backend } ----

// ----  { Render Components } -----

import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Fab from "@material-ui/core/Fab";
import { Context } from "../../context";

const useStyles = makeStyles(theme =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
      width: "40px",
      height: "40px"
    },
    add: {
      position: "absolute",
      bottom: "0"
    },
    extendedIcon: {
      marginRight: theme.spacing(1)
    }
  })
);

const ClassContainer = ({ className, id, editThisClass, deleteFromDB }) => {
  const classes = useStyles();
  const {
    classDetailsObject: [, setGlobalClassDetails]
  } = useContext(Context);
  return (
    <div className="classesDiv" key={"div " + id}>
      <Button
        variant="contained"
        color="primary"
        classes={{ root: "classesButton", label: "classesLabel" }}
        to={ROUTES.ADMINCLASSATTENDANCE}
        onClick={() =>
          setGlobalClassDetails({ selectedClassUid: id, className: className })
        }
        component={Link}
        size="medium"
        key={"button class " + id}
      >
        {className}
      </Button>
      <Fab
        color="secondary"
        aria-label="edit"
        className={classes.fab}
        key={"fab " + id}
        onClick={() => editThisClass(id)}
      >
        <Icon>edit</Icon>
      </Fab>
      <Fab
        key={"delete button " + id}
        aria-label="delete"
        className={classes.fab}
        onClick={() => deleteFromDB(id)}
      >
        <Icon>delete</Icon>
      </Fab>
    </div>
  );
};

export default ClassContainer;
