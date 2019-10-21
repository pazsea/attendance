import React, { useState, useEffect } from "react";
import Dropdown from "react-dropdown";
import { SCMyAttendanceContainer } from "./styles";
import Loading from "../Loading";
import firebase from "../Firebase";
import "react-dropdown/style.css";
import KyhLogo from "../../images/logos/kyh_logo.png";
import Button from "@material-ui/core/Button";

// Landingsida för icke inloggade

const MyAttendance = props => {
  const [validClassState, setValidClassState] = useState({
    hasLecturesToday: false
  });

  const [myAttendanceState, setMyAttendanceState] = useState({
    selectedClass: {
      label: "Välj klass...",
      lectureDates: []
    },
    availableClasses: [],
    loading: false
  });

  useEffect(() => {
    const currentDate = new Date().setHours(0, 0, 0, 0);

    const consistentDates = myAttendanceState.selectedClass.lectureDates.includes(
      currentDate
    );

    if (consistentDates) {
      setValidClassState({
        hasLecturesToday: true
      });
    } else {
      setValidClassState({
        hasLecturesToday: false
      });
    }
    console.log(consistentDates);
    // currentDate ===  myAttendanceState.selectedClass.lectureDates
  }, [myAttendanceState.selectedClass]);

  useEffect(() => {
    // onSnapshot startar en lyssnare.
    const unsubcribe = firebase.rootClassDetails().onSnapshot(snapshot => {
      let empty = snapshot.empty;
      let val = snapshot.docs;
      if (empty) {
        setMyAttendanceState({
          ...myAttendanceState,
          noClassesMessage: "Inga klasser hittade från databasen...",
          loading: false
        });
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

  const sendToDB = () => {
    //Skicka till CLASSDETAILS PATHEN men VALID CLASSUID
    //Skapa attendance COLLECTION i pathen med rätt tid som
  };

  const {
    availableClasses,
    selectedClass: { label, students },
    noClassesMessage
  } = myAttendanceState;

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

          {students ? students.map((name, i) => <li key={i}>{name}</li>) : null}

          <Button
            className="submitButton"
            variant="contained"
            color="secondary"
            type="submit"
            margin="normal"
            size="large"
            onClick={sendToDB}
            disabled={!validClassState.hasLecturesToday}
          >
            Anmäl närvaro
          </Button>
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

// const data = new Date().setHours(0,0,0,0)
// That will set the time to 00:00:00.000 of your current timezone, if you want to work in UTC time, you can use the setUTCHours method.
// https://stackoverflow.com/questions/3894048/what-is-the-best-way-to-initialize-a-javascript-date-to-midnight
//[1569535200000, 1569535200000, 1569535200000]
// Anmäl närvaro
// 20190909
// moment().format("MMM Do YY");
// moment().format('L');      // 2019-10-21
