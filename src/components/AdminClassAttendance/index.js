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
    filteredAttendanceStateStudents: null,
    abscentFiltered: false,
    presentFiltered: false
  });

  const [lectureIndex, setLectureIndex] = useState({
    maxIndex: null,
    currentIndex: null
  });

  const [allLectures, setAllLectures] = useState(null);

  const [navigationState, setNavigationState] = useState(false);

  // useEffect(() => {
  //   console.log(lectureIndex);
  // }, [lectureIndex]);

  useEffect(() => {
    if (allLectures) {
      console.log("Set Class to closest to your date");
      setLectureIndex({
        maxIndex: Number(allLectures.length - 1),
        currentIndex: Number(allLectures.length - 1)
      });
      setSelectedLecture(allLectures[Number(allLectures.length - 1)]);

      // setLectureState(prevState => ({
      //   ...prevState,
      //   selectedLectureIndex: prevState.allLectures.length - 1
      // }));
    }
  }, [allLectures]);

  useEffect(() => {
    console.log("startar");
    const unsubscribe = firebase
      .classDetails(selectedClassUid)
      .collection("attendance")
      .onSnapshot(snap => {
        if (snap.empty) {
          setNoLectureState(true);
        } else {
          let orderDocs = snap.docs.sort(function(a, b) {
            return Number(a.id) - Number(b.id);
          });

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
                  ? Object.keys(obj.data()).map(name => ({
                      name: name,
                      attendance: obj.data()[name]
                    }))
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

  const changeLecture = value => {
    const { maxIndex, currentIndex } = lectureIndex;

    if (value === "increment" && maxIndex === currentIndex) {
      setLectureIndex(prevState => ({
        ...prevState,
        currentIndex: 0
      }));
      setSelectedLecture(allLectures[0]);
    } else if (value === "increment") {
      setLectureIndex(prevState => ({
        ...prevState,
        currentIndex: Number(currentIndex + 1)
      }));
      setSelectedLecture(allLectures[Number(currentIndex + 1)]);
    } else if (value === "decrement" && currentIndex === 0) {
      setLectureIndex(prevState => ({
        ...prevState,
        currentIndex: maxIndex
      }));
      setSelectedLecture(allLectures[maxIndex]);
    } else {
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

  return (
    <>
      {noLectureState ? (
        <div>Denna klass har ingen anmäld närvaro än...</div>
      ) : selectedLecture ? (
        <SCAdminClassContainer navigationState={navigationState}>
          <div className="adminClassInfo">
            <SCArrowLeftIcon
              onClick={() => changeLecture("decrement")}
            ></SCArrowLeftIcon>
            <span>
              <h1>{selectedLecture.date}</h1>
              <p>{selectedLecture.className} närvarostatus</p>
            </span>
            <SCArrowRightIcon
              onClick={() => changeLecture("increment")}
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
                        defaultChecked={student.attendance}
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
                        defaultChecked={student.attendance}
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
