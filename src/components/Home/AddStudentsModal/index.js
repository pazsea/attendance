// ----  { Libraries } ----
import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
// ----  { Routes, ActionTypes etc. Custom variables. } ----
// ----  { Styles } ----
import "./add_students_modal.scss";
// ----  { Backend } ----
import firebase from "../../Firebase";
// ----  { Render Components } -----
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import Icon from "@material-ui/core/Icon";
// import FaceIcon from "@material-ui/icons/Face";

export default function AddStudentsModal(props) {
  const {
    studentsModalState,
    setStudentsModalState,
    addStudentToClass,
    deleteStudentFromClass,
    students,
    preSubmitStudent,
    setPreSubmitStudent
  } = props;
  //Deconstructing här gör att man slipper props. prefix.

  // STATES, CLASS NAME STATE ,NEW CLASS DETAILS STATE, OPEN Students MODAL, OPEN ADD STUDENTS MODAL,

  return (
    <Modal open={studentsModalState} onClose={setStudentsModalState}>
      <div className="add_students_container">
        <h2 id="simple-modal-title">Lägg till elever</h2>

        <form
          className="add_students_form_column"
          onSubmit={event => addStudentToClass(event, preSubmitStudent)}
        >
          <TextField
            id="outlined-email-input"
            label="Student namn"
            type="text"
            name="studentNamn"
            required
            placeholder="Student namn"
            margin="normal"
            variant="outlined"
            onChange={event => setPreSubmitStudent(event.target.value)}
            value={preSubmitStudent}
          />
          <div className="chip_container">
            {students.length > 0 ? (
              students.map((student, index) => (
                <Chip
                  className="student_chip"
                  key={student + index}
                  // icon={<FaceIcon />}
                  label={student}
                  // onClick={handleClick}
                  onDelete={() => deleteStudentFromClass(index)}
                />
              ))
            ) : (
              <p>Du har inga studenter </p>
            )}
          </div>
          <p className="divider"></p>
          <Button
            className="submitButton"
            variant="contained"
            color="secondary"
            type="submit"
            size="large"
          >
            Lägg till elever
          </Button>
        </form>
      </div>
    </Modal>
  );
}
