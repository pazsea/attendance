// ----  { Libraries } ----
import React, { useState, useEffect } from "react";
import Dropdown from "react-dropdown";
// ----  { Routes, ActionTypes etc. Custom variables. } ----

// ----  { Styles } ----
import {
  SCMyAttendanceContainer,
  SCStudentNameContainer,
  CheckIcon,
  SCAlreadyAttending
} from "./styles";
import KyhLogo from "../../images/logos/kyh_logo.png";
import "react-dropdown/style.css";

// ----  { Backend } ----
import firebase from "../Firebase";
// ----  { Render Components } -----
import Loading from "../Loading";
import Button from "@material-ui/core/Button";

const INITIAL_ATTENDINGSTUDENT_STATE = {
  isAlreadyAttending: false,
  hasLecturesToday: false,
  currentDate: null,
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
    lectureDates: [],
    students: null,
    value: null
  },
  availableClasses: [],
  loading: false
};

const MyAttendance = () => {
  const [attendingStudentState, setAttendingStudentState] = useState({
    isAlreadyAttending: false,
    hasLecturesToday: false,
    currentDate: null,
    attendingState: {
      attendingName: false,
      attendingClassName: false,
      attendingDate: false,
      attendingClassUid: false
    }
  });

  const [myClassesState, setMyClassesState] = useState({
    selectedClass: {
      label: "Välj klass...",
      lectureDates: [],
      students: null,
      value: null
    },
    availableClasses: [],
    loading: false
  });

  useEffect(() => {
    const attendingState = localStorage.getItem("attendingState");

    if (attendingState) {
      setAttendingStudentState(prevState => ({
        ...prevState,
        isAlreadyAttending: true,
        attendingState: JSON.parse(attendingState)
      }));
    }
  }, []);

  useEffect(() => {
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const currentDateIncluded = myClassesState.selectedClass.lectureDates.includes(
      currentDate
    );

    if (currentDateIncluded) {
      setAttendingStudentState(prevState => ({
        ...prevState,
        hasLecturesToday: true,
        currentDate: currentDate
      }));
    } else {
      setAttendingStudentState(prevState => ({
        ...prevState,
        hasLecturesToday: false
      }));
    }
  }, [myClassesState.selectedClass]);

  useEffect(() => {
    console.log("YIIIKES");
    // onSnapshot startar en lyssnare.'
    const unsubcribe = firebase.rootClassDetails().onSnapshot(snapshot => {
      let empty = snapshot.empty;
      let val = snapshot.docs;
      if (empty) {
        setMyClassesState(prevState => ({
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

        setMyClassesState(prevState => ({
          ...prevState,
          availableClasses: dataReduce,
          loading: false
        }));
      }
    });
    //Om vi använt get så hade vi inte behövt denna callback.
    return () => unsubcribe();
  }, [attendingStudentState.isAlreadyAttending]);

  const handleChange = selectedOption => {
    // Tar fram de klasserna med samma namn som det man tryckt på.
    var findSelectedClass = myClassesState.availableClasses.filter(obj => {
      return obj.value === selectedOption.value;
    });
    // console.log({ ...findSelectedClass[0] });
    setMyClassesState({
      ...myClassesState,
      selectedClass: { ...findSelectedClass[0] }
    });
  };

  // Skicka namnet på personen som registrerar sin närvaro till firebase.
  // Spara dagens datum och elevens namn till local storage. (Checkas vid rendernig)

  async function addAttendant(e, selectedName) {
    e.preventDefault();
    // const className= attendingStudentState.
    let className = myClassesState.selectedClass.label;
    let date = JSON.stringify(attendingStudentState.currentDate);
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
          // console.log("Document data:", doc.data().students);
        } else {
          // doc.data() will be undefined in this case
          return null;
        }
      })
      .catch(function(error) {
        //Lägg till ett error state när du implementerar funktionen på riktigt.
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
    noClassesMessage
  } = myClassesState;

  const {
    hasLecturesToday,
    isAlreadyAttending,
    attendingState: {
      attendingClassName,
      attendingName,
      attendingClassUid,
      attendingDate
    }
  } = attendingStudentState;

  return (
    <SCMyAttendanceContainer>
      {isAlreadyAttending ? (
        <SCAlreadyAttending>
          <img src={KyhLogo} alt="KYH Logo"></img>
          <h3>Du har redan anmält din närvaro:</h3>

          <div className="studentStatusDiv">
            Namn: {attendingName}
            <br></br>
            Klass: {attendingClassName}
            <br></br>
            Datum: {new Date(Number(attendingDate))
              .toISOString()
              .slice(0, 10)}{" "}
          </div>
          <Button onClick={() => removeAttendant()}>
            Ångra närvaro?
            {/* <CheckIcon /> */}
          </Button>
        </SCAlreadyAttending>
      ) : myClassesState.loading ? (
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

          <SCStudentNameContainer>
            {students && hasLecturesToday
              ? students.map((name, i) => (
                  <Button key={i} onClick={e => addAttendant(e, name)}>
                    {name}
                    <CheckIcon />
                  </Button>
                ))
              : null}
          </SCStudentNameContainer>
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
