// ----  { Libraries } ----
import React, { useState, useEffect } from "react";
import Dropdown from "react-dropdown";
// ----  { Routes, ActionTypes etc. Custom variables. } ----

// ----  { Styles } ----
import {
  SCMyAttendanceContainer,
  SCStudentNameContainer,
  CheckIcon
} from "./styles";
import KyhLogo from "../../images/logos/kyh_logo.png";
import "react-dropdown/style.css";

// ----  { Backend } ----
import firebase from "../Firebase";
// ----  { Render Components } -----
import Loading from "../Loading";
import Button from "@material-ui/core/Button";

// Landingsida för icke inloggade

//VALID CLASS STATE behöver ha:
// CLASSUID
// NAMNEN PÅ STUDENTERNA
// GÖR EN TRANSACTIONS där du läser in vilka studenter det finns.

const MyAttendance = props => {
  const [attendingStudentState, setAttendingStudentState] = useState({
    hasLecturesToday: false
  });

  const [myAttendanceState, setMyAttendanceState] = useState({
    selectedClass: {
      label: "Välj klass...",
      lectureDates: [],
      value: null //
    },
    availableClasses: [],
    loading: false
  });

  // const {
  //   availableClasses,
  //   selectedClass: { label, students },
  //   noClassesMessage
  // } = myAttendanceState;

  useEffect(() => {
    const currentDate = new Date().setHours(0, 0, 0, 0);

    const currentDateIncluded = myAttendanceState.selectedClass.lectureDates.includes(
      currentDate
    );

    if (currentDateIncluded) {
      setAttendingStudentState({
        hasLecturesToday: true,
        currentDate: currentDate
      });
    } else {
      setAttendingStudentState({
        hasLecturesToday: false
      });
    }
    // console.log(consistentDates);
    // currentDate ===  myAttendanceState.selectedClass.lectureDates
  }, [myAttendanceState.selectedClass]);

  useEffect(() => {
    // onSnapshot startar en lyssnare.
    const unsubcribe = firebase.rootClassDetails().onSnapshot(snapshot => {
      let empty = snapshot.empty;
      let val = snapshot.docs;
      if (empty) {
        setMyAttendanceState(prevState => ({
          ...prevState,
          noClassesMessage: "Inga klasser hittade från databasen...",
          loading: false
        }));
      } else {
        const dataReduce = val.reduce((acc, doc) => {
          return [
            ...acc, //Är en tom array första gången
            {
              label: doc.data().className,
              value: doc.id,
              lectureDates: doc.data().lectureDates,
              students: doc.data().students
            }
          ];
        }, []);

        setMyAttendanceState(prevState => ({
          ...prevState,
          availableClasses: dataReduce,
          loading: false
        }));
      }
    });
    //Om vi använt get så hade vi inte behövt denna callback.
    return () => unsubcribe();
  }, []);

  const handleChange = selectedOption => {
    // Tar fram de klasserna med samma namn som det man tryckt på.
    var findSelectedClass = myAttendanceState.availableClasses.filter(obj => {
      return obj.value === selectedOption.value;
    });
    // console.log({ ...findSelectedClass[0] });
    setMyAttendanceState({
      ...myAttendanceState,
      selectedClass: { ...findSelectedClass[0] }
    });
  };

  // Skicka namnet på personen som registrerar sin närvaro till firebase.
  // Spara dagens datum och elevens namn till local storage. (Checkas vid rendernig)

  async function addAttendant(e, selectedName) {
    console.log("HELLOOOO");
    e.preventDefault();
    const date = JSON.stringify(attendingStudentState.currentDate);
    const classUid = myAttendanceState.selectedClass.value;
    const databasePath = firebase
      .classDetails(classUid)
      .collection("attendance")
      .doc(date);

    const studentNames = await firebase
      .classDetails(classUid)
      .get()
      .then(doc => {
        if (doc.exists) {
          return doc.data().students;
          // console.log("Document data:", doc.data().students);
        } else {
          // doc.data() will be undefined in this case
          return null;
        }
      })
      .catch(function(error) {
        //Lägg till ett error state när du implementerar funktionen på riktigt.
      });
    // console.log("HÄR KOMMER DATA " + data);
    if (studentNames) {
      firebase.db
        //Gusta läs på om
        .runTransaction(function(transaction) {
          return transaction.get(databasePath).then(function(attendanceDoc) {
            if (!attendanceDoc.exists) {
              // const batch = firebase.batch();
              studentNames.forEach(studentName => {
                if (studentName === selectedName) {
                  databasePath.set(
                    {
                      [selectedName]: true
                    },
                    { merge: true }
                  );
                } else {
                  databasePath.set(
                    {
                      [studentName]: false
                    },
                    { merge: true }
                  );
                }
              });
            } else {
              transaction.update(databasePath, {
                [selectedName]: true
              });
            }
          });
        })
        .then(function() {
          console.log("FUNKADE");
        })
        .catch(function(err) {
          console.error(err);
        });
    } else {
      //STATE DATABAS HITTADE INGA STUDENTER.
    }
  }

  const {
    availableClasses,
    selectedClass: { label, students },
    noClassesMessage
  } = myAttendanceState;

  const { hasLecturesToday } = attendingStudentState;

  return (
    <SCMyAttendanceContainer>
      {myAttendanceState.loading ? (
        <Loading text="Laddar klasser..."></Loading>
      ) : (
        <>
          <img src={KyhLogo} alt="KYH Logo"></img>
          <Dropdown
            placeholder="Välj klass..."
            value={label}
            onChange={handleChange}
            options={availableClasses}
          />
          {noClassesMessage ? <p>{noClassesMessage} </p> : null}
          {/* <div> */}
          <SCStudentNameContainer>
            {students
              ? students.map((name, i) => (
                  <Button key={i} onClick={e => addAttendant(e, name)}>
                    {name}
                    <CheckIcon />
                  </Button>
                ))
              : null}
          </SCStudentNameContainer>
          {/* </div> */}
        </>
      )}
    </SCMyAttendanceContainer>
  );
};

export default MyAttendance;

// state noLecturesToday
// DU HAR INGA FÖRELÄSNINGAR IDAG I FE18UX

// container med alla studentnamn

// state pickedStudentnam
// Patrick med x
// new Date(1569535200000)
