// ----  { Libraries } ----
import React, { useState, useEffect, useContext } from "react";
import Modal from "@material-ui/core/Modal";

// ----  { Routes, ActionTypes etc. Custom variables. } ----

// ----  { Styles } ----
import "./add_class_modal.scss";

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

export default function CreateClassModal(props) {
  const { createClassModalState, closeModal } = props;
  const [{ userUid }] = useContext(Context);

  //THIS STATE HOLDS ALL DETAILS OF THE CLASS
  const [classDetails, setClassDetails] = useState(INITIAL_STATE);
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
  //THIS STATE HOLDS THE CURRENT DATE SELECTION FOR CLASSES
  // const [preSubmitDates, setPreSubmitDates] = useState("");
  //
  //
  //
  //
  //
  useEffect(() => {
    if (classDetails === INITIAL_STATE) {
      return;
    } else {
      localStorage.setItem("classDetails", JSON.stringify(classDetails));
    }
  }, [classDetails]);

  useEffect(() => {
    const details = localStorage.getItem("classDetails");
    if (details) {
      setClassDetails(JSON.parse(details));
    }
  }, []);
  // [] i detta fallet beter sig som componentDidMount(). Tomt = renderar om på alla ändringar.

  //ADDERA OCH DELETE STUDENTS FUNKTIONER.

  const addStudentToClass = (event, studentName) => {
    setClassDetails({
      ...classDetails,
      students: [...classDetails.students, studentName]
    });
    setPreSubmitStudent("");
    event.preventDefault();
  };

  const deleteStudentFromClass = index => {
    setClassDetails({
      ...classDetails,
      students: classDetails.students.filter((_, i) => i !== index)
    });
  };

  const addNameToClass = event => {
    setClassDetails({
      ...classDetails,
      [event.target.name]: event.target.value
    });
    console.log(classDetails);
  };

  //FUNKTION FÖR ATT LÄGGA TILL NYA DATUM I LECTURE DATES ARRAYEN SAMT TA BORT

  const addDatesToClass = (calenderFunction, pickedDate) => {
    const dates = classDetails.lectureDates;
    setClassDetails({
      ...classDetails,
      lectureDates: calenderFunction(pickedDate, dates)
    });
  };

  const sendToDB = () => {
    let sendStudents = classDetails.students;
    let sendClassName = classDetails.className;
    let sendLecturesDates = classDetails.lectureDates;
    console.log("SEND TO DB STARTADE");
    firebase
      .user(userUid) //Går in på nuletande inloggade personen via Context
      .collection("myClasses")
      .add({
        name: [classDetails.className] //Lägger till ett unikt ID med klassnamn
      })
      .then(function(docRef) {
        let classUid = docRef.id; // hämtar ut för den klassen som just lades till
        let batch = firebase.db.batch(); //Batch är ny grej för firestore.

        let nameInMyClasses = firebase // MyClasses för för de klasser jag skapat
          .classDetails(classUid);

        batch.set(nameInMyClasses, {
          className: sendClassName,
          students: sendStudents,
          lectureDates: sendLecturesDates
        }); // Lägger till klassnamn

        // sendLecturesDates.forEach(lectureTime => {
        //   let addLectures = firebase
        //     .lecture(classUid)
        //     .collection("dates")
        //     .doc();
        //   batch.set(addLectures, {
        //     time: lectureTime
        //   });
        // });

        batch
          .commit()
          .then(function() {
            console.log("GICK IVÄG");
          })
          .catch(function(error) {
            console.error("NÅGOT GICK FEL ", error);
          });
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
    console.log("SEND TO DB SLUTADE");
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

      <Modal open={createClassModalState} onClose={closeModal}>
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
            <p className="divider"></p>
            <Button
              className="submitButton"
              variant="contained"
              color="secondary"
              type="submit"
              margin="normal"
              size="large"
              onClick={sendToDB}
            >
              SKAPA KLASS
            </Button>
          </form>
        </div>
      </Modal>
    </React.Fragment>
  );
}

// SKAPA KLASS
// 1. EN UID I USERS > "MY UID" > MY CLASSES > "CLASS UID" = TRUE
// 2. EN UID I CLASSES > CLASS NAME + STUDENTS = TRUE ARRAY + LECTURES = TRUE ARRAY
// 3. EN UID I LECTURES + TIME JS OCH ATTENDANCE
