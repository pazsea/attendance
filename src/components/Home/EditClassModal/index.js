// ----  { Libraries } ----
import React, { useState, useEffect, useContext } from "react";
import Modal from "@material-ui/core/Modal";

// ----  { Routes, ActionTypes etc. Custom variables. } ----

// ----  { Styles } ----
import "./edit_class_modal.scss";

// ----  { Backend } ----
import firebase from "../../Firebase";

// ----  { Render Components } -----
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import AddLecturesModal from "../AddLecturesModal";
import AddStudentsModal from "../AddStudentsModal";
import PopUpHeader from "../../../constants/PopUpHeader";
import NotificationButton from "../../../constants/NotificationButton";
import { Context } from "../../../context";

const INITIAL_STATE = {
  className: "",
  students: [],
  lectureDates: []
};

export default function EditClassModal(props) {
  const { editClassModalState, closeModal, selectedClassUid } = props;
  const [{ userUid }] = useContext(Context);

  //State variablerna är lokala för componenten

  //THIS STATE HOLDS ALL DETAILS OF THE CLASS
  const [classDetails, setClassDetails] = useState(INITIAL_STATE);
  const [errorState, setErrorState] = useState(null);
  const [modificationState, setModificationState] = useState(false);

  //
  //
  //
  //
  //
  //THESE STATES CONTROLS THE MODUL POPUPS ONLY
  const [lectureModalState, setLectureModalState] = useState(false);
  const [studentsModalState, setStudentsModalState] = useState(false);
  //
  //
  //
  //
  //
  //THIS STATE IS JUST FOR INPUT FIELDS IN STUDENT
  const [preSubmitStudent, setPreSubmitStudent] = useState("");
  //
  //
  //
  //
  //

  // get hämtar(en eller flera idn) medan snapshot fungerar som en lyssnare.
  useEffect(() => {
    console.log("FIREBASE STARTAR HÄMTNING");
    //FIREBASE HÄMTNING SOM UPPDATERAR CLASSDETAILS STATET
    firebase.db
      .collection("classDetails")
      .doc(selectedClassUid)
      .get()
      .then(snapshot => {
        const details = snapshot.data(); //data är ett objekt..
        setClassDetails(details);
      });
  }, [selectedClassUid]);

  //ADDERA OCH DELETE STUDENTS FUNKTIONER.

  const addStudentToClass = (event, studentName) => {
    setClassDetails({
      ...classDetails,
      students: [...classDetails.students, studentName]
    });
    setPreSubmitStudent("");
    if (modificationState === false) {
      setModificationState(true);
    }
    event.preventDefault();
  };

  const deleteStudentFromClass = index => {
    setClassDetails({
      ...classDetails,
      students: classDetails.students.filter((_, i) => i !== index)
    });
    if (modificationState === false) {
      setModificationState(true);
    }
  };

  const addNameToClass = event => {
    setClassDetails({
      ...classDetails,
      [event.target.name]: event.target.value
    });
    if (modificationState === false) {
      setModificationState(true);
    }
    setErrorState(false);
    console.log(classDetails);
  };

  //FUNKTION FÖR ATT LÄGGA TILL NYA DATUM I LECTURE DATES ARRAYEN SAMT TA BORT

  const addDatesToClass = (calenderFunction, pickedDate) => {
    const dates = classDetails.lectureDates;
    setClassDetails({
      ...classDetails,
      lectureDates: calenderFunction(pickedDate, dates)
    });
    if (modificationState === false) {
      setModificationState(true);
    }
  };

  const promptUnsaved = () => {
    if (modificationState) {
      let answer = window.confirm(
        "Du har osparade ändringar, vill du ändå lämna?"
      );
      if (answer) {
        closeModal();
      } else {
        return;
      }
    } else {
      closeModal();
    }
  };

  const sendChangesToDB = () => {
    let sendStudents = classDetails.students;
    let sendClassName = classDetails.className;
    let sendLecturesDates = classDetails.lectureDates;
    console.log("SEND TO DB STARTADE");

    if (sendClassName === "") {
      return setErrorState("Klassnamn saknas");
    } else {
      let batch = firebase.db.batch();

      //set() skriver över om man inte har med merge
      let changeInClassDetails = firebase.db
        .collection("classDetails")
        .doc(selectedClassUid);

      batch.set(changeInClassDetails, {
        className: sendClassName,
        lectureDates: sendLecturesDates,
        students: sendStudents
      });

      let changeUserClassName = firebase.db
        .collection("users")
        .doc(userUid)
        .collection("myClasses")
        .doc(selectedClassUid);

      batch.set(changeUserClassName, {
        className: sendClassName
      });

      batch
        .commit()
        .then(function() {
          closeModal();
        })
        .catch(function(error) {
          setErrorState("Vi har just nu tekniska problem");
          console.error("ERROR MEDDELANDE: ", error);
        });
    }
  };

  return (
    <React.Fragment>
      {lectureModalState ? (
        <AddLecturesModal
          lectureModalState={lectureModalState}
          addDatesToClass={addDatesToClass}
          dates={classDetails.lectureDates}
          setLectureModalState={() => setLectureModalState(false)}
        ></AddLecturesModal>
      ) : null}

      {studentsModalState ? (
        <AddStudentsModal
          preSubmitStudent={preSubmitStudent}
          setPreSubmitStudent={setPreSubmitStudent}
          students={classDetails.students}
          addStudentToClass={addStudentToClass}
          deleteStudentFromClass={deleteStudentFromClass}
          studentsModalState={studentsModalState}
          setStudentsModalState={() => setStudentsModalState(false)}
        ></AddStudentsModal>
      ) : null}

      <Modal open={editClassModalState} onClose={() => promptUnsaved()}>
        <div className="add_class_container">
          <PopUpHeader
            color="#3f51b5"
            headerTitle="SKAPA KLASS"
            close={closeModal}
          ></PopUpHeader>

          <form className="add_class_form" onSubmit={e => e.preventDefault()}>
            <TextField
              id="outlined-email-input"
              label="Klassnamn"
              name="className"
              type="text"
              required
              margin="normal"
              variant="outlined"
              value={classDetails.className}
              onChange={addNameToClass}
            />

            <NotificationButton
              text="Lägg till föreläsningsdatum"
              quantity={classDetails.lectureDates.length}
              onClick={() => setLectureModalState(true)}
            ></NotificationButton>
            <p></p>
            <NotificationButton
              text="Lägg till elever"
              quantity={classDetails.students.length}
              onClick={() => setStudentsModalState(true)}
            ></NotificationButton>
            {errorState ? <p style={{ color: "red" }}>{errorState}</p> : null}
            <p className="divider"></p>
            <Button
              className="submitButton"
              variant="contained"
              color="secondary"
              type="submit"
              margin="normal"
              size="large"
              onClick={sendChangesToDB}
              disabled={!modificationState || !classDetails.className} //Bra knep!
            >
              REDIGERA KLASS
            </Button>
          </form>
        </div>
      </Modal>
    </React.Fragment>
  );
}
