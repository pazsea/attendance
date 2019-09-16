// ----  { Libraries } ----
import React from "react";
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

export default function AddClassForm(props) {
  const { openModalState, closeModal } = props;

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={openModalState}
      onClose={closeModal}
    >
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

          <TextField
            id="outlined-email-input"
            label="Namn på elev"
            type="text"
            name="text"
            // required
            placeholder="text"
            margin="normal"
            variant="outlined"
          />

          <p>Elevlista komplett</p>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
          >
            Lägg till elev
          </Button>

          {/* <Chip
            label="Custom delete icon Chip"
            // onClick={handleClick}
            // onDelete={handleDelete}
            // className={classes.chip}
            deleteIcon={<Icon>Done</Icon>}
          /> */}
        </form>
      </div>
    </Modal>
  );
}
