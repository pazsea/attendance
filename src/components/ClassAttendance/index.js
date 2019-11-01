import React, { useState, useEffect } from "react";
import Dropdown from "react-dropdown";
import {
  SCClassAttendanceContainer,
  SCStudentNameContainer,
  SCAlreadyAttending,
  SCButton,
  SCArrowDownIcon
} from "./styles";
import KyhLogo from "../../images/logos/kyh_logo.png";
import "react-dropdown/style.css";
import firebase from "../Firebase";
import Loading from "../Loading";

const INITIAL_CLASSES_STATE = {
  selectedClass: {
    label: "Välj klass...",
    lectureDates: null,
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
  studentAttendanceToday: null,
  filteredAttendanceList: null,
  errorAttendance: null,
  presentFiltered: false,
  abscentFiltered: false
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
  const [navigationState, setNavigationState] = useState(false);

  const [myClassesState, setMyClassesState] = useState(INITIAL_CLASSES_STATE);

  const [attendingInClassState, setAttendingInClassState] = useState(
    INITIAL_ATTENDING_CLASS_STATE
  );

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
        path.onSnapshot(snapshot => {
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

            const sortedResult = result
              .sort(function(objectA, objectB) {
                return objectA.attendance - objectB.attendance;
              })
              .reverse();

            setAttendingInClassState(prevState => ({
              ...prevState,
              studentAttendanceToday: sortedResult,
              loading: false
            }));
          }
        });
      } else {
        //BUGGEN som behövdes fixas. Om det inte var någon föreläsning idag så måste states med student i föregående förläsning tas bort.
        setAttendingInClassState(prevState => ({
          ...prevState,
          hasLecturesToday: false,
          studentAttendanceToday: null,
          filteredAttendanceList: null,
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
    console.log({ ...findSelectedClass[0] });

    setMyClassesState({
      ...myClassesState,
      selectedClass: { ...findSelectedClass[0] }
    });
  };

  const filterFalse = () => {
    if (attendingInClassState.studentAttendanceToday) {
      if (attendingInClassState.abscentFiltered) {
        setAttendingInClassState(prevState => ({
          ...prevState,
          filteredAttendanceList: null,
          abscentFiltered: false,
          presentFiltered: false
        }));
      } else {
        const filterAttendingFalse = attendingInClassState.studentAttendanceToday.filter(
          function(student) {
            return student.attendance === false;
          }
        );
        setAttendingInClassState(prevState => ({
          ...prevState,
          filteredAttendanceList: filterAttendingFalse,
          abscentFiltered: true,
          presentFiltered: false
        }));
      }
    }
  };

  const filterTrue = () => {
    if (attendingInClassState.studentAttendanceToday) {
      if (attendingInClassState.presentFiltered) {
        setAttendingInClassState(prevState => ({
          ...prevState,
          filteredAttendanceList: null,
          presentFiltered: false,
          abscentFiltered: false
        }));
      } else {
        const filterAttendingTrue = attendingInClassState.studentAttendanceToday.filter(
          function(student) {
            return student.attendance === true;
          }
        );
        setAttendingInClassState(prevState => ({
          ...prevState,
          filteredAttendanceList: filterAttendingTrue,
          presentFiltered: true,
          abscentFiltered: false
        }));
      }
    }
  };

  // const presentSorted

  //Deconstructing av state??
  const {
    availableClasses,
    selectedClass: { label },
    errorClasses,
    loading
  } = myClassesState;

  const {
    studentAttendanceToday,
    filteredAttendanceList,
    isAlreadyAttending,
    errorAttendance
  } = attendingInClassState;

  // Om loading är true = Visa loading komponent.
  // Om loading är false och om isAlreadyAttending är true
  // console.log("Gustav log " + attendingInClassState.);

  return (
    <SCClassAttendanceContainer navigationState={navigationState}>
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
          <div className="adminClassInfo">
            <span>
              <h1>26 MAJ 2019</h1>
              <p>FE16 närvarostatus</p>
            </span>
          </div>
          <div
            className="adminClassNav"
            onClick={() => setNavigationState(!navigationState)}
          >
            {/* Till senare: Kanske underline på valt sorteringsalternativ */}
            <p>
              Sortera <SCArrowDownIcon></SCArrowDownIcon>
            </p>
            <div className="sortingSelections">
              <button onClick={filterFalse}>Frånvarande</button>
              <button onClick={filterTrue}>Närvarande</button>
            </div>
          </div>

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
          ) : (
            <>
              {attendingInClassState.studentAttendanceToday ? (
                <p style={{ fontWeight: "600", textAlign: "center" }}>
                  {attendingInClassState.studentAttendanceToday.filter(
                    student => student.attendance
                  ).length +
                    " av " +
                    attendingInClassState.studentAttendanceToday.length +
                    " studenter närvarande idag"}
                </p>
              ) : null}
            </>
          )}

          {/* const short = Object.values(data).filter((v) => v).length; */}

          <SCStudentNameContainer>
            {filteredAttendanceList ? (
              filteredAttendanceList.map((object, i) => (
                <SCButton attending={object.attendance} key={i}>
                  {object.name}
                </SCButton>
              ))
            ) : studentAttendanceToday ? (
              studentAttendanceToday.map((object, i) => (
                <SCButton attending={object.attendance} key={i}>
                  {object.name}
                </SCButton>
              ))
            ) : (
              <p style={{ fontWeight: "600", textAlign: "center" }}>
                {errorAttendance}
              </p>
            )}
          </SCStudentNameContainer>
        </>
      )}
    </SCClassAttendanceContainer>
  );
};

export default MyAttendance;

// var state = [
//   {name: "Pelle Larsson",
//   attendance: true},
//   {"Sara Överström": false}

// ]
// const short = Object.values(data).filter((v) => v).length;

// $('#msg').html(data.message)

// console.log(short)
