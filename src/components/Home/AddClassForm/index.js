// ----  { Libraries } ----
import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";

// ----  { Routes, ActionTypes etc. Custom variables. } ----

// ----  { Styles } ----
import "./add_class_modal.scss";

// ----  { Backend } ----
import firebase from "../../Firebase";

// ----  { Render Components } -----
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import Icon from "@material-ui/core/Icon";
import AddLecturesModal from "../AddLecturesModal";
import AddStudentsModal from "../AddStudentsModal";

export default function AddClassForm(props) {
  const { addClassModalState, closeModal } = props;

  const [lectureModalState, setLectureModalState] = useState(false);
  const [studentsModalState, setStudentsModalState] = useState(false);

  const [classDetails, setClassDetails] = useState({
    className: "",
    students: [],
    lectureDates: [{ 120201: true }]
  });

  const addStudentToClass = (event, studentName) => {
    setClassDetails({
      ...classDetails,
      students: [...classDetails.students, studentName]
    });
    event.preventDefault();
  };

  const deleteStudentFromClass = index => {
    setClassDetails({
      ...classDetails,
      students: classDetails.students.filter((_, i) => i !== index)
    });
  };

  // STATES, CLASS NAME STATE ,NEW CLASS DETAILS STATE, OPEN LECTURE MODAL, OPEN ADD STUDENTS MODAL,

  const addNameToClass = event => {
    setClassDetails({
      ...classDetails,
      [event.target.name]: event.target.value
    });
    console.log(classDetails);
  };

  return (
    <React.Fragment>
      {lectureModalState ? (
        <AddLecturesModal
          lectureModalState={lectureModalState}
          setLectureModalState={() => setLectureModalState(false)}
        ></AddLecturesModal>
      ) : null}

      {studentsModalState ? (
        <AddStudentsModal
          students={classDetails.students}
          addStudentToClass={addStudentToClass}
          deleteStudentFromClass={deleteStudentFromClass}
          studentsModalState={studentsModalState}
          setStudentsModalState={() => setStudentsModalState(false)}
        ></AddStudentsModal>
      ) : null}

      <Modal open={addClassModalState} onClose={closeModal}>
        <div className="add_class_container">
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
        </div>
      </Modal>
    </React.Fragment>
  );
}
