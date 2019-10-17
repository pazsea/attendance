//HOOKA UP DETTA TILL FIREBASE OCH DÖP OM ALLA CLASSNAMES

// ----  { Libraries } ----
import React, { useState, useContext, useEffect } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

// ----  { Routes, ActionTypes etc. Custom variables. } ----
import * as ROUTES from "../../../constants/routes";

// ----  { Styles } ----
import "./main_container.scss";

// ----  { Backend } ----

import firebase from "../../Firebase";
// ----  { Render Components } -----
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Fab from "@material-ui/core/Fab";
import { Context } from "../../../context";
import Loading from "../../Loading";
import CreateClassModal from "../CreateClassModal";
import EditClassModal from "../EditClassModal";

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

export default function MainContainer(props) {
  const {
    myClasses: { loading, myClasses }
  } = props;
  const classes = useStyles();
  const [createClassModalState, setCreateModalState] = useState(false);
  const [editClassModalState, setEditClassModalState] = useState({
    showModal: false,
    selectedClassUid: null
  });

  const [{ userUid }] = useContext(Context);
  useEffect(() => {
    console.log("EDIT STATET JUST NU " + editClassModalState);
  }, [editClassModalState]);

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

  const editThisClass = classUid => {
    setEditClassModalState({
      showModal: true,
      selectedClassUid: classUid
    });
  };

  return (
    <React.Fragment>
      {createClassModalState ? (
        <CreateClassModal
          createClassModalState={createClassModalState}
          closeModal={() => setCreateModalState(false)}
          openModal={() => setCreateModalState(true)}
        ></CreateClassModal>
      ) : null}
      {editClassModalState.showModal ? (
        <EditClassModal
          editClassModalState={editClassModalState.showModal}
          selectedClassUid={editClassModalState.selectedClassUid}
          closeModal={() => setEditClassModalState(false)}
          openModal={() => setEditClassModalState(true)}
        ></EditClassModal>
      ) : null}

      <Container className="container" maxWidth="md">
        <Typography component="div">
          {loading ? (
            <Loading text="Hämtar in dina klasser"></Loading>
          ) : myClasses ? (
            myClasses.map(schoolClass => (
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
                  onClick={() => editThisClass(schoolClass.id)}
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
            onClick={() => setCreateModalState(true)}
          >
            <Icon style={{ fontSize: 40 }}>add</Icon>
          </Fab>
        </div>
      </Container>
    </React.Fragment>
  );
}
