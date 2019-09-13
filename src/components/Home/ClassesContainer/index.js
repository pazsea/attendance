//HOOKA UP DETTA TILL FIREBASE OCH DÖP OM ALLA CLASSNAMES

// ----  { Libraries } ----
import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Link, withRouter } from "react-router-dom";

// ----  { Routes, ActionTypes etc. Custom variables. } ----
import * as ROUTES from "../../../constants/routes";

// ----  { Styles } ----
import "./classes_container.scss";

// ----  { Backend } ----
// ----  { Render Components } -----
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Fab from "@material-ui/core/Fab";

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

export default function ClassesContainer(props) {
  const { loading, myClasses } = props;
  const classes = useStyles();
  return (
    <React.Fragment>
      <Container className="container" maxWidth="md">
        <Typography component="div">
          {loading ? (
            <div>
              {/* <div>Laddar.....</div> */}

              <div className="classesDiv">
                <Button
                  variant="contained"
                  color="primary"
                  classes={{ root: "classesButton", label: "classesLabel" }}
                  // className={classes.button}
                  to={ROUTES.HOME}
                  component={Link}
                  size="large"
                >
                  FE 18
                </Button>
                <Fab
                  color="secondary"
                  aria-label="edit"
                  className={classes.fab}
                >
                  <Icon>edit</Icon>
                </Fab>
                <Fab aria-label="delete" className={classes.fab}>
                  <Icon>delete</Icon>
                </Fab>
              </div>
            </div>
          ) : myClasses ? (
            myClasses.map(schoolClass => (
              <div key={"div " + schoolClass.id} className="classesDiv">
                <Button
                  variant="contained"
                  color="primary"
                  classes={{ root: "classesDiv" }}
                  // className={classes.button}
                  key={"button " + schoolClass.id}
                  to={ROUTES.HOME}
                  component={Link}
                >
                  {schoolClass.name}
                </Button>
              </div>
            ))
          ) : (
            <div>Du har inga klasser</div>
          )}
        </Typography>
        <div className="addClassesDiv">
          <Fab
            color="secondary"
            aria-label="add"
            style={{ width: "60px", height: "60px" }}
            // className={{ root: "addClassesDiv" }}
          >
            <Icon style={{ fontSize: 40 }}>add</Icon>
          </Fab>
        </div>
      </Container>
    </React.Fragment>
  );
}
