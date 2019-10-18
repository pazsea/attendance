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
import SentMessage from "../../SentMessage";
import NotificationButton from "../../../constants/NotificationButton";
import { Context } from "../../../context";

const INITIAL_CLASSDETAILS_STATE = {
  className: "",
  students: [],
  lectureDates: []
};

export default function CreateClassModal(props) {
  const { createClassModalState, closeModal } = props;
  const [{ userUid }] = useContext(Context);

  //THIS STATE HOLDS ALL DETAILS OF THE CLASS
  const [classDetails, setClassDetails] = useState(INITIAL_CLASSDETAILS_STATE);
  // const [errorState, setErrorState] = useState(null);
  // const [modificationState, setModificationState] = useState(false);

  const [statusState, setStatusState] = useState({
    modificationState: false,
    errorState: null,
    loading: true,
    sentStatus: false
  });

  // GÖR ETT SENT STATE FÖR AALLLLTT!
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
    if (classDetails === INITIAL_CLASSDETAILS_STATE) {
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
    if (statusState.modificationState === false) {
      setStatusState({
        ...statusState,
        modificationState: true
      });
    }
    event.preventDefault();
  };

  const deleteStudentFromClass = index => {
    setClassDetails({
      ...classDetails,
      students: classDetails.students.filter((_, i) => i !== index)
    });
    if (statusState.modificationState === false) {
      setStatusState({
        ...statusState,
        modificationState: true
      });
    }
  };

  const addNameToClass = event => {
    setClassDetails({
      ...classDetails,
      [event.target.name]: event.target.value
    });
    if (statusState.modificationState === false) {
      console.log("DU KOMMER IN");
      setStatusState({
        ...statusState,
        modificationState: true,
        errorState: false
      });
    } else {
      setStatusState({
        ...statusState,
        errorState: false
      });
    }

    console.log(classDetails);
  };

  //FUNKTION FÖR ATT LÄGGA TILL NYA DATUM I LECTURE DATES ARRAYEN SAMT TA BORT

  const addDatesToClass = (calenderFunction, pickedDate) => {
    const dates = classDetails.lectureDates;
    setClassDetails({
      ...classDetails,
      lectureDates: calenderFunction(pickedDate, dates)
    });
    if (statusState.modificationState === false) {
      setStatusState({
        ...statusState,
        modificationState: true
      });
    }
  };

  const promptUnsaved = () => {
    if (statusState.modificationState) {
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
  const sendToDB = () => {
    let sendStudents = classDetails.students;
    let sendClassName = classDetails.className;
    let sendLecturesDates = classDetails.lectureDates;
    console.log("SEND TO DB STARTADE");
    if (sendClassName === "") {
      return setStatusState({
        ...statusState,
        errorState: "Klassnamn saknas."
      });
    } else {
      firebase
        .user(userUid) //Går in på nuletande inloggade personen via Context
        .collection("myClasses")
        .add({
          className: [classDetails.className] //Lägger till ett unikt ID med klassnamn
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
              setStatusState({
                ...statusState,
                sentStatus: true
              });
              setTimeout(() => {
                localStorage.removeItem("classDetails");
                closeModal();
              }, 2000);
            })
            .catch(function(error) {
              setStatusState({
                ...statusState,
                errorState: "Vi har just nu tekniska problem."
              });
              console.error("Felmeddelande: ", error);
            });
        })
        .catch(function(error) {
          setStatusState({
            ...statusState,
            errorState: "Vi har just nu tekniska problem."
          });
          console.error("Fel när data skulle skickas till databas: ", error);
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

      <Modal open={createClassModalState} onClose={() => promptUnsaved()}>
        <div className="add_class_container">
          <PopUpHeader
            color="#3f51b5"
            headerTitle="SKAPA KLASS"
            close={closeModal}
          ></PopUpHeader>
          {statusState.sentStatus ? (
            <SentMessage text="Klass skapad"></SentMessage>
          ) : null}

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
              text="Välj föreläsningsdatum"
              quantity={classDetails.lectureDates.length}
              onClick={() => setLectureModalState(true)}
            ></NotificationButton>

            <NotificationButton
              text="Lägg till elever"
              quantity={classDetails.students.length}
              onClick={() => setStudentsModalState(true)}
            ></NotificationButton>
            {statusState.errorState ? (
              <p style={{ color: "red" }}>{statusState.errorState}</p>
            ) : null}
            <p className="divider"></p>
            <Button
              className="submitButton"
              variant="contained"
              color="secondary"
              type="submit"
              margin="normal"
              size="large"
              onClick={sendToDB}
              disabled={!classDetails.className} //Bra knep!
            >
              SKAPA KLASS
            </Button>
          </form>
        </div>
      </Modal>
    </React.Fragment>
  );
}
