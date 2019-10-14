// ----  { Libraries } ----
import React, { useState, useContext } from "react";
import { withRouter, Link } from "react-router-dom";
import { Context } from "../../context";

// ----  { Routes, ActionTypes etc. Custom variables. } ----
import * as ROUTES from "../../constants/routes";

// ----  { Styles } ----
import "./sign_up.scss";

// ----  { Backend } ----
import firebase from "../Firebase";

// ----  { Render Components } -----
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";

const SignUpPage = props => {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [userDetailsState, setUserDetails] = useContext(Context);

  async function onSubmit() {
    const fullName = firstName + " " + surname;
    try {
      await firebase.register(fullName, email, password);
      await firebase.user(firebase.getCurrentUid()).set({
        name: fullName,
        verified: false
      });
      await setUserDetails({
        userUid: firebase.getCurrentUid(),
        loggedIn: true
      });
      // await firebase.addQuote(quote);
      props.history.replace("/home");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <Container maxWidth="lg">
      <form className="signup_form" onSubmit={e => e.preventDefault()}>
        <TextField
          label="Förnamn"
          type="text"
          name="firstName"
          onChange={e => setFirstName(e.target.value)}
          required
          margin="normal"
          variant="outlined"
          placeholder="Förnamn"
          value={firstName}
        />

        <TextField
          label="Efternamn"
          type="text"
          name="surname"
          placeholder="Efternamn"
          value={surname}
          onChange={e => setSurname(e.target.value)}
          required
          margin="normal"
          variant="outlined"
        />

        <TextField
          id="outlined-email-input"
          label="Email"
          type="email"
          name="email"
          value={email}
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
          color="secondary"
          type="submit"
          size="large"
          onClick={onSubmit}
        >
          Registrera dig
        </Button>
        <p>
          <Link to={ROUTES.SIGN_IN}>Tillbaka till Logga in</Link>
        </p>
      </form>
    </Container>
  );
};

export default withRouter(SignUpPage);
