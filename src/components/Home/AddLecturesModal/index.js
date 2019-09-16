// ----  { Libraries } ----
import React from "react";
import Modal from "@material-ui/core/Modal";

// ----  { Routes, ActionTypes etc. Custom variables. } ----

// ----  { Styles } ----
import "./add_lectures_modal.scss";

// ----  { Backend } ----
import firebase from "../../Firebase";

// ----  { Render Components } -----
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import Icon from "@material-ui/core/Icon";

export default function AddLectureModal(props) {
  const { lectureModalState, setLectureModalState } = props;

  // STATES, CLASS NAME STATE ,NEW CLASS DETAILS STATE, OPEN LECTURE MODAL, OPEN ADD STUDENTS MODAL,

  return (
    <Modal open={lectureModalState} onClose={setLectureModalState}>
      <div className="add_class_container">
        <h2 id="simple-modal-title">Lägg till föreläsningsdatum</h2>

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

          <p className="divider"></p>
          <Button
            className="submitButton"
            variant="contained"
            color="secondary"
            type="submit"
            size="large"
          >
            SKAPA KLASS
          </Button>
        </form>
      </div>
    </Modal>
  );
}
