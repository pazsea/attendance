//HOOKA UP DETTA TILL FIREBASE OCH DÖP OM ALLA CLASSNAMES

// ----  { Libraries } ----
import React, { useState, useContext } from "react";
// import { createStyles, makeStyles } from "@material-ui/core/styles";

// ----  { Routes, ActionTypes etc. Custom variables. } ----

// ----  { Styles } ----
import "./main_container.scss";

// ----  { Backend } ----

import firebase from "../../Firebase";
// ----  { Render Components } -----
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { Context } from "../../../context";
import Loading from "../../Loading";
import Icon from "@material-ui/core/Icon";
import Fab from "@material-ui/core/Fab";
import CreateClassModal from "../CreateClassModal";
import EditClassModal from "../EditClassModal";
import ClassContainer from "../../ClassContainer";
import InfoComponent from "../../../constants/InfoComponent";

export default function MainContainer(props) {
  const {
    myClasses: { loading, myClasses }
  } = props;

  const [createClassModalState, setCreateModalState] = useState(false);
  const [editClassModalState, setEditClassModalState] = useState({
    showModal: false,
    selectedClassUid: null
  });

  const {
    userDetailsObject: [{ userUid }]
  } = useContext(Context);

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
            myClasses.map(({ className, id }) => (
              <ClassContainer
                key={id}
                className={className}
                id={id}
                editThisClass={editThisClass}
                deleteFromDB={deleteFromDB}
              ></ClassContainer>
            ))
          ) : (
            <InfoComponent noMargin text="Du har inte skapat några klasser" />
          )}
        </Typography>
        <div className="addClassesDiv">
          <Fab
            color="secondary"
            aria-label="add"
            style={{ width: "60px", height: "60px" }}
            onClick={() => setCreateModalState(true)}
          >
            <Icon style={{ fontSize: 40 }}>add</Icon>
          </Fab>
        </div>
      </Container>
    </React.Fragment>
  );
}
