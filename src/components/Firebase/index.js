import app from "firebase/app";
import "firebase/auth";
import "firebase/firebase-firestore";

import * as SECRET from "./env.js";

const config = {
  apiKey: SECRET.API_KEY,
  authDomain: SECRET.AUTH_DOMAIN,
  databaseURL: SECRET.DATABASE_URL,
  projectId: SECRET.PROJECT_ID,
  storageBucket: SECRET.STORAGE_BUCKET,
  messagingSenderId: SECRET.MESSAGE_SENDER_ID,
  appId: SECRET.APP_ID
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
  }

  user = uid => this.db.doc(`users/${uid}`);
  users = () => this.db.collection("users");

  class = uid => this.db.doc(`classes/${uid}`);
  classes = () => this.db.collection(`classes/`);

  lectur = uid => this.db.doc(`lectures/${uid}`);
  lectures = () => this.db.collection(`lectures/`);

  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  async register(name, email, password) {
    await this.auth.createUserWithEmailAndPassword(email, password);
    return this.auth.currentUser.updateProfile({
      displayName: name
    });
  }

  addQuote(quote) {
    if (!this.auth.currentUser) {
      return alert("Not authorized");
    }

    return this.db
      .doc(`users_codedamn_video/${this.auth.currentUser.uid}`)
      .set({
        quote
      });
  }

  isInitialized() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(resolve);
    });
  }

  getCurrentUsername() {
    return this.auth.currentUser && this.auth.currentUser.displayName;
  }

  getCurrentUid() {
    return this.auth.currentUser.uid;
  }

  async getCurrentUserQuote() {
    const quote = await this.db
      .doc(`users_codedamn_video/${this.auth.currentUser.uid}`)
      .get();
    return quote.get("quote");
  }
}

export default new Firebase();
