import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../context";
import {
  SCAdminClassContainer,
  SCArrowLeftIcon,
  SCArrowRightIcon,
  SCArrowDownIcon,
  SCSPanButton
} from "./styles";

import Loading from "../Loading";

import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import firebase from "../Firebase";

// Ändra så att switchen är om studenten är false, Även Button färgen.
// Gör funktion när switchen dras.
// Fixa sorteringen...sadasd

const AdminClassAttendance = () => {
  const {
    classDetailsObject: [{ selectedClassUid, className }]
  } = useContext(Context);

  const [noLectureState, setNoLectureState] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [filteredAttendanceState, setFilterAttendanceState] = useState({
    filteredStudents: null,
    abscentFiltered: false,
    presentFiltered: false
  });

  const [lectureIndex, setLectureIndex] = useState({
    noIndex: false,
    maxIndex: null,
    minIndex: 0,
    currentIndex: null,
    indexReached: {
      max: false,
      min: false
    }
  });

  const [allLectures, setAllLectures] = useState(null);

  const [navigationState, setNavigationState] = useState(false);

  // const valKeys = Object.keys(val.data());
  // const valObject = val.data();

  // const result = valKeys.map(name => ({
  //   name: name,
  //   attendance: valObject[name]
  // }));

  // const sortedResult = result
  //   .sort(function(objectA, objectB) {
  //     return objectA.attendance - objectB.attendance;
  //   })
  //   .reverse();

  // setAttendingInClassState(prevState => ({
  //   ...prevState,
  //   attendanceToday: sortedResult,
  //   loading: false
  // }));

  useEffect(() => {
    console.log("---FIREBASE GETS LECTURES---");
    const unsubscribe = firebase
      .classDetails(selectedClassUid)
      .collection("attendance")
      .onSnapshot(snap => {
        if (snap.empty) {
          setNoLectureState(true);
        } else {
          //Sorterar docs till senaste föreläsning som uppdaterats

          let orderDocs = snap.docs.sort(function(a, b) {
            return Number(a.id) - Number(b.id);
          });

          //Fixar en ny array med flera objekt med reduce.
          //I students mappar jag ut true och false state med och sedan sorterar jag dem
          //så att tru states hamnar först i arrayen.

          let orderedDocsToState = orderDocs.reduce((acc, obj) => {
            return [
              ...acc,
              {
                className: className,
                lectureTimeUid: obj.id,
                date: new Date(Number(obj.id) + 10000000)
                  .toISOString()
                  .slice(0, 10),
                students: obj.data()
                  ? Object.keys(obj.data())
                      .map(name => ({
                        name: name,
                        attendance: obj.data()[name]
                      }))
                      .sort((objA, objB) => {
                        return objA.attendance - objB.attendance;
                      })
                      .reverse()
                  : null
              }
            ];
          }, []);
          setAllLectures(orderedDocsToState);
        }
      });

    return () => {
      unsubscribe();
    };
  }, [selectedClassUid, className]);

  useEffect(() => {
    if (allLectures) {
      console.log("---SET NEWEST LECTURE IN SELECTED LECTURE STATE---");

      let maxIndex = Number(allLectures.length - 1);

      if (maxIndex === 0) {
        setLectureIndex(prevState => ({
          ...prevState,
          noIndex: true,
          currentIndex: maxIndex
        }));
        setSelectedLecture(allLectures[maxIndex]);
      } else {
        setLectureIndex({
          maxIndex: maxIndex,
          currentIndex: maxIndex,
          indexReached: {
            max: true,
            min: false
          }
        });
        setSelectedLecture(allLectures[maxIndex]);
      }
    }
  }, [allLectures]);

  useEffect(() => {
    console.log(" ---LECTURE INDEX CHANGE--- ");

    const {
      noIndex,
      maxIndex,
      currentIndex,
      minIndex,
      indexReached: { max, min }
    } = lectureIndex;

    if (!noIndex) {
      if (maxIndex === currentIndex && !max) {
        // console.log(" ---MAX INDEX TO TRUE--- " + maxIndex);
        setLectureIndex(prevState => ({
          ...prevState,
          indexReached: {
            max: true,
            min: false
          }
        }));
      } else if (currentIndex === 0 && !min) {
        // console.log(" ---MIN INDEX TO TRUE--- ");
        setLectureIndex(prevState => ({
          ...prevState,
          indexReached: {
            max: false,
            min: true
          }
        }));
      } else if (
        (max && currentIndex < maxIndex) ||
        (min && currentIndex > minIndex)
      ) {
        // console.log(" ---!!! ELSE !!!--- ");
        // console.log("CURRENT INDEX " + currentIndex);
        // console.log("MAX INDEX " + maxIndex);
        setLectureIndex(prevState => ({
          ...prevState,
          indexReached: {
            max: false,
            min: false
          }
        }));
      }
    }

    //Här skulle du kunna spara currentIndex to LS och hämta. Persista Lecture
  }, [lectureIndex]);

  const changeLecture = value => {
    console.log(" ---Change Lecture--- ");

    const {
      currentIndex,
      indexReached: { max, min }
    } = lectureIndex;

    setFilterAttendanceState(prevState => ({
      ...prevState,
      filteredStudents: null,
      abscentFiltered: false,
      presentFiltered: false
    }));

    if (value === "increment" && !max) {
      setLectureIndex(prevState => ({
        ...prevState,
        currentIndex: Number(currentIndex + 1)
      }));

      setSelectedLecture(allLectures[Number(currentIndex + 1)]);
    } else if (value === "decrement" && !min) {
      setLectureIndex(prevState => ({
        ...prevState,
        currentIndex: currentIndex - 1
      }));
      setSelectedLecture(allLectures[currentIndex - 1]);
    }
  };

  const changeStudentAttendance = (studentName, studentAttendance) => {
    const { lectureTimeUid } = selectedLecture;

    let path = firebase
      .classDetails(selectedClassUid)
      .collection("attendance")
      .doc(lectureTimeUid);

    firebase.db.runTransaction(transaction => {
      return transaction.get(path).then(lectureDoc => {
        if (lectureDoc[studentName] === studentAttendance) {
          return;
        } else {
          transaction.update(path, {
            [studentName]: !studentAttendance
          });
        }
      });
    });
  };

  const filterFalse = () => {
    if (allLectures) {
      if (filteredAttendanceState.abscentFiltered) {
        setFilterAttendanceState(prevState => ({
          ...prevState,
          filteredStudents: null,
          abscentFiltered: false,
          presentFiltered: false
        }));
      } else {
        const filterAttendingFalse = selectedLecture.students.filter(function(
          student
        ) {
          return student.attendance === false;
        });
        setFilterAttendanceState(prevState => ({
          ...prevState,
          filteredStudents: filterAttendingFalse,
          abscentFiltered: true,
          presentFiltered: false
        }));
      }
    }
  };

  const filterTrue = () => {
    if (allLectures) {
      if (filteredAttendanceState.presentFiltered) {
        setFilterAttendanceState(prevState => ({
          ...prevState,
          filteredStudents: null,
          presentFiltered: false,
          abscentFiltered: false
        }));
      } else {
        const filterAttendingTrue = selectedLecture.students.filter(function(
          student
        ) {
          return student.attendance === true;
        });
        setFilterAttendanceState(prevState => ({
          ...prevState,
          filteredStudents: filterAttendingTrue,
          presentFiltered: true,
          abscentFiltered: false
        }));
      }
    }
  };

  const { filteredStudents } = filteredAttendanceState;
  const {
    noIndex,
    indexReached: { min, max }
  } = lectureIndex;

  return (
    <>
      {noLectureState ? (
        <div>Denna klass har ingen anmäld närvaro än...</div>
      ) : selectedLecture ? (
        <SCAdminClassContainer
          navigationState={navigationState}
          noIndex={noIndex}
        >
          <div className="adminClassInfo">
            <SCArrowLeftIcon
              onClick={() => changeLecture("decrement")}
              minIndex={min}
              noIndex={noIndex}
            ></SCArrowLeftIcon>
            <span>
              <h1>{selectedLecture.date}</h1>
              <p>{selectedLecture.className} närvarostatus</p>
            </span>
            <SCArrowRightIcon
              onClick={() => changeLecture("increment")}
              maxIndex={max}
              noIndex={noIndex}
            ></SCArrowRightIcon>
          </div>
          <div
            className="adminClassNav"
            onClick={() => setNavigationState(!navigationState)}
          >
            <p>
              Sortera <SCArrowDownIcon></SCArrowDownIcon>
            </p>
            <div className="sortingSelections">
              <button onClick={filterFalse}>Frånvarande</button>
              <button onClick={filterTrue}>Närvarande</button>
            </div>
          </div>
          <div className="adminClassStudents">
            {filteredStudents
              ? filteredStudents.map((student, index) => (
                  <SCSPanButton
                    key={student.name + "span" + index}
                    attending={student.attendance}
                  >
                    <Button
                      key={student.name + index}
                      disableTouchRipple
                      className="submitButton"
                      variant="contained"
                      type="button"
                    >
                      {student.name}
                      <Switch
                        color="primary"
                        onChange={() =>
                          changeStudentAttendance(
                            student.name,
                            student.attendance
                          )
                        }
                        checked={student.attendance}
                      ></Switch>
                    </Button>
                  </SCSPanButton>
                ))
              : selectedLecture.students.map((student, index) => (
                  <SCSPanButton
                    key={student.name + "span" + index}
                    attending={student.attendance}
                  >
                    <Button
                      key={student.name + index}
                      disableTouchRipple
                      className="submitButton"
                      variant="contained"
                      type="button"
                    >
                      {student.name}
                      <Switch
                        color="primary"
                        onChange={() =>
                          changeStudentAttendance(
                            student.name,
                            student.attendance
                          )
                        }
                        checked={student.attendance}
                      ></Switch>
                    </Button>
                  </SCSPanButton>
                ))}
          </div>
        </SCAdminClassContainer>
      ) : (
        <Loading text="Hämtar föreläsningar..."></Loading>
      )}
    </>
  );
};

export default AdminClassAttendance;
