// ----  { Libraries } ----
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../context";
// ----  { Routes, ActionTypes etc. Custom variables. } ----
// ----  { Styles } ----
// ----  { Backend } ----
import firebase from "../Firebase";

// ----  { Render Components } -----
import ClassesContainer from "./ClassesContainer";

const Home = () => {
  const [{ uid }] = useContext(Context);

  const [loading, setLoading] = useState(true);
  const [myClasses, setMyClasses] = useState(false);
  // console.log("UTANFÖR " + uid);

  // useEffect(() => {
  //   const unsubcribe = firebase
  //     .user(uid)
  //     .collection("myClasses")
  //     .onSnapshot(snapshot => {
  //       const val = snapshot.docs;
  //       if (val.length > 0) {
  //         const newData = val.map(doc => ({
  //           id: doc.id,
  //           ...doc.data()
  //         }));
  //         setMyClasses(newData);
  //       }
  //       setLoading(false);
  //     });

  //   return () => unsubcribe;
  // }, [uid]);

  return (
    <div>
      <ClassesContainer
        loading={loading}
        myClasses={myClasses}
      ></ClassesContainer>
    </div>
  );
};

export default Home;
