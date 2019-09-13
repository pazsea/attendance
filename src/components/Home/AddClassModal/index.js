// ----  { Libraries } ----
import React, { useState, useContext } from "react";
import { withRouter, Link } from "react-router-dom";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

// ----  { Routes, ActionTypes etc. Custom variables. } ----

// ----  { Styles } ----

// ----  { Backend } ----
import firebase from "../../Firebase";

// ----  { Render Components } -----
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import Icon from "@material-ui/core/Icon";

// import FaceIcon from '@material-ui/icons/Face';
// import DoneIcon from '@material-ui/icons/Done';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      padding: theme.spacing(1),
      alignItems: "center",
      justifyContent: "center"
    },
    paper: {
      justifyContent: "center",
      // position: "absolute",
      width: 500,
      height: "80%",
      margin: "2% auto 0 auto",
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    },
    root: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap"
    },
    chip: {
      margin: theme.spacing(1)
    }
  })
);

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render

  const { openModalState, closeModal } = props;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={openModalState}
        onClose={closeModal}
      >
        <div className={classes.paper}>
          <h2 id="simple-modal-title">Skapa klass</h2>
          <Container maxWidth="lg">
            <form className="sign_in_form" onSubmit={e => e.preventDefault()}>
              {/* <h2 style={{ textAlign: "center", textTransform: "uppercase" }}>
          Logga in:
        </h2> */}
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
              {/* <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
              >
                Patrick
              </Button> */}

              <p>Elevlista komplett</p>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
              >
                Lägg till elev
              </Button>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
              >
                Patrick
              </Button>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
              >
                Patrick
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
              >
                Patrick
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
              >
                Patrick
              </Button>

              <Chip
                label="Custom delete icon Chip"
                // onClick={handleClick}
                // onDelete={handleDelete}
                className={classes.chip}
                deleteIcon={<Icon>Done</Icon>}
              />
            </form>
          </Container>
        </div>
      </Modal>
    </div>
  );
}
