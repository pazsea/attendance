//HOOKA UP DETTA TILL FIREBASE OCH DÖP OM ALLA CLASSNAMES

// ----  { Libraries } ----
import React, { useState, useContext } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

// ----  { Routes, ActionTypes etc. Custom variables. } ----
import * as ROUTES from "../../../constants/routes";

// ----  { Styles } ----
import "./classes_container.scss";

// ----  { Backend } ----

import firebase from "../../Firebase";
// ----  { Render Components } -----
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Fab from "@material-ui/core/Fab";
import AddClassForm from "../AddClassForm";
import { Context } from "../../../context";

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
  const {
    myClasses: { loading, myClasses }
  } = props;
  const classes = useStyles();
  const [addClassModalState, setAddClassModal] = useState(false);
  const [{ userUid }] = useContext(Context);

  const deleteFromDB = classUid => {
    let batch = firebase.db.batch();

    let deleteInClassDetails = firebase.classDetails(classUid);

    batch.delete(deleteInClassDetails);

    let deleteInUserMyClasses = firebase
      .user(userUid)
      .collection("myClasses")
      .doc(classUid);
    batch.delete(deleteInUserMyClasses);

    batch
      .commit()
      .then(function() {
        console.log("GICK IVÄG");
      })
      .catch(function(error) {
        console.error("NÅGOT GICK FEL ", error);
      });
  };

  return (
    <React.Fragment>
      {addClassModalState ? (
        <AddClassForm
          addClassModalState={addClassModalState}
          closeModal={() => setAddClassModal(false)}
          openModal={() => setAddClassModal(true)}
        ></AddClassForm>
      ) : null}

      <Container className="container" maxWidth="md">
        <Typography component="div">
          {loading ? (
            <div>
              <div>Hämtar klasser.....</div>
            </div>
          ) : myClasses ? (
            myClasses.map((schoolClass, index) => (
              <div className="classesDiv" key={"div " + schoolClass.id}>
                <Button
                  variant="contained"
                  color="primary"
                  classes={{ root: "classesButton", label: "classesLabel" }}
                  to={ROUTES.HOME}
                  component={Link}
                  size="medium"
                  key={"button class " + schoolClass.id}
                >
                  {schoolClass.name}
                </Button>
                <Fab
                  color="secondary"
                  aria-label="edit"
                  className={classes.fab}
                  key={"fab " + schoolClass.id}
                >
                  <Icon>edit</Icon>
                </Fab>
                <Fab
                  key={"delete button " + schoolClass.id}
                  aria-label="delete"
                  className={classes.fab}
                  onClick={() => deleteFromDB(schoolClass.id)}
                >
                  <Icon>delete</Icon>
                </Fab>
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
            onClick={() => setAddClassModal(true)}
          >
            <Icon style={{ fontSize: 40 }}>add</Icon>
          </Fab>
        </div>
      </Container>
    </React.Fragment>
  );
}
