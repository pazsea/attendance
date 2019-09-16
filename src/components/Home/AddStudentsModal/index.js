// ----  { Libraries } ----
import React from "react";
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

export default function AddStudentsModal(props) {
  const { studentsModalState, setStudentsModalState } = props;

  // STATES, CLASS NAME STATE ,NEW CLASS DETAILS STATE, OPEN Students MODAL, OPEN ADD STUDENTS MODAL,

  return (
    <Modal open={studentsModalState} onClose={setStudentsModalState}>
      <div className="add_students_container">
        <h2 id="simple-modal-title">Lägg till elever</h2>

        <form className="add_students_form" onSubmit={e => e.preventDefault()}>
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
