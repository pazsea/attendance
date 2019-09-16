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

  // STATES, CLASS NAME STATE ,NEW CLASS DETAILS STATE, OPEN LECTURE MODAL, OPEN ADD STUDENTS MODAL,

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
              type="text"
              name="text"
              required
              placeholder="text"
              margin="normal"
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              type="button"
              size="large"
              margin="normal"
              onClick={() => setLectureModalState(true)}
            >
              Lägg till föreläsningsdatum
            </Button>{" "}
            <Button
              variant="contained"
              color="primary"
              type="button"
              margin="normal"
              size="large"
              onClick={() => setStudentsModalState(true)}
            >
              Lägg till elever
            </Button>{" "}
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
