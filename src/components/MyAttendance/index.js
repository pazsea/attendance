// ----  { Libraries } ----
import React, { useState, useEffect } from "react";
import Dropdown from "react-dropdown";
// ----  { Routes, ActionTypes etc. Custom variables. } ----

// ----  { Styles } ----
import {
  SCMyAttendanceContainer,
  SCStudentNameContainer,
  SCAlreadyAttending
} from "./styles";
import KyhLogo from "../../images/logos/kyh_logo.png";
import "react-dropdown/style.css";

// ----  { Backend } ----
import firebase from "../Firebase";
// ----  { Render Components } -----
import Loading from "../Loading";
import Button from "@material-ui/core/Button";

import moment from "moment";
import "moment/locale/sv";

const INITIAL_ATTENDINGSTUDENT_STATE = {
  isAlreadyAttending: false,
  hasLecturesToday: false,
  currentDate: null,
  errorAttendance: null,
  attendingState: {
    attendingName: false,
    attendingClassName: false,
    attendingDate: false,
    attendingClassUid: false
  }
};

const INITIAL_CLASSES_STATE = {
  selectedClass: {
    label: "Välj klass...",
    lectureDates: null,
    students: null,
    value: null
  },
  availableClasses: [],
  loading: true,
  errorClasses: null
};

