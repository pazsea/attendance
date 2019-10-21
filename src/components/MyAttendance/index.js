import React, { useState, useEffect } from "react";
import Dropdown from "react-dropdown";
import { SCMyAttendanceContainer } from "./styles";
import Loading from "../Loading";

import firebase from "../Firebase";
import "react-dropdown/style.css";

const MyAttendance = props => {
  const [myAttendanceState, setMyAttendanceState] = useState({
    selectedClass: {
      statusMessage: String,
      label: "Välj klass...",
      classUid: String,
      lectureTime: Number,
      students: []
    },
    options: [],
    loading: false
  });

  useEffect(() => {
    console.log(myAttendanceState);
    // myAttendanceState.options.map(option => {
    //   console.log(option);
    // });
  }, [myAttendanceState]);

  useEffect(() => {
    // console.log("USE EFFECT RUNS");
    const unsubcribe = firebase.rootClassDetails().onSnapshot(snapshot => {
      let empty = snapshot.empty;
      let val = snapshot.docs;
      if (empty) {
        return;
      } else {
        // console.log(val);
        // const newData = val.map(doc => [
        //   ...newData,
        //   {
        //     name: doc.id,
        //     label: doc.data().className
        //   }
        // ]);

        // setMyAttendanceState({
        //   ...myAttendanceState,
        //   options: [newData],
        //   loading: false
        // });

        const dataReduce = val.reduce((acc, doc) => {
          return [
            ...acc,
            {
              label: doc.data().className,
              value: doc.id,
              name: doc.data().className,
              lectureDates: doc.data().lectureDates
            }
          ];
        }, []);

        setMyAttendanceState({
          ...myAttendanceState,
          options: dataReduce,
          loading: false
        });
      }
    });
    return () => unsubcribe();
  }, []);

  const handleChange = selectedOption => {
    console.log(selectedOption);
    var findSelectedClass = myAttendanceState.options.filter(obj => {
      return obj.value === selectedOption.value;
    });
    // console.log({ ...findSelectedClass[0] });
    setMyAttendanceState({
      ...myAttendanceState,
      selectedClass: { ...findSelectedClass[0] }
    });
  };
  return (
    <SCMyAttendanceContainer>
      {myAttendanceState.loading ? (
        <Loading text="Laddar klasser..."></Loading>
      ) : (
        <Dropdown
          placeholder="Välj klass..."
          value={myAttendanceState.selectedClass.label}
          onChange={handleChange}
          options={myAttendanceState.options}
        />
      )}
    </SCMyAttendanceContainer>
  );
};

export default MyAttendance;
