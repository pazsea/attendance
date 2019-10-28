import React, { useState, useEffect } from "react";
import Dropdown from "react-dropdown";
import {
  SCClassAttendanceContainer,
  SCStudentNameContainer,
  SCAlreadyAttending,
  SCButton
} from "./styles";
import KyhLogo from "../../images/logos/kyh_logo.png";
import "react-dropdown/style.css";
import firebase from "../Firebase";
import Loading from "../Loading";
import { Fair } from "styled-icons/crypto";

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

const INITIAL_ATTENDING_CLASS_STATE = {
  isAlreadyAttending: false,
  hasLecturesToday: false,
  currentDate: null,
  loading: true,
  attendanceToday: null
};

//  Hämta hem alla klasser. Lagra dem i ett state, bäst vore availbleClasses

// Vald class hamnar i selectedClass statet med:
// tillhörande namn, uid, lecturedates, value

// När man valt klass kollar vi om dagens datum finns med i lectures-arrayen.

// Om True, hämta classUid --> "attendance" --> dagensdatum --> studenter
// Lagra alla studenter i ett attendingInClass.attendanceToday

// Om False, set något state som visare "Ingen föreläsning idag."

//Stundenterna har false eller true.
//Renderade knappar med studenternas namn och boolean olika färg.

const MyAttendance = () => {
  // const [attendingStudentState, setAttendingStudentState] = useState(
  //   INITIAL_ATTENDINGSTUDENT_STATE
  // );

  const [myClassesState, setMyClassesState] = useState(INITIAL_CLASSES_STATE);

  const [attendingInClassState, setAttendingInClassState] = useState(
    INITIAL_ATTENDING_CLASS_STATE
  );

  useEffect(() => {
    if (attendingInClassState.attendanceToday) {
      attendingInClassState.attendanceToday.map(obj => {
        console.log(obj.name);
      });
    }
  }, [attendingInClassState.attendanceToday]);

  //Checking if current date is included in the selected class lecture dates.
  useEffect(() => {
    console.log(
      "Checking if current date is included in picked class lecture dates.."
    );

    if (myClassesState.selectedClass.lectureDates) {
      const currentDateStartTime = new Date().setHours(0, 0, 0, 0);
      const currentDateEndTime = new Date().setHours(23, 59, 59, 0);
      // console.log("currentDateStartTime " + currentDateStartTime);
      // console.log("currentDateEndTime " + currentDateEndTime);

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
        console.log("validdate() " + validDate());

        const path = firebase
          .classDetails(myClassesState.selectedClass.value)
          .collection("attendance")
          .doc(validDate());

        //hämta classUid --> "attendance" --> dagensdatum --> studenter
        path.get().then(snapshot => {
          let empty = snapshot.empty; //attribut från snapshot
          let exists = snapshot.exists; //attribut från snapsho t
          let val = snapshot;

          if (empty || !exists) {
            setMyClassesState(prevState => ({
              ...prevState,
              errorClasses: "Ingen har anmält närvaro än...",
              loading: false
            }));
          } else {
            const valKeys = Object.keys(val.data());
            const valObject = val.data();

            const result = valKeys.map(name => ({
              name: name,
              attendance: valObject[name]
            }));

            setAttendingInClassState(prevState => ({
              ...prevState,
              attendanceToday: result,
              loading: false
            }));
          }
        });
      } else {
        setAttendingInClassState(prevState => ({
          ...prevState,
          hasLecturesToday: false,
          errorAttendance: "Denna klass har inga föreläsningar idag.."
        }));
      }
    } //LÄGG TILL UNSUBCRIBE. SLUTA LYSSNA
  }, [myClassesState.selectedClass]);

  useEffect(() => {
    console.log("Starting firebase listener");
    // GUSTAV: onSnapshot startar en lyssnare.'
    const unsubcribe = firebase.rootClassDetails().onSnapshot(snapshot => {
      let empty = snapshot.empty;
      let val = snapshot.docs; // Hämta allt och spara i val
      if (empty) {
        // OM empty
        setMyClassesState(prevState => ({
          ...prevState,
          errorClasses: "Inga klasser hittade från databasen...",
          loading: false
        }));
      } else {
        const dataReduce = val.reduce((acc, doc) => {
          return [
            ...acc, //Är en tom array första gången
            {
              label: doc.data().className,
              value: doc.id, // måste heta value för dropdown
              lectureDates: doc.data().lectureDates
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
  }, [attendingInClassState.isAlreadyAttending]);

  // Tar fram den valda klassens
  // När man trycker på klass i dropdownen
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

  //Deconstructing av state??
  const {
    availableClasses,
    selectedClass: { label },
    errorClasses,
    loading
  } = myClassesState;

  const { attendanceToday, isAlreadyAttending } = attendingInClassState;

  // Om loading är true = Visa loading komponent.
  // Om loading är false och om isAlreadyAttending är true

  return (
    <SCClassAttendanceContainer>
      {loading ? (
        <Loading text="Hämtar in alla klasser...."></Loading>
      ) : isAlreadyAttending ? (
        //isAlreadyAttending = true
        <SCAlreadyAttending>
          <img src={KyhLogo} alt="KYH Logo"></img>

          <div className="studentStatusDiv">Namn:</div>
        </SCAlreadyAttending>
      ) : (
        //isAlreadyAttending = false
        <>
          <img src={KyhLogo} alt="KYH Logo"></img>
          <Dropdown
            placeholder="Välj klass..."
            value={label}
            onChange={handleChange}
            options={availableClasses}
          />
          {errorClasses ? (
            <p style={{ fontWeight: "600", textAlign: "center" }}>
              {errorClasses}
            </p>
          ) : null}

          <SCStudentNameContainer>
            {attendanceToday ? (
              attendanceToday.map((object, i) => (
                <SCButton attending={object.attendance} key={i}>
                  {object.name}
                </SCButton>
              ))
            ) : (
              <p style={{ fontWeight: "600", textAlign: "center" }}></p>
            )}
          </SCStudentNameContainer>
        </>
      )}
    </SCClassAttendanceContainer>
  );
};

export default MyAttendance;

// const result = valKeys.map(name => ({
//   name: name,
//   attendance: valObject[name]
// }));

// I have a planned attendance to tomorrows lesson = alla elever
// I'll be attending = deltar in this lecture today.  = alla elever

// How do you feel about being in class from a mindfulness perspective?
// I am present at this lecture today = de elever som är där
// I am not present at this lex = de elever som inte är där
