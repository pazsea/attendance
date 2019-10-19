// ----  { Libraries } ----
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../context";
// ----  { Routes, ActionTypes etc. Custom variables. } ----
// ----  { Styles } ----
// ----  { Backend } ----
import firebase from "../Firebase";

// ----  { Render Components } -----
import MainContainer from "./MainContainer";

const AdminMyClasses = () => {
  const [{ userUid }] = useContext(Context);

  const [myClasses, setMyClasses] = useState({
    loading: true,
    myClasses: null
  });

  // Här sker vår state subscription
  useEffect(() => {
    // console.log("USE EFFECT RUNS");
    const unsubcribe = firebase
      .user(userUid)
      .collection("myClasses")
      .onSnapshot(snapshot => {
        const empty = snapshot.empty;
        const val = snapshot.docs;
        if (empty) {
          setMyClasses({
            loading: false,
            myClasses: null
          });
        } else {
          const newData = val.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setMyClasses({
            loading: false,
            myClasses: newData
          });
        }
      });
    return () => unsubcribe();
  }, [userUid]);

  return (
    <div>
      <MainContainer myClasses={myClasses}></MainContainer>
    </div>
  );
};

export default AdminMyClasses;
