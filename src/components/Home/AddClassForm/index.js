// ----  { Libraries } ----
import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";

// ----  { Routes, ActionTypes etc. Custom variables. } ----

// ----  { Styles } ----
import "./add_class_modal.scss";

// ----  { Backend } ----
// import firebase from "../../Firebase";

// ----  { Render Components } -----
// import Button from "@material-ui/core/Button";
// import TextField from "@material-ui/core/TextField";
// import Avatar from "@material-ui/core/Avatar";
// import Chip from "@material-ui/core/Chip";
// import Icon from "@material-ui/core/Icon";
import AddLecturesModal from "../AddLecturesModal";
import AddStudentsModal from "../AddStudentsModal";

const INITIAL_STATE = {
  className: "",
  students: [],
  lectureDates: []
};

export default function AddClassForm(props) {
  const { addClassModalState, closeModal } = props;

  //THIS STATE HOLDS ALL DETAILS OF THE CLASS
  const [classDetails, setClassDetails] = useState(INITIAL_STATE);
  //
  //
  //
  //
  //
  //THESE STATES CONTROLS THE MODUL POPUPS ONLY
  const [lectureModalState, setLectureModalState] = useState(true);
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

  // const addNameToClass = event => {
  //   setClassDetails({
  //     ...classDetails,
  //     [event.target.name]: event.target.value
  //   });
  //   console.log(classDetails);
  // };

  //ADDERA OCH DELETE LECTURES DATES

  //FUNKTION FÖR ATT LÄGGA TILL NYA DATUM I LECTURE DATES ARRAYEN SAMT TA BORT
  const addDatesToClass = pickedDate => {
    const dates = classDetails.lectureDates;
    if (dates.includes(pickedDate)) {
      setClassDetails({
        ...classDetails,
        lectureDates: dates.filter(dateInArray => pickedDate !== dateInArray)
      });
    } else {
      setClassDetails({
        ...classDetails,
        //blir en helt ny array
        lectureDates: [pickedDate, ...dates]
      });
      
    }
  };

  // const deleteDatesFromClass = pickedDate => {
  //   setClassDetail({
  //     ...classDetails,
  //     lectureDates: [...classDetails.lectureDates, pickedDate]
  //   });
  // };

  return (
    <React.Fragment>
      {/* {lectureModalState ? (
        <AddLecturesModal
          lectureModalState={lectureModalState}
          setLectureModalState={() => setLectureModalState(false)}
        ></AddLecturesModal>
      ) : null} */}

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

      <Modal open={addClassModalState} onClose={closeModal}>
        <AddLecturesModal
          lectureModalState={lectureModalState}
          addDatesToClass={addDatesToClass}
          dates={classDetails.lectureDates}
          setLectureModalState={() => setLectureModalState(false)}
        ></AddLecturesModal>
        {/* <div className="add_class_container">
          <h2 id="simple-modal-title">Skapa klass</h2>

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
            <Button
              variant="contained"
              color="primary"
              type="button"
              size="large"
              margin="normal"
              onClick={() => setLectureModalState(true)}
            >
              Lägg till föreläsningstillfällen
            </Button>
            Antal föreläsningar: {classDetails.lectureDates.length} st.
            <p></p>
            <Button
              variant="contained"
              color="primary"
              type="button"
              margin="normal"
              size="large"
              onClick={() => setStudentsModalState(true)}
            >
              Lägg till elever
            </Button>
            Antal elever: {classDetails.students.length} st.
            <p className="divider"></p>
            <Button
              className="submitButton"
              variant="contained"
              color="secondary"
              type="submit"
              margin="normal"
              size="large"
            >
              SKAPA KLASS
            </Button>
          </form>
        </div> */}
      </Modal>
    </React.Fragment>
  );
}
