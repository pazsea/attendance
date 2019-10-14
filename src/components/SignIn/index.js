// ----  { Libraries } ----
import React, { useState, useContext } from "react";
import { withRouter, Link } from "react-router-dom";
import { Context } from "../../context";

// ----  { Routes, ActionTypes etc. Custom variables. } ----
import * as ROUTES from "../../constants/routes";

// ----  { Styles } ----
import "./sign_in_page.scss";

// ----  { Backend } ----
import firebase from "../Firebase";

// ----  { Render Components } -----
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const SignInPage = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userDetailsState, setUserDetails] = useContext(Context);

  async function login() {
    try {
      await firebase.login(email, password);
      await setUserDetails({
        userUid: firebase.getCurrentUid(),
        loggedIn: true
      });
      props.history.replace("/home");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <Container maxWidth="lg">
      <form className="sign_in_form" onSubmit={e => e.preventDefault()}>
        {/* <h2 style={{ textAlign: "center", textTransform: "uppercase" }}>
          Logga in:
        </h2> */}

        <TextField
          id="outlined-email-input"
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="E-Mail"
          margin="normal"
          variant="outlined"
        />

        <TextField
          id="outlined-password-input"
          label="Lösenord"
          type="password"
          autoComplete="current-password"
          margin="normal"
          variant="outlined"
          placeholder="Lösenord"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <p className="divider"></p>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          size="large"
          onClick={login}
        >
          LOGGA IN
        </Button>
        <p>
          <Link to={ROUTES.SIGN_UP}>Registrera dig här</Link>
        </p>
      </form>
    </Container>
  );
};

export default withRouter(SignInPage);