const MyAttendance = () => {
  const [attendingStudentState, setAttendingStudentState] = useState(
    INITIAL_ATTENDINGSTUDENT_STATE
  );

  const [myClassesState, setMyClassesState] = useState(INITIAL_CLASSES_STATE);

  //Kollar om man användare redan anmält sig närvarande.
  useEffect(() => {
    const attendingStateStorage = localStorage.getItem("attendingState");
    const storageObject = JSON.parse(attendingStateStorage);

    const currentDateStartTime = new Date().setHours(0, 0, 0, 0);
    const currentDateEndTime = new Date().setHours(23, 59, 59, 0);
    console.log(currentDateStartTime);
    console.log(currentDateEndTime);

    // Try edit message

    // const validDate = () => {
    //   var acceptedDate = false;
    //   myClassesState.selectedClass.lectureDates.forEach(function(
    //     dateInArray
    //   ) {
    //     if (
    //       dateInArray >= currentDateStartTime &&
    //       dateInArray <= currentDateEndTime
    //     ) {
    //       return (acceptedDate = JSON.stringify(dateInArray));
    //     }
    //   });
    //   return acceptedDate;
    // };
    // console.log(validDate());

    // console.log(storageObjectDate + " " + currentDate);

    if (
      attendingStateStorage &&
      Number(storageObject.attendingDate) >= currentDateStartTime &&
      Number(storageObject.attendingDate) <= currentDateEndTime
    ) {
      setAttendingStudentState(prevState => ({
        ...prevState,
        isAlreadyAttending: true,
        attendingState: JSON.parse(attendingStateStorage)
      }));
    } else {
      localStorage.removeItem("attendingState");
      // console.log("REMOVE LS")
    }
  }, []);

  useEffect(() => {
    console.log("Starting listener from firebase");
    // GUSTAV: onSnapshot startar en lyssnare.'
    const unsubcribe = firebase.rootClassDetails().onSnapshot(snapshot => {
      let empty = snapshot.empty;
      let val = snapshot.docs;
      val.map(doc => console.log(doc.data()));
      if (empty) {
        setMyClassesState(prevState => ({
          ...prevState,
          errorClasses: "Inga klasser hittades...",
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
        setMyClassesState(prevState => ({
          ...prevState,
          availableClasses: dataReduce,
          loading: false
        }));
      }
    });
    // GUSTAV: Om vi använt get så hade vi inte behövt denna callback.
    return () => unsubcribe();
  }, [attendingStudentState.isAlreadyAttending]);

  //Checking if current date is included in the selected class lecture dates.
  useEffect(() => {
    console.log(
      "Checking if current date is included in picked class lecture dates.."
    );
    if (myClassesState.selectedClass.lectureDates) {
      const currentDateStartTime = new Date().setHours(0, 0, 0, 0);
      const currentDateEndTime = new Date().setHours(23, 59, 59, 0);
      console.log(currentDateStartTime);
      console.log(currentDateEndTime);

      // Try edit message

      const validDate = () => {
        var acceptedDate = false;
        myClassesState.selectedClass.lectureDates.forEach(function(
          dateInArray
        ) {
          if (
            dateInArray >= currentDateStartTime &&
            dateInArray <= currentDateEndTime
          ) {
            return (acceptedDate = JSON.stringify(dateInArray));
          }
        });
        return acceptedDate;
      };

      if (validDate()) {
        setAttendingStudentState(prevState => ({
          ...prevState,
          hasLecturesToday: true,
          currentDate: validDate()
        }));
      } else {
        setAttendingStudentState(prevState => ({
          ...prevState,
          hasLecturesToday: false,
          errorAttendance: "Denna klass har inga föreläsningar idag.."
        }));
      }
    }
  }, [myClassesState.selectedClass.lectureDates]);

  //GUSTAV: Tar fram den valda klassens
  const handleChange = selectedOption => {
    //GUSTAV: Tar fram de klasserna med samma namn som det man tryckt på.
    var findSelectedClass = myClassesState.availableClasses.filter(obj => {
      return obj.value === selectedOption.value;
    });
    // console.log({ ...findSelectedClass[0] });
    setMyClassesState({
      ...myClassesState,
      selectedClass: { ...findSelectedClass[0] }
    });
  };

  //GUSTAV: Skicka namnet på personen som registrerar sin närvaro till firebase.
  //GUSTAV: Spara dagens datum och elevens namn till local storage. (Checkas vid rendernig)

  async function addAttendant(selectedName) {
    let className = myClassesState.selectedClass.label;
    let date = attendingStudentState.currentDate;
    let classUid = myClassesState.selectedClass.value;

    const dataPath = firebase
      .classDetails(classUid)
      .collection("attendance")
      .doc(date);

    const studentNames = await firebase
      .classDetails(classUid)
      .get()
      .then(doc => {
        if (doc.exists) {
          return doc.data().students;
        } else {
          return null;
        }
      })
      .catch(function(error) {
        setAttendingStudentState(prevState => ({
          ...prevState,
          hasLecturesToday: false,
          errorAttendance: error
        }));
      });

    await dataPath
      .get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          dataPath.update({
            [selectedName]: true
          });
        } else {
          studentNames.forEach(studentName => {
            if (studentName === selectedName) {
              dataPath.set(
                {
                  [selectedName]: true
                },
                { merge: true }
              );
            } else {
              dataPath.set(
                {
                  [studentName]: false
                },
                { merge: true }
              );
            }
          });
        }
      })
      .then(function() {
        localStorage.setItem(
          "attendingState",
          JSON.stringify({
            attendingName: selectedName,
            attendingClassName: className,
            attendingClassUid: classUid,
            attendingDate: date
          })
        );
        setAttendingStudentState(prevState => ({
          ...prevState,
          isAlreadyAttending: true,
          attendingState: {
            attendingName: selectedName,
            attendingClassName: className,
            attendingClassUid: classUid,
            attendingDate: date
          }
        }));
      });
  }

  function removeAttendant() {
    const dataPath = firebase
      .classDetails(attendingClassUid)
      .collection("attendance")
      .doc(attendingDate);

    dataPath
      .update({
        [attendingName]: false
      })
      .then(function() {
        localStorage.removeItem("attendingState");
        setAttendingStudentState(INITIAL_ATTENDINGSTUDENT_STATE);
        setMyClassesState(INITIAL_CLASSES_STATE);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  const {
    availableClasses,
    selectedClass: { label, students },
    errorClasses,
    loading
  } = myClassesState;

  const {
    hasLecturesToday,
    isAlreadyAttending,
    errorAttendance,
    attendingState: {
      attendingClassName,
      attendingName,
      attendingClassUid,
      attendingDate
    }
  } = attendingStudentState;

  return (
    <SCMyAttendanceContainer>
      {loading ? (
        <Loading text="Hämtar in alla klasser...."></Loading>
      ) : isAlreadyAttending ? (
        <SCAlreadyAttending>
          <img src={KyhLogo} alt="KYH Logo"></img>
          <h3>Anmäld närvaro:</h3>

          <div className="studentStatusDiv">
            Namn: {attendingName}
            <br></br>
            Klass: {attendingClassName}
            <br></br>
            Datum:{" "}
            {new Date(Number(attendingDate) + 10000000)
              .toISOString()
              .slice(0, 10)}{" "}
          </div>
          <Button onClick={() => removeAttendant()}>Ångra närvaro?</Button>
        </SCAlreadyAttending>
      ) : (
        <>
          <div className="adminClassInfo">
            <span>
              <h1>Anmäl närvaro:</h1>
              <h3>
                {moment()
                  .format("ll")
                  .toUpperCase()}
              </h3>
            </span>
          </div>
          <Dropdown
            placeholder="Välj klass..."
            value={label}
            onChange={handleChange}
            options={availableClasses}
          />
          {errorClasses ? (
            <p style={{ fontWeight: "600", textAlign: "center" }}>
              {errorClasses}{" "}
            </p>
          ) : null}

          <SCStudentNameContainer>
            {hasLecturesToday ? (
              students.map((name, i) => (
                <Button key={i} onClick={() => addAttendant(name)}>
                  {name}
                  {/* <CheckIcon /> */}
                </Button>
              ))
            ) : (
              <p style={{ fontWeight: "600", textAlign: "center" }}>
                {errorAttendance}{" "}
              </p>
            )}
          </SCStudentNameContainer>
        </>
      )}
    </SCMyAttendanceContainer>
  );
};

export default MyAttendance;
